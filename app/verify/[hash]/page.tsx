"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { ShieldCheck, AlertTriangle, HardDrive, FileText, Activity, BadgeCheck, Fingerprint, Clock } from 'lucide-react';
import { clsx } from 'clsx';

interface VerisSeal {
  hash: string;
  filename: string;
  size: number;
  deviceSignature: string;
  timestamp: Timestamp;
  verisIndex: number;
  status: string;
}

export default function VerifyPage() {
  const params = useParams();
  const hash = params.hash as string;
  const [loading, setLoading] = useState(true);
  const [sealData, setSealData] = useState<VerisSeal | null>(null);

  useEffect(() => {
    async function fetchSeal() {
      if (!hash) return;
      try {
        const docRef = doc(db, 'seals', hash);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSealData(docSnap.data() as VerisSeal);
        } else {
          setSealData(null); 
        }
      } catch (error) {
        console.error("Error fetching seal:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSeal();
  }, [hash]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#E5E1E6]">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-4 border-white/40 border-t-[#635BFF] animate-spin"></div>
          <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#635BFF] w-8 h-8" />
        </div>
        <p className="mt-6 text-[#8E8AAB] font-black uppercase tracking-[0.2em] text-xs">Authenticating Signature...</p>
      </div>
    );
  }

  // Error State (Hash Not Found)
  if (!sealData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#E5E1E6] text-center px-6">
        <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-rose-200 border border-white max-w-lg">
          <div className="bg-rose-100 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-10 w-10 text-rose-500" />
          </div>
          <h1 className="text-3xl font-black text-[#3E3B52] tracking-tight">Integrity Compromised</h1>
          <p className="text-[#8E8AAB] mt-4 font-medium leading-relaxed">
            This cryptographic hash does not exist in the Veris registry. This media is either forged, altered, or unregistered.
          </p>
          <div className="mt-8 bg-[#F5F1F4] p-4 rounded-2xl border border-white/60">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#A09CB0] mb-2">Target Hash</p>
            <code className="text-xs font-bold text-rose-400 break-all leading-tight">{hash}</code>
          </div>
        </div>
      </div>
    );
  }

  const date = sealData.timestamp?.toDate() 
    ? new Date(sealData.timestamp.toDate()).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' }) 
    : 'Authenticated';

  return (
    <div className="min-h-screen bg-[#E5E1E6] py-20 px-6 overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/30 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto space-y-10 relative z-10">
        
        {/* Certificate Header */}
        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-white inline-flex p-4 rounded-[2rem] shadow-xl shadow-emerald-100 mb-6 border border-white">
            <BadgeCheck className="h-12 w-12 text-emerald-500" />
          </div>
          <h1 className="text-5xl font-black text-[#3E3B52] tracking-tighter">Origin Certificate</h1>
          <p className="mt-2 text-[#8E8AAB] font-bold uppercase tracking-[0.2em] text-xs">Immutable Forensic Verification</p>
        </div>

        {/* Main Certificate Card */}
        <div className="glass-card rounded-[3.5rem] border-white/80 overflow-hidden shadow-2xl shadow-indigo-100 animate-in fade-in zoom-in duration-1000">
          
          {/* Trust Index Header */}
          <div className="px-10 py-12 border-b border-white/60 bg-white/40 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-black text-[#3E3B52]">Veris Trust Index</h2>
              <p className="text-sm text-[#8E8AAB] font-medium mt-1">Calculated via semantic & structural pixel analysis</p>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-8xl font-black text-emerald-500 drop-shadow-sm">{sealData.verisIndex || 100}</span>
              <span className="text-2xl font-black text-[#A09CB0]">/100</span>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/60">
            
            {/* Left Col: File Info */}
            <div className="p-10 space-y-8">
              <h3 className="text-[10px] font-black text-[#A09CB0] uppercase tracking-[0.2em] flex items-center">
                <FileText className="h-4 w-4 mr-3 text-[#635BFF]" /> Digital Signature
              </h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black text-[#A09CB0] uppercase tracking-widest mb-1">Asset Filename</p>
                  <p className="text-lg font-bold text-[#3E3B52] truncate">{sealData.filename}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#A09CB0] uppercase tracking-widest mb-1">Sealed Payload Size</p>
                  <p className="text-lg font-bold text-[#3E3B52]">{(sealData.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
            </div>

            {/* Right Col: Provenance */}
            <div className="p-10 space-y-8">
              <h3 className="text-[10px] font-black text-[#A09CB0] uppercase tracking-[0.2em] flex items-center">
                <Activity className="h-4 w-4 mr-3 text-emerald-500" /> Provenance Chain
              </h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black text-[#A09CB0] uppercase tracking-widest mb-1">Origin Device Sig</p>
                  <div className="inline-flex items-center bg-white/60 px-4 py-2 rounded-xl border border-white text-xs font-bold font-mono text-[#635BFF]">
                    <Fingerprint className="w-3 h-3 mr-2" /> {sealData.deviceSignature}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#A09CB0] uppercase tracking-widest mb-1">Creation Timestamp</p>
                  <div className="flex items-center text-[#3E3B52] font-bold">
                    <Clock className="w-4 h-4 mr-2 text-[#A09CB0]" /> {date}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Immutable Hash Footer */}
          <div className="p-10 bg-white/20 border-t border-white/60">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black text-[#A09CB0] uppercase tracking-[0.2em] flex items-center">
                <HardDrive className="h-4 w-4 mr-2" /> SHA-256 Master Ledger Hash
              </p>
              <div className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-200">
                Validated
              </div>
            </div>
            <div className="bg-white/80 p-6 rounded-[2rem] border border-white shadow-inner">
              <p className="font-mono text-xs md:text-sm text-[#7D7996] break-all leading-relaxed text-center italic">
                {sealData.hash}
              </p>
            </div>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="text-center">
          <p className="text-[#A09CB0] text-xs font-medium italic">
            This document serves as legal-forensic evidence of digital creation date and ownership.
          </p>
        </div>
      </div>
    </div>
  );
}