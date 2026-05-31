import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, AlertCircle, CheckCircle2, ArrowLeft, Eye, EyeOff, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { refreshSession } = useAuth();
  const [tokenHash, setTokenHash] = useState<string | null>(null);
  const [tokenType, setTokenType] = useState<string>('recovery');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [linkInvalid, setLinkInvalid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);


  const passwordsMatch = password.length > 0 && password === confirm;
  const passwordsMismatch = confirm.length > 0 && password !== confirm;


  // Read the recovery token from the URL on mount. Supabase's built-in
  // password-reset email links to /reset-password?token_hash=...&type=recovery
  // (older links may instead carry tokens in the #hash, or already be exchanged
  // into a session via the implicit/PKCE flow).
  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const hash = window.location.hash
      ? new URLSearchParams(window.location.hash.replace(/^#/, ''))
      : new URLSearchParams();

    const t = search.get('token_hash') || hash.get('token_hash');
    const type = search.get('type') || hash.get('type') || 'recovery';
    const accessToken = hash.get('access_token');
    const refreshToken = hash.get('refresh_token');

    if (t) {
      setTokenHash(t);
      setTokenType(type);
    } else if (accessToken && refreshToken) {
      // Implicit flow — a recovery session is established directly from the hash.
      supabase.auth
        .setSession({ access_token: accessToken, refresh_token: refreshToken })
        .then(({ error }) => {
          if (error) setLinkInvalid(true);
        });
    } else {
      // Maybe a recovery session already exists (PKCE exchange handled elsewhere).
      supabase.auth.getSession().then(({ data }) => {
        if (!data.session) setLinkInvalid(true);
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      // 1) If we have a token_hash, exchange it for a recovery session using
      //    Supabase's built-in verifyOtp (no custom edge function needed).
      if (tokenHash) {
        const { error: otpError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: tokenType as any,
        });
        if (otpError) {
          setError(otpError.message || 'This reset link is invalid or has expired.');
          setLoading(false);
          return;
        }
      }

      // 2) Update the password on the now-authenticated recovery session.
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(updateError.message || 'Failed to reset password');
        setLoading(false);
        return;
      }

      // 3) Keep the user LOGGED IN. The recovery flow already established a valid
      //    session; refresh it so a fresh JWT is minted and the AuthContext picks
      //    up the signed-in user, then drop them straight into the app.
      await refreshSession();

      setSuccess(true);
      setLoading(false);

      setTimeout(() => navigate('/'), 1800);
    } catch (err: any) {
      setError(err?.message || 'Failed to reset password');
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-white">
            <h1 className="text-2xl font-bold mb-1">Reset Your Password</h1>
            <p className="text-white/90 text-sm">Choose a new password for your account</p>
          </div>

          <div className="p-6">
            {success ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="font-bold text-lg text-gray-900 mb-1">Password updated!</h2>
                <p className="text-sm text-gray-600 mb-2">
                  Your password has been changed and you're now signed in. Taking you to your dashboard...
                </p>
                <div className="flex items-center justify-center gap-2 text-green-600 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" /> Redirecting
                </div>
              </div>

            ) : linkInvalid ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="font-bold text-lg text-gray-900 mb-2">Reset link missing</h2>
                <p className="text-sm text-gray-600 mb-4">
                  This page needs to be opened from the password reset email. Please request a new reset link from the sign-in screen.
                </p>
                <Button
                  onClick={() => navigate('/')}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                >
                  Back to Sign In
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">New Password</label>
                  <div className="relative">
                    <Lock className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                      required
                      minLength={6}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(s => !s)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Confirm Password</label>
                  <div className="relative">
                    <Lock className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none ${
                        passwordsMismatch
                          ? 'border-red-400 focus:border-red-500'
                          : passwordsMatch
                          ? 'border-green-400 focus:border-green-500'
                          : 'border-gray-300 focus:border-green-500'
                      }`}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(s => !s)}
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordsMismatch && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <X className="h-3 w-3" /> Passwords do not match
                    </p>
                  )}
                  {passwordsMatch && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <Check className="h-3 w-3" /> Passwords match
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading || linkInvalid || !passwordsMatch || password.length < 6}

                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
