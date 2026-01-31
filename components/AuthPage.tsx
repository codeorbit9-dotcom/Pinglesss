
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup 
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { Mail, Lock, ChevronRight } from 'lucide-react';
import { AppRoute } from '../types';

interface AuthPageProps {
  mode: 'login' | 'signup';
}

const AuthPage: React.FC<AuthPageProps> = ({ mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogoError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = 'none';
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate(AppRoute.Dashboard);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate(AppRoute.Dashboard);
    } catch (err: any) {
      setError(err.message || 'Google Auth failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center p-12 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-slate-950/80"></div>
        <div className="relative z-10 max-w-lg text-center lg:text-left">
          <div className="bg-white p-4 rounded-3xl w-fit mb-8 shadow-2xl shadow-white/10 mx-auto lg:mx-0">
            <img src="/logo.png" alt="" onError={handleLogoError} className="w-12 h-12" />
          </div>
          <h1 className="text-6xl font-black text-white leading-tight tracking-tight mb-6">
            Secure your<br /><span className="text-indigo-400">API ecosystem</span><br />in minutes.
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed font-medium">
            Join thousands of developers blocking millions of malicious requests daily at the edge.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-[600px] flex flex-col items-center justify-center p-8 lg:p-24 bg-white dark:bg-slate-950">
        <div className="w-full max-w-md">
          <header className="mb-10 text-center lg:text-left">
            <Link to={AppRoute.Landing} className="inline-flex items-center gap-2 mb-8 group">
              <img src="/logo.png" alt="" onError={handleLogoError} className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tighter">Pingless</span>
            </Link>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
              {mode === 'login' ? 'Welcome back' : 'Get started for free'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              {mode === 'login' 
                ? 'Enter your credentials to access your dashboard.' 
                : 'Create an account to start protecting your APIs.'}
            </p>
          </header>

          <div className="space-y-4 mb-8">
            <button 
              onClick={handleGoogleAuth}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 p-4 rounded-2xl text-slate-700 dark:text-white font-bold flex items-center justify-center gap-3 transition-all"
            >
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              Continue with Google
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-950 px-4 text-slate-500 font-bold tracking-widest">Or continue with email</span>
            </div>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-xl text-sm mb-6 font-medium animate-in shake">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-1">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-indigo-500/50 outline-none rounded-2xl pl-12 pr-4 py-4 text-slate-900 dark:text-white transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-indigo-500/50 outline-none rounded-2xl pl-12 pr-4 py-4 text-slate-900 dark:text-white transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500 dark:text-slate-400 font-medium">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
            <Link 
              to={mode === 'login' ? AppRoute.Signup : AppRoute.Login} 
              className="ml-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors font-bold"
            >
              {mode === 'login' ? 'Create one now' : 'Sign in here'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
