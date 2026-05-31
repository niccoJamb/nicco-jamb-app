import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Phone, AlertCircle, ArrowLeft, CheckCircle2, MailCheck, RefreshCw, Eye, EyeOff, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useResendCooldown } from '@/hooks/useResendCooldown';
import { toast } from 'sonner';


interface SignInModalProps {
  open: boolean;
  onClose: () => void;
}

type Mode = 'signin' | 'signup' | 'forgot' | 'verify';

const SignInModal: React.FC<SignInModalProps> = ({ open, onClose }) => {
  const { signIn, signUp, resetPassword, resendVerification, user, isEmailVerified } = useAuth();
  const [mode, setMode] = useState<Mode>('signup');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState('');
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const REMEMBER_KEY = 'nicco_remember_email';
  const { remaining: resendRemaining, isCoolingDown: resendCoolingDown, start: startResendCooldown } =
    useResendCooldown(60, 'nicco_resend_cooldown');

  const passwordsMatch = form.password.length > 0 && form.password === form.confirmPassword;
  const passwordsMismatch = form.confirmPassword.length > 0 && form.password !== form.confirmPassword;


  // Password strength calculation
  const calcPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: '', color: '', barColor: '', textColor: '' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    // Map score (0-5) to 4 buckets
    let level: 1 | 2 | 3 | 4 = 1;
    if (score <= 1) level = 1;
    else if (score === 2) level = 2;
    else if (score === 3 || score === 4) level = 3;
    else level = 4;
    // Hard cap: very short passwords are always weak
    if (pwd.length < 6) level = 1;
    const map = {
      1: { label: 'Weak', barColor: 'bg-red-500', textColor: 'text-red-600', widthPct: 25 },
      2: { label: 'Fair', barColor: 'bg-orange-500', textColor: 'text-orange-600', widthPct: 50 },
      3: { label: 'Good', barColor: 'bg-yellow-500', textColor: 'text-yellow-600', widthPct: 75 },
      4: { label: 'Strong', barColor: 'bg-green-500', textColor: 'text-green-600', widthPct: 100 },
    } as const;
    return { score: level, ...map[level] };
  };
  const passwordStrength = calcPasswordStrength(form.password);
  const isStrongEnough = mode !== 'signup' || passwordStrength.score >= 2;

  // Auto-close if user becomes authenticated AND verified (don't close on the verify screen)
  useEffect(() => {
    if (open && user && isEmailVerified && !done && mode !== 'forgot' && mode !== 'verify') {
      setDone(true);
      setTimeout(() => { setDone(false); onClose(); }, 1200);
    }
  }, [user, isEmailVerified, open, done, onClose, mode]);

  // Reset form when modal closes

  useEffect(() => {
    if (!open) {
      // Pre-load any remembered email so it's ready next time the modal opens
      let rememberedEmail = '';
      try {
        rememberedEmail = localStorage.getItem(REMEMBER_KEY) || '';
      } catch {
        rememberedEmail = '';
      }
      setForm({ name: '', email: rememberedEmail, phone: '', password: '', confirmPassword: '' });
      setRememberMe(!!rememberedEmail);
      setError(null);
      setLoading(false);
      setDone(false);
      setResetSent(false);
      setVerifyEmail('');
      setResendStatus('idle');
      setResendMessage(null);
      setShowPassword(false);
      setShowConfirmPassword(false);
      setMode('signup');
    } else {
      // When the modal opens, auto-fill email from localStorage if available
      try {
        const rememberedEmail = localStorage.getItem(REMEMBER_KEY);
        if (rememberedEmail) {
          setForm(f => (f.email ? f : { ...f, email: rememberedEmail }));
          setRememberMe(true);
        }
      } catch {
        // ignore storage errors
      }
    }
  }, [open]);



  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Extra guard for signup — make sure password is strong enough and matches before submitting
    if (mode === 'signup') {
      if (form.password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (passwordStrength.score < 2) {
        setError('Your password is too weak. Add length, uppercase letters, numbers, or symbols.');
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match. Please re-enter your password.');
        return;
      }
    }


    setLoading(true);
    try {
      if (mode === 'forgot') {
        const result = await resetPassword(form.email);
        if (result.error) {
          setError(result.error);
        } else {
          setResetSent(true);
        }
      } else if (mode === 'signup') {
        const result = await signUp(form.email, form.password, form.name, form.phone);
        if (result.error) {
          setError(result.error);
        }
        // Email verification is disabled — once signup succeeds the user is fully
        // active and signed in, so the auto-close effect below dismisses the modal.
      } else if (mode === 'signin') {
        const result = await signIn(form.email, form.password);
        if (result.error) {
          setError(result.error);
        } else {
          // Persist or clear the remembered email based on the checkbox
          try {
            if (rememberMe && form.email) {
              localStorage.setItem(REMEMBER_KEY, form.email);
            } else {
              localStorage.removeItem(REMEMBER_KEY);
            }
          } catch {
            // ignore storage errors
          }
        }
      }

    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleResend = async () => {
    if (!verifyEmail || resendCoolingDown || resendStatus === 'sending') return;
    setResendStatus('sending');
    setResendMessage(null);
    const result = await resendVerification(verifyEmail);
    if (result.error) {
      setResendStatus('error');
      setResendMessage(result.error);
      toast.error('Could not resend email', { description: result.error });
    } else {
      setResendStatus('sent');
      setResendMessage('Verification email sent. Please check your inbox.');
      startResendCooldown();
      toast.success('Verification email sent', {
        description: `We emailed a fresh link to ${verifyEmail}. Check your inbox (and spam).`,
      });
    }
  };


  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setError(null);
    setResetSent(false);
    setResendStatus('idle');
    setResendMessage(null);
  };

  const headerTitle =
    mode === 'signin' ? 'Welcome Back' :
    mode === 'signup' ? 'Join Nicco JAMB' :
    mode === 'forgot' ? 'Reset Password' :
    'Verify Your Email';

  const headerSubtitle =
    mode === 'signin' ? 'Sign in to continue your prep' :
    mode === 'signup' ? 'Start your JAMB success journey today' :
    mode === 'forgot' ? 'We will email you a secure reset link' :
    'One more step before you can practise';

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg">
            <X className="h-5 w-5" />
          </button>
          {mode === 'forgot' && (
            <button
              onClick={() => switchMode('signin')}
              className="flex items-center gap-1 text-white/90 text-sm mb-2 hover:text-white"
              type="button"
            >
              <ArrowLeft className="h-4 w-4" /> Back to sign in
            </button>
          )}
          <h2 className="text-2xl font-bold mb-1">{headerTitle}</h2>
          <p className="text-white/90 text-sm">{headerSubtitle}</p>
        </div>

        <div className="p-6 space-y-4">
          {done ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="font-bold text-lg text-gray-900">You are all set!</h3>
              <p className="text-sm text-gray-600">Welcome aboard. Loading your dashboard...</p>
            </div>
          ) : mode === 'verify' ? (
            <div className="text-center py-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MailCheck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">Check your email to verify your account</h3>
              <p className="text-sm text-gray-600 mb-4">
                We just sent a verification link to{' '}
                <span className="font-medium text-gray-900">{verifyEmail}</span>.
                Click the link in the email to activate your account and unlock quiz access.
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Tip: check your spam or promotions folder if you don't see it within a minute.
              </p>

              {resendMessage && (
                <div className={`flex items-start gap-2 p-3 mb-3 rounded-lg text-left ${
                  resendStatus === 'error'
                    ? 'bg-red-50 border border-red-200 text-red-800'
                    : 'bg-green-50 border border-green-200 text-green-800'
                }`}>
                  {resendStatus === 'error'
                    ? <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    : <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />}
                  <p className="text-sm">{resendMessage}</p>
                </div>
              )}

              <Button
                type="button"
                onClick={handleResend}
                disabled={resendStatus === 'sending' || resendCoolingDown}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 mb-2 disabled:opacity-60"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${resendStatus === 'sending' ? 'animate-spin' : ''}`} />
                {resendStatus === 'sending'
                  ? 'Sending...'
                  : resendCoolingDown
                  ? `Resend available in ${resendRemaining}s`
                  : 'Resend verification email'}
              </Button>


              <Button
                type="button"
                variant="outline"
                onClick={() => switchMode('signin')}
                className="w-full"
              >
                Back to Sign In
              </Button>
            </div>
          ) : mode === 'forgot' && resetSent ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">Check your email</h3>
              <p className="text-sm text-gray-600 mb-4">
                We sent a password reset link to <span className="font-medium text-gray-900">{form.email}</span>.
                Click the link in the email to choose a new password.
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Did not get it? Check your spam folder, or try again in a few minutes.
              </p>
              <Button
                type="button"
                onClick={() => switchMode('signin')}
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

              {mode === 'signup' && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                    <div className="relative">
                      <User className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Adaeze Okafor"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Phone Number</label>
                    <div className="relative">
                      <Phone className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        placeholder="+234 801 234 5678"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                      />
                    </div>
                  </div>
                </>
              )}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                <div className="relative">
                  <Mail className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                    required
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700 block">Password</label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => switchMode('forgot')}
                        className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-medium"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                      required
                      minLength={6}
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
                  {mode === 'signup' && (
                    <div className="mt-2">
                      {form.password.length > 0 ? (
                        <>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500">Password strength</span>
                            <span className={`text-xs font-semibold ${passwordStrength.textColor}`}>
                              {passwordStrength.label}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${passwordStrength.barColor} transition-all duration-300`}
                              style={{ width: `${passwordStrength.widthPct ?? 0}%` }}
                            />
                          </div>
                          {passwordStrength.score === 1 && (
                            <p className="text-xs text-red-600 mt-1">
                              Too weak. Add length, uppercase, numbers, or symbols.
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-xs text-gray-500">
                          At least 6 characters. Mix upper/lower case, numbers & symbols for a stronger password.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}


              {mode === 'signup' && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Confirm Password</label>
                  <div className="relative">
                    <Lock className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                      placeholder="Re-enter your password"
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
                      onClick={() => setShowConfirmPassword(s => !s)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
              )}


              {mode === 'signin' && (
                <label className="flex items-center gap-2 text-sm text-gray-700 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => {
                      const checked = e.target.checked;
                      setRememberMe(checked);
                      // If user unchecks, clear immediately so the email doesn't linger
                      if (!checked) {
                        try { localStorage.removeItem(REMEMBER_KEY); } catch { /* ignore */ }
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                  />
                  Remember me
                </label>
              )}

              <Button
                type="submit"
                disabled={
                  loading ||
                  (mode === 'signup' && (!passwordsMatch || form.password.length < 6 || !isStrongEnough))
                }

                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                {loading ? 'Please wait...' :
                  mode === 'signin' ? 'Sign In' :
                  mode === 'signup' ? 'Create Account' :
                  'Send Reset Link'}
              </Button>


              {mode !== 'forgot' && (
                <p className="text-center text-sm text-gray-600">
                  {mode === 'signin' ? "Don't have an account? " : 'Already a member? '}
                  <button type="button" onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')} className="text-blue-600 font-medium hover:underline">
                    {mode === 'signin' ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
