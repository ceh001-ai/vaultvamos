import React, { useState } from 'react';
import {
  Lock,
  User,
  KeyRound,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  UserPlus,
  LogIn
} from 'lucide-react';

interface LockScreenProps {
  onUnlock: (username: string, password: string) => Promise<boolean>;
  onRegister: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
}

export const LockScreen: React.FC<LockScreenProps> = ({
  onUnlock,
  onRegister,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!username.trim()) {
      setErrorMsg('Please enter your username.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your master password.');
      return;
    }

    setIsLoading(true);
    try {
      const success = await onUnlock(username.trim(), password);
      if (!success) {
        setErrorMsg('Invalid username or master password. Access denied.');
      }
    } catch {
      setErrorMsg('An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!username.trim()) {
      setErrorMsg('Please choose a username.');
      return;
    }
    if (username.trim().length < 3) {
      setErrorMsg('Username must be at least 3 characters.');
      return;
    }
    if (!password) {
      setErrorMsg('Please create a master password.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Master password must be at least 8 characters long for zero-knowledge encryption.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await onRegister(username.trim(), password);
      if (res.success) {
        setSuccessMsg('Account registered successfully! Please sign in with your credentials.');
        setAuthMode('login');
        setPassword('');
        setConfirmPassword('');
      } else {
        setErrorMsg(res.message || 'Registration failed.');
      }
    } catch {
      setErrorMsg('Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F8FAFC] flex flex-col items-center justify-center p-4 sm:p-6 text-slate-800 select-none overflow-y-auto">
      {/* Background subtle geometric pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E2E8F0_1px,transparent_1px),linear-gradient(to_bottom,#E2E8F0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60 pointer-events-none"></div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 relative z-10 shadow-xl shadow-slate-200/60 flex flex-col">
        {/* Brand Emblem */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md mb-3">
            <Lock className="w-6 h-6 text-slate-100" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">VAULT_OS</h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Zero-Knowledge Local Encrypted Enclave
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6 text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'login'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'register'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register Account</span>
          </button>
        </div>

        {/* Feedback alerts */}
        {errorMsg && (
          <div className="mb-4 text-xs text-rose-700 font-mono flex items-start gap-2 bg-rose-50 p-3 rounded-xl border border-rose-200 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div className="leading-snug">{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 text-xs text-emerald-700 font-mono flex items-start gap-2 bg-emerald-50 p-3 rounded-xl border border-emerald-200 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <div className="leading-snug">{successMsg}</div>
          </div>
        )}

        {/* Sign In Form */}
        {authMode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Username
              </label>
              <div className="relative">
                <input
                  id="login-username-input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username..."
                  autoComplete="username"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-800 focus:bg-white font-mono placeholder-slate-400 pl-10 transition-colors"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Master Password
              </label>
              <div className="relative">
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter master password..."
                  autoComplete="current-password"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-800 focus:bg-white font-mono placeholder-slate-400 pl-10 pr-10 transition-colors"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 disabled:bg-slate-300 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md mt-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In To Vault</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                New Username
              </label>
              <div className="relative">
                <input
                  id="register-username-input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. john_doe"
                  autoComplete="username"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-800 focus:bg-white font-mono placeholder-slate-400 pl-10 transition-colors"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Master Password (Min 8 Chars)
              </label>
              <div className="relative">
                <input
                  id="register-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create master password..."
                  autoComplete="new-password"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-800 focus:bg-white font-mono placeholder-slate-400 pl-10 pr-10 transition-colors"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Confirm Master Password
              </label>
              <div className="relative">
                <input
                  id="register-confirm-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat master password..."
                  autoComplete="new-password"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-800 focus:bg-white font-mono placeholder-slate-400 pl-10 transition-colors"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              id="register-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 disabled:bg-slate-300 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md mt-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Generating Encryption Keys...</span>
                </>
              ) : (
                <>
                  <span>Create Vault Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer Security Badges */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>AES-256-GCM</span>
          </span>
          <span>Zero-Knowledge</span>
          <span>Local Storage</span>
        </div>
      </div>
    </div>
  );
};
