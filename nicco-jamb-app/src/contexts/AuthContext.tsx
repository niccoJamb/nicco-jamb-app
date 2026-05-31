import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { appUrl, getAppUrl } from '@/lib/appUrl';
import type { Session, User } from '@supabase/supabase-js';
import { newlyEarnedBadges } from '@/data/badges';

export interface Profile {
  id: string;
  name: string | null;
  phone: string | null;
  target_score: number | null;
  subjects: string[] | null;
  current_streak: number | null;
  longest_streak: number | null;
  last_practice_date: string | null;
}

export interface QuizHistoryEntry {
  id: string;
  title: string;
  subject_id: string | null;
  score: number;
  total: number;
  time_spent: number;
  created_at: string;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  history: QuizHistoryEntry[];
  badges: string[];
  isBanned: boolean;
  loading: boolean;
  isEmailVerified: boolean;
  signUp: (email: string, password: string, name?: string, phone?: string) => Promise<{ error: string | null; needsVerification?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
  resendVerification: (email: string) => Promise<{ error: string | null }>;
  saveQuizResult: (data: { title: string; subject_id?: string; score: number; total: number; time_spent: number }) => Promise<string[]>;
  refreshHistory: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshBadges: () => Promise<void>;
  recheckVerification: () => Promise<boolean>;
  verifyEmailFromUrl: () => Promise<{ verified: boolean; error: string | null }>;
  refreshSession: () => Promise<boolean>;

}



const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [history, setHistory] = useState<QuizHistoryEntry[]>([]);
  const [badges, setBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (data) setProfile(data as Profile);
  }, []);

  const loadBadges = useCallback(async (userId: string) => {
    const { data } = await supabase.from('user_badges').select('badge_key').eq('user_id', userId);
    setBadges((data || []).map((b: any) => b.badge_key));
  }, []);

  const refreshHistory = useCallback(async () => {
    if (!user) { setHistory([]); return; }
    const { data } = await supabase
      .from('quiz_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);
    setHistory((data as QuizHistoryEntry[]) || []);
  }, [user]);

  /**
   * Force-sync the auth state with the SERVER.
   *
   * Root cause of the "infinite verification loop": after a user clicks the
   * verification link, Supabase updates `email_confirmed_at` on the server, but
   * the JWT/session already cached in this browser was minted BEFORE verification
   * and still says `email_confirmed_at: null`. Reading the cached session user
   * therefore keeps reporting "unverified" forever.
   *
   * The fix is to (1) refresh the session so a NEW JWT is minted with the updated
   * claims, and (2) fall back to `getUser()` which queries the Auth server directly
   * for the authoritative, up-to-date user record.
   */
  const syncAuthFromServer = useCallback(async () => {
    try {
      // 1) Try to refresh the session → new JWT carries fresh email_confirmed_at
      const { data: refreshed } = await supabase.auth.refreshSession();
      if (refreshed?.session) {
        setSession(refreshed.session);
        setUser(refreshed.session.user);
      }
      // 2) Authoritative server-side fetch (does not rely on cached token claims)
      const { data: fresh } = await supabase.auth.getUser();
      if (fresh?.user) {
        setUser(fresh.user);
      }
    } catch (e) {
      console.warn('syncAuthFromServer failed:', e);
    }
  }, []);

  // Initialize session + listen for changes
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);

      // If we have a session but it looks unverified, double-check with the
      // server in case the cached token is stale (returning from a verify link).
      if (data.session && !data.session.user?.email_confirmed_at) {
        await syncAuthFromServer();
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (!newSession) {
        setProfile(null);
        setHistory([]);
      }
      // Supabase emits USER_UPDATED / TOKEN_REFRESHED after email confirmation —
      // these carry the updated email_confirmed_at, breaking the stale-token loop.
    });

    // When the user returns to this tab (e.g. after clicking the verify link in
    // another tab), re-check verification status from the server.
    const onFocus = () => {
      if (document.visibilityState === 'visible') {
        syncAuthFromServer();
      }
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);

    return () => {
      sub.subscription.unsubscribe();
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [syncAuthFromServer]);

  // Load profile + history + badges whenever user changes
  useEffect(() => {
    if (user) {
      loadProfile(user.id);
      refreshHistory();
      loadBadges(user.id);
    } else {
      setBadges([]);
    }
  }, [user, loadProfile, refreshHistory, loadBadges]);


  const signUp = async (email: string, password: string, name?: string, phone?: string) => {
    // Always send users back to the CANONICAL custom domain, never the temporary
    // deploypad.app preview origin (otherwise the session can't refresh after verify).
    const emailRedirectTo = appUrl('/verified');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, phone }, emailRedirectTo },
    });
    if (error) return { error: error.message };

    // Create profile row
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        name: name || null,
        phone: phone || null,
      });
      if (profileError) console.warn('Profile upsert error:', profileError.message);
    }

    // Subscribe to CRM
    try {
      await fetch('https://famous.ai/api/crm/6a1206c51219c95ac14ee2bb/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email, name,
          source: 'signup',
          tags: ['signup', 'jamb-students'],
        }),
      });
    } catch {}

    // NOTE: We no longer call a custom send-verification-email edge function.
    // Supabase Auth itself sends the confirmation email through the project's
    // built-in email system (the connected Resend API key / SMTP, From:
    // noreply@centerkross.com). The `emailRedirectTo` passed to signUp above
    // controls where the confirmation link returns the user.

    // Send branded welcome email via Resend (fire-and-forget)
    try {
      supabase.functions.invoke('send-welcome-email', {
        body: { email, name, appUrl: getAppUrl() },
      }).catch((e) => console.warn('Welcome email error:', e));
    } catch (e) {
      console.warn('Welcome email invoke failed:', e);
    }




    // Email verification has been turned off — every new account is considered
    // fully active immediately, so we never ask the user to verify.
    return { error: null, needsVerification: false };
  };


  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      // Supabase returns a generic error when an account is banned at the auth level.
      if (/banned|blocked/i.test(error.message)) {
        return { error: 'Your account has been restricted. Please contact support.' };
      }
      return { error: error.message };
    }
    // Secondary check: profile-level ban flag (covers cases where the auth ban
    // hasn't propagated yet). If banned, immediately sign out.
    if (data.user) {
      const { data: prof } = await supabase
        .from('profiles')
        .select('is_banned')
        .eq('id', data.user.id)
        .maybeSingle();
      if (prof?.is_banned) {
        await supabase.auth.signOut();
        return { error: 'Your account has been restricted. Please contact support.' };
      }
    }
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const redirectTo = appUrl('/reset-password');
    // Use Supabase's built-in password-reset email (delivered through the
    // project's connected Resend / SMTP, From: noreply@centerkross.com).
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) return { error: error.message };
      return { error: null };
    } catch (e: any) {
      return { error: e?.message || 'Failed to send reset email' };
    }
  };


  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { error: error.message };
    return { error: null };
  };

  const resendVerification = async (email: string) => {
    const emailRedirectTo = appUrl('/verified');
    // Use Supabase's built-in confirmation email (delivered through the
    // project's connected Resend / SMTP) instead of a custom edge function.
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo },
      });
      if (error) return { error: error.message };
      return { error: null };
    } catch (e: any) {
      return { error: e?.message || 'Failed to resend verification email' };
    }
  };



  // Compute & persist the daily practice streak after a quiz is completed.
  // Uses the user's LOCAL calendar date so "a new day" matches the student's
  // own timezone rather than UTC.
  const updateStreak = useCallback(async (): Promise<string[]> => {
    if (!user) return [];
    const localDateStr = (d: Date) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };
    const today = new Date();
    const todayStr = localDateStr(today);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = localDateStr(yesterday);

    // Read the freshest streak values from the DB to avoid stale state.
    const { data: current } = await supabase
      .from('profiles')
      .select('current_streak, longest_streak, last_practice_date')
      .eq('id', user.id)
      .maybeSingle();

    const last = current?.last_practice_date ?? null;
    const prevStreak = current?.current_streak ?? 0;
    const prevLongest = current?.longest_streak ?? 0;

    // Already practiced today → nothing changes.
    if (last === todayStr) return [];

    let newStreak: number;
    if (last === yesterdayStr) {
      newStreak = prevStreak + 1; // continued the streak
    } else {
      newStreak = 1; // first ever, or the streak was broken
    }
    const newLongest = Math.max(prevLongest, newStreak);

    const { error: streakError } = await supabase
      .from('profiles')
      .update({
        current_streak: newStreak,
        longest_streak: newLongest,
        last_practice_date: todayStr,
      })
      .eq('id', user.id);

    if (streakError) {
      console.warn('Streak update error:', streakError.message);
      return [];
    }
    await loadProfile(user.id);

    // Award any newly-reached milestone badges and persist them.
    const earned = newlyEarnedBadges(prevStreak, newStreak);
    if (earned.length) {
      const rows = earned.map((key) => ({ user_id: user.id, badge_key: key }));
      const { error: badgeErr } = await supabase
        .from('user_badges')
        .upsert(rows, { onConflict: 'user_id,badge_key', ignoreDuplicates: true });
      if (badgeErr) console.warn('Badge insert error:', badgeErr.message);
      await loadBadges(user.id);
    }
    return earned;
  }, [user, loadProfile, loadBadges]);

  const saveQuizResult = async (data: { title: string; subject_id?: string; score: number; total: number; time_spent: number }): Promise<string[]> => {
    if (!user) return [];
    const { error } = await supabase.from('quiz_history').insert({
      user_id: user.id,
      title: data.title,
      subject_id: data.subject_id || null,
      score: data.score,
      total: data.total,
      time_spent: data.time_spent,
    });
    if (error) {
      console.warn('Quiz save error:', error.message);
      return [];
    }
    await refreshHistory();
    return await updateStreak();
  };

  const refreshProfile = useCallback(async () => {
    if (user) await loadProfile(user.id);
  }, [user, loadProfile]);

  const refreshBadges = useCallback(async () => {
    if (user) await loadBadges(user.id);
  }, [user, loadBadges]);

  // Explicitly force a fresh session token (new JWT) from the server.
  // Returns true if a session is present afterwards.
  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (!error && data?.session) {
        setSession(data.session);
        setUser(data.session.user);
        return true;
      }
    } catch (e) {
      console.warn('refreshSession failed:', e);
    }
    return false;
  }, []);

  /**
   * Process the verification token that lives in the URL when the user lands on
   * /verified after clicking the email link.
   *
   * Handles every link format Supabase can produce so the flow works whether the
   * user verifies in the SAME browser, a DIFFERENT tab, or on MOBILE:
   *   - PKCE:        ?code=...                  → exchangeCodeForSession
   *   - OTP / signup:?token_hash=...&type=...   → verifyOtp
   *   - Implicit:    #access_token=...&refresh_token=... → setSession
   *
   * After establishing a session we ALWAYS refreshSession() + getUser() so the
   * token carries the updated email_confirmed_at (kills the stale-token loop).
   */
  const verifyEmailFromUrl = useCallback(async (): Promise<{ verified: boolean; error: string | null }> => {
    try {
      const url = new URL(window.location.href);
      const search = url.searchParams;
      const hash = new URLSearchParams(url.hash.replace(/^#/, ''));

      // Surface any error Supabase appended to the URL.
      const urlError = search.get('error_description') || hash.get('error_description')
        || search.get('error') || hash.get('error');

      const code = search.get('code');
      const tokenHash = search.get('token_hash') || hash.get('token_hash');
      const type = (search.get('type') || hash.get('type')) as any;
      const accessToken = hash.get('access_token');
      const refreshToken = hash.get('refresh_token');
      // 1) PKCE code flow
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) console.warn('exchangeCodeForSession:', error.message);
      }
      // 2) OTP / signup / magiclink token_hash flow — THIS is the path our
      //    Resend-emailed links use. verifyOtp needs no PKCE code_verifier, so it
      //    works in any browser/tab/device and reliably confirms the email.
      else if (tokenHash && type) {
        const { data: otpData, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
        if (error) {
          console.warn('verifyOtp:', error.message);
        } else if (otpData?.session) {
          // verifyOtp already returns a fresh, confirmed session — adopt it now.
          setSession(otpData.session);
          setUser(otpData.session.user);
        }
      }
      // 3) Implicit flow with tokens in the hash
      else if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (error) console.warn('setSession:', error.message);
      }

      // Clean the sensitive token data out of the address bar.
      try {
        window.history.replaceState({}, document.title, url.pathname);
      } catch {}

      // Authoritative server fetch to confirm email_confirmed_at is now set.
      // (refreshSession can briefly return a stale token right after verifyOtp,
      //  so getUser — which queries the auth server — is the source of truth.)
      const { data: fresh } = await supabase.auth.getUser();
      if (fresh?.user) {
        setUser(fresh.user);
      } else {
        await refreshSession();
      }

      const { data: latest } = await supabase.auth.getUser();
      const verifiedUser = latest?.user || fresh?.user;
      if (verifiedUser) setUser(verifiedUser);

      const verified = !!verifiedUser?.email_confirmed_at;
      return { verified, error: verified ? null : (urlError || null) };
    } catch (e: any) {
      console.warn('verifyEmailFromUrl failed:', e);
      return { verified: false, error: e?.message || null };
    }
  }, [refreshSession]);


  // Explicit "I've already verified — recheck now" action used by the banner.
  // Returns true if, after syncing with the server, the email is now verified.
  const recheckVerification = useCallback(async (): Promise<boolean> => {
    await syncAuthFromServer();
    const { data } = await supabase.auth.getUser();
    return !!data?.user?.email_confirmed_at;
  }, [syncAuthFromServer]);

  // Email verification is disabled: any signed-in user is treated as verified
  // so no verification gates, banners, or checks ever block access.
  const isEmailVerified = !!user;
  const isBanned = !!profile?.is_banned;

  return (
    <AuthContext.Provider value={{ user, session, profile, history, badges, isBanned, loading, isEmailVerified, signUp, signIn, signOut, resetPassword, updatePassword, resendVerification, saveQuizResult, refreshHistory, refreshProfile, refreshBadges, recheckVerification, verifyEmailFromUrl, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};



export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
