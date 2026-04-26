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
import { Shield, Mail, Lock, LogIn, UserCircle, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';

// --- Define a Firebase Error interface to avoid 'any' ---
interface FirebaseError {
  message: string;
  code?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectUser = (): void => {
    router.push('/dashboard');
  };

  const handleEmailAuth = async (e: React.FormEvent): Promise<void> => {
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
    } catch (err: unknown) {
      // --- Safe Type Checking ---
      const firebaseError = err as FirebaseError;
      setError(firebaseError.message?.replace('Firebase: ', '') || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async (): Promise<void> => {
    setError('');
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      redirectUser();
    } catch (err: unknown) {
      const firebaseError = err as FirebaseError;
      setError(firebaseError.message?.replace('Firebase: ', '') || 'Google authentication failed.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#E5E1E6]">
      
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-orange-200/50 blur-[80px] md:blur-[120px] rounded-full animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-300/40 blur-[80px] md:blur-[120px] rounded-full animate-pulse pointer-events-none" style={{animationDelay: '-2s'}}></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center justify-center p-4 bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-xl shadow-purple-100 mb-6 border border-white">
          <Shield className="h-8 w-8 md:h-10 md:w-10 text-[#635BFF]" />
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-[#3E3B52] tracking-tight">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="mt-2 text-[#8E8AAB] font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs flex items-center justify-center">
          <Sparkles className="w-3 h-3 mr-2 text-orange-400" />
          Enterprise Asset Forensics
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass-card py-10 px-6 sm:px-12 rounded-[2.5rem] md:rounded-[3rem] border-white/60 shadow-2xl shadow-purple-100/50 mx-auto">
          
          {error && (
            <div className="mb-6 bg-rose-100/50 border border-rose-200 p-4 rounded-[1.25rem] flex items-start animate-in fade-in zoom-in duration-300">
              <AlertCircle className="h-5 w-5 text-rose-500 mr-3 flex-shrink-0" />
              <p className="text-[10px] text-rose-600 font-black uppercase tracking-wide leading-tight">{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleEmailAuth}>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#A09CB0] ml-4 mb-2">Organization Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-[#A09CB0] group-focus-within:text-[#635BFF] transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-6 py-4 bg-white/40 border border-white/60 rounded-[1.5rem] text-[#3E3B52] placeholder-[#A09CB0] focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100/50 transition-all text-sm font-medium shadow-sm"
                  placeholder="admin@veris.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#A09CB0] ml-4 mb-2">Secure Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-[#A09CB0] group-focus-within:text-[#635BFF] transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-6 py-4 bg-white/40 border border-white/60 rounded-[1.5rem] text-[#3E3B52] placeholder-[#A09CB0] focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100/50 transition-all text-sm font-medium shadow-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-4 px-4 bg-[#3E3B52] text-white text-[10px] md:text-xs font-black uppercase tracking-[0.25em] rounded-[1.5rem] shadow-xl shadow-purple-200/50 hover:bg-[#635BFF] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <span className="flex items-center">
                  {isSignUp ? 'Initialize Vault' : 'Authenticate Access'} 
                  <ArrowRight className="ml-2 w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/60"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]">
                <span className="px-4 bg-transparent text-[#A09CB0]">External Gateway</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                onClick={handleGoogleAuth}
                disabled={loading}
                className="inline-flex justify-center py-3.5 px-4 bg-white/60 border border-white rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest text-[#3E3B52] hover:bg-white transition-all shadow-sm"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              
              <button
                onClick={() => {
                  signInAnonymously(auth).then(redirectUser).catch((err: unknown) => {
                    const firebaseError = err as FirebaseError;
                    setError(firebaseError.message);
                  });
                }}
                disabled={loading}
                className="inline-flex justify-center items-center py-3.5 px-4 bg-[#635BFF]/10 border border-[#635BFF]/20 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest text-[#635BFF] hover:bg-[#635BFF]/20 transition-all shadow-sm"
              >
                <UserCircle className="w-4 h-4 mr-2" />
                Guest
              </button>
            </div>
          </div>

          <div className="mt-10 text-center">
            <button 
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-[#635BFF] hover:underline transition-all"
            >
              {isSignUp ? 'Already a member? Sign In' : 'Register New Organization'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}