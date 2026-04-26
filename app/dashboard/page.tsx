"use client";

import { useAuth } from '@/lib/AuthContext';
import { 
  PlusCircle, 
  Image as ImageIcon, 
  Activity, 
  Shield, 
  ShieldAlert, 
  FileText, 
  CheckCircle2, 
  ArrowUpRight,
  Search,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { clsx } from 'clsx';

interface SealedAsset {
  id: string;
  filename: string;
  hash: string;
  status: string;
  timestamp: Timestamp | null;
  size: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [assets, setAssets] = useState<SealedAsset[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      if (!user) return;
      try {
        const sealsRef = collection(db, 'seals');
        const q = query(sealsRef, where("ownerId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedAssets: SealedAsset[] = [];
        querySnapshot.forEach((doc) => {
          fetchedAssets.push({ id: doc.id, ...doc.data() } as SealedAsset);
        });
        fetchedAssets.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
        setAssets(fetchedAssets);
      } catch (error) {
        console.error("Error fetching assets:", error);
      } finally {
        setLoadingAssets(false);
      }
    };
    fetchAssets();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 px-2">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-black text-[#3E3B52] tracking-tighter uppercase">
            Hello, {user?.email?.split('@')[0] || 'Member'}!
          </h1>
          <p className="text-[#8E8AAB] font-bold text-xs md:text-sm uppercase tracking-widest flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
            Manage Cryptographically Sealed Media
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/watermark" className="w-full md:w-auto inline-flex justify-center items-center px-8 py-4 bg-[#635BFF] text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-105 shadow-xl shadow-indigo-100 transition-all active:scale-95">
            <PlusCircle className="w-4 h-4 mr-2" />
            Seal New Asset
          </Link>
        </div>
      </div>

      {/* --- STATS ROW --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {[
          { label: 'Protected Assets', val: loadingAssets ? "..." : assets.length, icon: Shield, color: 'text-indigo-500', bg: 'bg-indigo-50' },
          { label: 'Simulated Scans', val: '2.4k', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Active Alerts', val: '0', icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-50' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-8 rounded-[2.5rem] border-white/80 relative overflow-hidden group hover:bg-white transition-all">
            <div className={clsx("absolute top-6 right-6 p-3 rounded-2xl transition-transform group-hover:scale-110 shadow-sm", stat.bg)}>
              <stat.icon className={clsx("w-6 h-6", stat.color)} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A09CB0] mb-3">{stat.label}</p>
            <p className="text-5xl font-black text-[#3E3B52] tracking-tight leading-none">{stat.val}</p>
            <div className="mt-6 flex items-center text-[10px] font-black text-emerald-500 uppercase tracking-widest">
              <ArrowUpRight className="w-3 h-3 mr-1" /> System Optimized
            </div>
          </div>
        ))}
      </div>

      {/* --- ASSET TABLE SECTION --- */}
      <div className="glass-card rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border-white/60 shadow-2xl shadow-indigo-50/30">
        <div className="px-8 md:px-12 py-8 border-b border-white/40 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/20">
          <div className="flex items-center">
            <div className="p-2 bg-white rounded-xl shadow-sm mr-4">
              <Search className="w-4 h-4 text-[#635BFF]" />
            </div>
            <h2 className="text-xl font-black text-[#3E3B52] tracking-tight">Recent Registrations</h2>
          </div>
          <button className="text-[10px] font-black text-[#635BFF] uppercase tracking-[0.2em] hover:underline flex items-center">
            Detailed Ledger <ChevronRight className="w-3 h-3 ml-1" />
          </button>
        </div>
        
        {loadingAssets ? (
          <div className="h-64 flex flex-col items-center justify-center bg-white/10">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-50 border-t-[#635BFF] mb-6"></div>
            <p className="text-[#A09CB0] text-[10px] font-black uppercase tracking-widest animate-pulse">Accessing Vault Ledger...</p>
          </div>
        ) : assets.length === 0 ? (
          <div className="h-80 flex flex-col items-center justify-center text-center p-6">
            <div className="p-8 bg-white/60 rounded-[2.5rem] mb-6 shadow-inner">
              <ImageIcon className="w-12 h-12 text-[#A09CB0]" />
            </div>
            <p className="text-[#3E3B52] text-xl font-black tracking-tight">Your vault is currently empty.</p>
            <p className="text-[#A09CB0] text-sm mt-2 mb-6">Initialize official media to generate an Origin Seal.</p>
            <Link href="/dashboard/watermark" className="text-[#635BFF] text-xs font-black uppercase tracking-widest flex items-center hover:underline">
              Initialize first asset <ChevronRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/30 text-[10px] font-black uppercase tracking-[0.2em] text-[#A09CB0]">
                <tr>
                  <th className="px-10 py-6 min-w-[250px]">Asset Detail</th>
                  <th className="px-10 py-6">SHA-256 Signature</th>
                  <th className="px-10 py-6">Ledger Status</th>
                  <th className="px-10 py-6">Footprint</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/40">
                {assets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-white/40 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center">
                        <div className="p-3 bg-white rounded-2xl mr-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                           <FileText className="w-5 h-5 text-[#635BFF]" />
                        </div>
                        <span className="font-bold text-[#3E3B52] text-sm md:text-base">{asset.filename}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <code className="text-[10px] font-bold px-4 py-2 bg-white/60 rounded-full text-[#7D7996] border border-white shadow-sm">
                        {asset.hash.substring(0, 16).toUpperCase()}...
                      </code>
                    </td>
                    <td className="px-10 py-6">
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-100/80 text-emerald-600 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 mr-2" /> Sealed
                      </span>
                    </td>
                    <td className="px-10 py-6 text-xs font-bold text-[#A09CB0]">
                      {(asset.size / 1024).toFixed(1)} KB
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}