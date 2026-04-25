"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, Search, AlertTriangle, Activity, BrainCircuit, ShieldAlert, ShieldCheck, Layers } from 'lucide-react';
import { generateFileHash } from '@/lib/crypto';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import clsx from 'clsx';

interface ForensicData {
  ela_score: number;
  noise_variance: number;
  estimated_trust: number;
  is_suspicious: boolean;
}

interface AnalyzeEngineResponse {
  success: boolean;
  phash: string;
  forensics: ForensicData;
}

export default function CheckPage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'hashing' | 'analyzing' | 'done'>('idle');
  
  const [matchType, setMatchType] = useState<'exact' | 'derived' | 'none' | null>(null);
  const [forensicReport, setForensicReport] = useState<ForensicData | null>(null);
  const [originalOwnerId, setOriginalOwnerId] = useState<string | null>(null);

  const verifyFile = async (selectedFile: File) => {
    setStatus('hashing');
    setMatchType(null);
    setForensicReport(null);

    try {
      // 1. Check for EXACT match (Cryptographic Hash)
      const cryptoHash = await generateFileHash(selectedFile);
      const exactDocRef = doc(db, 'seals', cryptoHash);
      const exactDocSnap = await getDoc(exactDocRef);

      if (exactDocSnap.exists()) {
        setMatchType('exact');
        setOriginalOwnerId(exactDocSnap.data().ownerId || exactDocSnap.data().deviceSignature);
        setStatus('done');
        return; 
      } 
      
      // 2. NO EXACT MATCH. Trigger Python Engine for Forensics
      setStatus('analyzing');
      const formData = new FormData();
      formData.append("file", selectedFile);

      const engineRes = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!engineRes.ok) throw new Error("Python Engine unreachable");
      
      const engineData = (await engineRes.json()) as AnalyzeEngineResponse;
      setForensicReport(engineData.forensics);

      // 3. Check for DERIVED match
      const sealsRef = collection(db, 'seals');
      const q = query(sealsRef, where("phash", "==", engineData.phash));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setMatchType('derived');
        setOriginalOwnerId(querySnapshot.docs[0].data().ownerId || querySnapshot.docs[0].data().deviceSignature);
      } else {
        setMatchType('none');
      }

      setStatus('done');

    } catch (error) {
      console.error("Verification error:", error);
      setStatus('idle');
      alert("Failed to analyze image. Is Python running?");
    }
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      verifyFile(e.dataTransfer.files[0]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#E5E1E6] flex flex-col items-center pt-32 pb-20 px-6 relative overflow-hidden">
      
      {/* Background Soft Blobs */}
      <div className="absolute top-[10%] left-[-5%] w-[500px] h-[500px] bg-purple-300/40 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-blue-300/30 blur-[150px] rounded-full animate-pulse pointer-events-none delay-1000"></div>

      <div className="max-w-3xl w-full space-y-10 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex justify-center items-center w-20 h-20 rounded-[2rem] bg-white shadow-xl shadow-indigo-100/50 mb-8 border border-white/60">
            <Search className="h-10 w-10 text-[#635BFF]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#3E3B52] tracking-tight">Public Scanner</h1>
          <p className="text-[#8E8AAB] mt-6 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Upload media to verify its cryptographic origin, check for AI generation, and scan for unauthorized manipulation across the global ledger.
          </p>
        </div>

        {/* Upload Zone */}
        {status === 'idle' || status === 'hashing' ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            className={clsx(
               "border border-white rounded-[3rem] p-16 text-center transition-all bg-white/60 backdrop-blur-xl shadow-xl shadow-indigo-50/50",
               isDragging ? "border-[#635BFF] bg-[#635BFF]/5" : "hover:border-[#635BFF]/50",
               status === 'hashing' && "opacity-75 pointer-events-none cursor-wait",
               !isDragging && status !== 'hashing' && "cursor-pointer"
            )}
          >
            {status === 'hashing' ? (
              <div className="flex flex-col items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-[4px] border-[#E5E1E6] border-t-[#635BFF] mb-6"></div>
                <p className="text-[#635BFF] font-black text-sm tracking-widest uppercase animate-pulse">Querying Blockchain Ledger...</p>
              </div>
            ) : (
              <>
                <div className="bg-white inline-flex p-5 rounded-full shadow-sm mb-6">
                  <UploadCloud className="h-10 w-10 text-[#635BFF]" />
                </div>
                <h3 className="text-2xl font-black text-[#3E3B52] tracking-tight">Drop suspect media here</h3>
                <p className="text-[#8E8AAB] font-medium mt-2">We will scan the cryptographic signature.</p>
                <input 
                  type="file" accept="image/*" className="hidden" id="verify-upload" 
                  onChange={(e) => e.target.files && verifyFile(e.target.files[0])}
                />
                <label htmlFor="verify-upload" className="mt-8 inline-block bg-[#3E3B52] text-white px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#635BFF] cursor-pointer transition-all shadow-xl shadow-indigo-200 hover:scale-105 hover:shadow-indigo-300">
                  Select File
                </label>
              </>
            )}
          </div>
        ) : null}

        {/* AI Analyzing State */}
        {status === 'analyzing' && (
          <div className="bg-white/80 border border-white rounded-[3rem] p-20 text-center backdrop-blur-2xl shadow-2xl shadow-indigo-100/50">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 border-[6px] border-indigo-50 rounded-full"></div>
              <div className="absolute inset-0 border-[6px] border-[#635BFF] rounded-full border-t-transparent animate-spin"></div>
              <BrainCircuit className="absolute inset-0 m-auto h-10 w-10 text-[#635BFF] animate-pulse" />
            </div>
            <h3 className="text-3xl font-black text-[#3E3B52] tracking-tight">Signature broken.</h3>
            <p className="text-[#635BFF] font-black text-sm mt-4 uppercase tracking-widest animate-pulse">Initializing Deep Forensics...</p>
            <div className="w-full max-w-sm mx-auto bg-slate-100 rounded-full h-2 mt-8 overflow-hidden">
              <div className="bg-[#635BFF] h-2 rounded-full animate-[progress_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        )}

        {/* Final Report State */}
        {status === 'done' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* EXACT MATCH (Perfectly Authentic) */}
            {matchType === 'exact' && (
              <div className="bg-emerald-50/90 backdrop-blur-md border border-emerald-200 rounded-[3rem] p-10 flex flex-col sm:flex-row items-start sm:items-center shadow-2xl shadow-emerald-100/50">
                <div className="bg-emerald-500 p-4 rounded-2xl mr-6 shadow-lg shadow-emerald-200 mb-6 sm:mb-0 flex-shrink-0">
                  <ShieldCheck className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h3 className="text-emerald-600 font-black text-3xl mb-3 tracking-tight">Verified Authentic</h3>
                  <p className="text-emerald-700/80 font-medium text-lg leading-relaxed">
                    This file is a mathematically perfect match to an official asset registered by <br className="hidden sm:block"/>
                    <span className="inline-block mt-2 font-mono text-emerald-700 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-sm text-sm">{originalOwnerId}</span>
                  </p>
                </div>
              </div>
            )}

            {/* THEFT ALERT (Derivative) */}
            {matchType === 'derived' && (
              <div className="bg-orange-50/90 backdrop-blur-md border border-orange-200 rounded-[3rem] p-10 flex flex-col sm:flex-row items-start shadow-2xl shadow-orange-100/50">
                <div className="bg-orange-500 p-4 rounded-2xl mr-6 shadow-lg shadow-orange-200 mb-6 sm:mb-0 flex-shrink-0">
                  <ShieldAlert className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h3 className="text-orange-600 font-black text-3xl mb-3 tracking-tight">Derivative Work Detected</h3>
                  <p className="text-orange-700/80 font-medium text-lg leading-relaxed mb-4">
                    This image has been altered, but its perceptual fingerprint maps to an official asset owned by <span className="inline-block font-mono text-orange-700 bg-white px-2 py-1 rounded-lg border border-orange-200 shadow-sm text-sm">{originalOwnerId}</span>.
                  </p>
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100/80 border border-orange-200">
                    <span className="w-2 h-2 rounded-full bg-orange-500 mr-2 animate-pulse"></span>
                    <p className="text-orange-700 text-xs font-black uppercase tracking-wider">Rights holder notified</p>
                  </div>
                </div>
              </div>
            )}

            {/* UNKNOWN ALERT */}
            {matchType === 'none' && (
              <div className="bg-rose-50/90 backdrop-blur-md border border-rose-200 rounded-[3rem] p-10 flex flex-col sm:flex-row items-start shadow-2xl shadow-rose-100/50">
                <div className="bg-rose-500 p-4 rounded-2xl mr-6 shadow-lg shadow-rose-200 mb-6 sm:mb-0 flex-shrink-0">
                  <AlertTriangle className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h3 className="text-rose-600 font-black text-3xl mb-3 tracking-tight">Unverified Origin</h3>
                  <p className="text-rose-700/80 font-medium text-lg leading-relaxed">
                    This media contains no Veris Origin Seal and does not match any perceptual hashes in our global registry.
                  </p>
                </div>
              </div>
            )}

            {/* FORENSIC REPORT (Only shows if there was no exact match) */}
            {forensicReport && (
              <div className="bg-white/60 backdrop-blur-xl border border-white rounded-[3rem] shadow-xl shadow-indigo-50/50 overflow-hidden">
                <div className="bg-white/50 border-b border-white px-10 py-6 flex items-center">
                  <Activity className="h-6 w-6 text-[#635BFF] mr-4" />
                  <h3 className="font-black text-[#3E3B52] text-xl tracking-tight">Deep Forensics Report</h3>
                </div>
                
                <div className="p-10">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 pb-10 border-b border-black/5">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A09CB0] mb-2">Calculated Trust Index</p>
                      <p className="text-sm text-[#8E8AAB] font-medium max-w-sm">Based on compression artifact mapping and noise continuity analysis.</p>
                    </div>
                    <div className={clsx("text-7xl font-black mt-6 md:mt-0 tracking-tighter", forensicReport.is_suspicious ? "text-rose-500" : "text-emerald-500")}>
                      {forensicReport.estimated_trust}<span className="text-3xl text-[#A09CB0] ml-1">/100</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white/80 border border-white p-8 rounded-[2rem] shadow-sm relative overflow-hidden">
                      <Layers className="absolute top-6 right-6 w-12 h-12 text-slate-100" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A09CB0] mb-4 relative z-10">Error Level (ELA)</p>
                      <p className="text-4xl font-black text-[#3E3B52] relative z-10">{forensicReport.ela_score}</p>
                      <div className={clsx("mt-4 inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold relative z-10", forensicReport.ela_score > 10 ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700")}>
                        {forensicReport.ela_score > 10 ? "⚠️ High variance (Likely Edited)" : "✅ Normal curve"}
                      </div>
                    </div>
                    
                    <div className="bg-white/80 border border-white p-8 rounded-[2rem] shadow-sm relative overflow-hidden">
                      <BrainCircuit className="absolute top-6 right-6 w-12 h-12 text-slate-100" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A09CB0] mb-4 relative z-10">Noise Variance</p>
                      <p className="text-4xl font-black text-[#3E3B52] relative z-10">{forensicReport.noise_variance}</p>
                      <div className={clsx("mt-4 inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold relative z-10", forensicReport.noise_variance < 100 ? "bg-orange-100 text-orange-700" : "bg-emerald-100 text-emerald-700")}>
                        {forensicReport.noise_variance < 100 ? "⚠️ Unnaturally smooth (Possible AI)" : "✅ Natural sensor noise"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="pt-6 text-center">
               <button 
                  onClick={() => { setStatus('idle'); setForensicReport(null); setMatchType(null); }}
                  className="inline-block px-10 py-5 bg-white border-2 border-[#E5E1E6] hover:border-[#3E3B52] text-[#3E3B52] text-xs font-black uppercase tracking-widest rounded-full transition-all shadow-sm"
                >
                  Scan Another Asset
                </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}