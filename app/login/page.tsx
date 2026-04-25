"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInAnonymously 
} from 'firebase/auth';
import { Shield, Mail, Lock, LogIn, UserCircle, AlertCircle, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectUser = () => {
    router.push('/dashboard');
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      redirectUser();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message.replace('Firebase: ', ''));
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      redirectUser();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message.replace('Firebase: ', ''));
      } else {
        setError('An unexpected error occurred.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden bg-[#E5E1E6]">
      
      {/* Background Soft Blobs (Bookavy Style) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-200/50 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-300/40 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="inline-flex items-center justify-center p-4 bg-white rounded-[2rem] shadow-xl shadow-purple-100 mb-6">
          <Shield className="h-10 w-10 text-[#635BFF]" />
        </div>
        <h2 className="text-4xl font-black text-[#3E3B52] tracking-tight">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="mt-2 text-[#8E8AAB] font-medium flex items-center justify-center">
          <Sparkles className="w-3 h-3 mr-2 text-orange-400" />
          Enterprise Asset Forensics
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="glass-card py-10 px-6 sm:px-12 rounded-[3rem] border-white/60">
          
          {error && (
            <div className="mb-6 bg-rose-100/50 border border-rose-200 p-4 rounded-2xl flex items-start animate-in fade-in zoom-in duration-300">
              <AlertCircle className="h-5 w-5 text-rose-500 mr-3 flex-shrink-0" />
              <p className="text-xs text-rose-600 font-bold uppercase tracking-wide">{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleEmailAuth}>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#A09CB0] ml-2 mb-2">Email address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#A09CB0] group-focus-within:text-[#635BFF] transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-white/40 border border-white/60 rounded-[1.5rem] text-[#3E3B52] placeholder-[#A09CB0] focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all text-sm font-medium"
                  placeholder="admin@veris.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#A09CB0] ml-2 mb-2">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#A09CB0] group-focus-within:text-[#635BFF] transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-white/40 border border-white/60 rounded-[1.5rem] text-[#3E3B52] placeholder-[#A09CB0] focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all text-sm font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-4 px-4 bg-[#3E3B52] text-white text-sm font-black uppercase tracking-widest rounded-[1.5rem] shadow-2xl shadow-purple-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <>{isSignUp ? 'Initialize' : 'Authenticate'}</>
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/60"></div></div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]"><span className="px-4 bg-transparent text-[#A09CB0]">Third Party</span></div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                onClick={handleGoogleAuth}
                disabled={loading}
                className="inline-flex justify-center py-3.5 px-4 bg-white/60 border border-white rounded-[1.25rem] text-xs font-bold text-[#3E3B52] hover:bg-white transition-all shadow-sm"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </button>
              
              <button
                onClick={() => signInAnonymously(auth).then(redirectUser)}
                disabled={loading}
                className="inline-flex justify-center items-center py-3.5 px-4 bg-[#635BFF]/10 border border-[#635BFF]/20 rounded-[1.25rem] text-xs font-bold text-[#635BFF] hover:bg-[#635BFF]/20 transition-all"
              >
                <UserCircle className="w-4 h-4 mr-2" />
                Guest
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-[#635BFF] hover:underline transition-all"
            >
              {isSignUp ? 'Back to Login' : 'Register Organization'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}