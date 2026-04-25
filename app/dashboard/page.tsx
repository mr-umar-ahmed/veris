"use client";

import { useAuth } from '@/lib/AuthContext';
import { PlusCircle, Image as ImageIcon, Activity, Shield, ShieldAlert, FileText, CheckCircle2, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

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
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section - Smartech Style */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between px-2">
        <div>
          <h1 className="text-4xl font-black text-[#3E3B52] tracking-tight">HELLO, {user?.email?.split('@')[0].toUpperCase()}!</h1>
          <p className="text-[#8E8AAB] font-medium mt-1">Manage your organizations cryptographically sealed media.</p>
        </div>
        <div className="mt-6 md:mt-0">
          <Link href="/dashboard/watermark" className="inline-flex items-center px-8 py-3.5 bg-[#635BFF] text-white font-bold rounded-2xl hover:scale-105 shadow-xl shadow-indigo-100 transition-all">
            <PlusCircle className="w-5 h-5 mr-2" />
            Seal New Asset
          </Link>
        </div>
      </div>

      {/* Stats Row - Soft Floating Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Protected Assets', val: loadingAssets ? "-" : assets.length, icon: Shield, color: 'text-indigo-500', bg: 'bg-indigo-50' },
          { label: 'Simulated Scans', val: '2.4k', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Active Alerts', val: '0', icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-50' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-8 rounded-[2.5rem] border-white/80 relative overflow-hidden group hover:-translate-y-1 transition-all">
            <div className={`absolute top-6 right-6 p-3 ${stat.bg} rounded-2xl transition-transform group-hover:scale-110`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-sm font-black uppercase tracking-[0.15em] text-[#A09CB0] mb-2">{stat.label}</p>
            <p className="text-5xl font-black text-[#3E3B52]">{stat.val}</p>
            <div className="mt-4 flex items-center text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
              <ArrowUpRight className="w-3 h-3 mr-1" /> 12% increase
            </div>
          </div>
        ))}
      </div>

      {/* Asset Table Section */}
      <div className="glass-card rounded-[3rem] overflow-hidden border-white/60">
        <div className="px-10 py-8 border-b border-white/40 flex justify-between items-center bg-white/20">
          <h2 className="text-xl font-black text-[#3E3B52]">Recent Registrations</h2>
          <button className="text-xs font-bold text-[#635BFF] uppercase tracking-widest hover:underline">See All</button>
        </div>
        
        {loadingAssets ? (
          <div className="h-64 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-100 border-t-indigo-500 mb-4"></div>
            <p className="text-[#A09CB0] text-xs font-bold uppercase tracking-widest">Vault Decrypting...</p>
          </div>
        ) : assets.length === 0 ? (
          <div className="h-80 flex flex-col items-center justify-center">
            <div className="p-6 bg-white/40 rounded-full mb-6">
              <ImageIcon className="w-12 h-12 text-[#A09CB0]" />
            </div>
            <p className="text-[#3E3B52] text-xl font-bold">Your vault is empty.</p>
            <Link href="/dashboard/watermark" className="text-[#635BFF] text-sm font-bold mt-2 hover:underline">Initialize first asset →</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/30 text-[10px] font-black uppercase tracking-[0.2em] text-[#A09CB0]">
                <tr>
                  <th className="px-10 py-5">Asset Detail</th>
                  <th className="px-10 py-5">SHA-256 Hash</th>
                  <th className="px-10 py-5">Status</th>
                  <th className="px-10 py-5">Size</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/40">
                {assets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-white/40 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center">
                        <div className="p-3 bg-white rounded-2xl mr-4 shadow-sm group-hover:scale-110 transition-transform">
                           <FileText className="w-5 h-5 text-[#635BFF]" />
                        </div>
                        <span className="font-bold text-[#3E3B52]">{asset.filename}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <code className="text-[10px] font-bold px-3 py-1 bg-white/60 rounded-full text-[#7D7996]">
                        {asset.hash.substring(0, 16).toUpperCase()}...
                      </code>
                    </td>
                    <td className="px-10 py-6">
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-600 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 mr-2" /> Sealed
                      </span>
                    </td>
                    <td className="px-10 py-6 text-sm font-bold text-[#A09CB0]">{(asset.size / 1024).toFixed(1)} KB</td>
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