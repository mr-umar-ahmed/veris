"use client";

import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E5E1E6] flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-24 w-24 rounded-full border-4 border-white/40 border-t-[#635BFF] animate-spin"></div>
          <ShieldCheck className="h-10 w-10 text-[#635BFF] animate-pulse" />
        </div>
        <div className="mt-12 text-center">
          <p className="text-[#3E3B52] font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">
            Authenticating Protocol
          </p>
          <p className="text-[#8E8AAB] text-[9px] font-bold uppercase tracking-widest mt-2">
            Verifying Forensic Credentials...
          </p>
        </div>
      </div>
    );
  }

  return user ? <>{children}</> : null;
}