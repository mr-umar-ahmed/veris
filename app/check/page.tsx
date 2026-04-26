"use client";

import { useState, useCallback } from 'react';
import { 
  UploadCloud, 
  Search, 
  AlertTriangle, 
  Activity, 
  BrainCircuit, 
  ShieldAlert, 
  ShieldCheck, 
  Layers, 
  RefreshCcw,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { generateFileHash } from '@/lib/crypto';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { clsx } from 'clsx';

// --- TS INTERFACES ---
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

interface FirebaseSealData {
  ownerId?: string;
  deviceSignature?: string;
  phash?: string;
}

interface MatchCardProps {
  type: 'success' | 'warning' | 'danger';
  title: string;
  icon: React.ElementType;
  owner?: string | null;
  desc: string;
}

interface MetricCardProps {
  title: string;
  val: number;
  icon: React.ElementType;
  status: string;
  isDanger: boolean;
}

// --- MAIN COMPONENT ---
export default function CheckPage() {
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
      const cryptoHash = await generateFileHash(selectedFile);
      const exactDocRef = doc(db, 'seals', cryptoHash);
      const exactDocSnap = await getDoc(exactDocRef);

      if (exactDocSnap.exists()) {
        const data = exactDocSnap.data() as FirebaseSealData;
        setMatchType('exact');
        setOriginalOwnerId(data.ownerId || data.deviceSignature || "Authorized Origin");
        setStatus('done');
        return; 
      } 
      
      setStatus('analyzing');
      const formData = new FormData();
      formData.append("file", selectedFile);

      const engineRes = await fetch('https://veris-iz3o.onrender.com/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!engineRes.ok) throw new Error("Forensic Engine Unreachable");
      
      const engineData = (await engineRes.json()) as AnalyzeEngineResponse;
      setForensicReport(engineData.forensics);

      const sealsRef = collection(db, 'seals');
      const q = query(sealsRef, where("phash", "==", engineData.phash));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data() as FirebaseSealData;
        setMatchType('derived');
        setOriginalOwnerId(data.ownerId || data.deviceSignature || "Registered Entity");
      } else {
        setMatchType('none');
      }

      setStatus('done');

    } catch (error: unknown) {
      console.error("Verification error:", error);
      setStatus('idle');
      const message = error instanceof Error ? error.message : "Internal Error";
      alert(`Forensic analysis failed: ${message}`);
    }
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length > 0) verifyFile(e.dataTransfer.files[0]);
  }, []);

  return (
    <div className="min-h-screen bg-[#E5E1E6] flex flex-col items-center pt-32 pb-20 px-4 md:px-6 relative overflow-x-hidden antialiased">
      
      <div className="absolute top-[10%] left-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-300/40 blur-[80px] md:blur-[120px] rounded-full animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-blue-300/30 blur-[100px] md:blur-[150px] rounded-full animate-pulse pointer-events-none delay-1000"></div>

      <div className="max-w-4xl w-full space-y-10 relative z-10">
        <div className="text-center mb-10 md:mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex justify-center items-center w-16 h-16 md:w-20 md:h-20 rounded-[2rem] bg-white shadow-xl shadow-indigo-100/50 mb-6 md:mb-8 border border-white/60">
            <Search className="h-8 w-8 md:h-10 md:w-10 text-[#635BFF]" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-[#3E3B52] tracking-tight">Public Scanner</h1>
          <p className="text-[#8E8AAB] mt-4 md:mt-6 text-sm md:text-lg max-w-2xl mx-auto font-medium leading-relaxed px-4">
            Identify cryptographic origin and analyze pixel integrity across the global Veris ledger.
          </p>
        </div>

        {(status === 'idle' || status === 'hashing') && (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            className={clsx(
              "border border-white rounded-[2.5rem] md:rounded-[3.5rem] p-10 md:p-24 text-center transition-all bg-white/60 backdrop-blur-xl shadow-2xl shadow-indigo-50/50",
              isDragging ? "bg-white scale-[1.02] border-[#635BFF]/30" : "hover:bg-white/80",
              status === 'hashing' && "opacity-75 cursor-wait"
            )}
          >
            {status === 'hashing' ? (
              <div className="flex flex-col items-center py-4">
                <Loader2 className="h-12 w-12 text-[#635BFF] animate-spin mb-6" />
                <p className="text-[#635BFF] font-black text-[10px] md:text-xs tracking-widest uppercase animate-pulse">Checking Master Ledger...</p>
              </div>
            ) : (
              <>
                <div className="bg-white inline-flex p-4 md:p-6 rounded-3xl shadow-sm mb-8 border border-indigo-50">
                  <UploadCloud className="h-10 w-10 text-[#635BFF]" />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-[#3E3B52] tracking-tight">Drop media to scan</h3>
                <p className="text-xs md:text-sm font-bold text-[#A09CB0] mt-3 uppercase tracking-widest">Supports JPG, PNG & WebP</p>
                <input 
                  type="file" accept="image/*" className="hidden" id="verify-upload" 
                  onChange={(e) => e.target.files && verifyFile(e.target.files[0])}
                />
                <label htmlFor="verify-upload" className="mt-10 inline-block bg-[#3E3B52] text-white px-10 md:px-14 py-5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.25em] hover:bg-[#635BFF] cursor-pointer transition-all shadow-xl shadow-indigo-200 hover:scale-105 active:scale-95">
                  Select Asset
                </label>
              </>
            )}
          </div>
        )}

        {status === 'analyzing' && (
          <div className="bg-white/80 border border-white rounded-[3rem] p-16 md:p-24 text-center backdrop-blur-2xl shadow-2xl shadow-indigo-100/50 animate-in zoom-in duration-500">
            <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-8">
              <div className="absolute inset-0 border-[6px] border-indigo-50 rounded-full"></div>
              <div className="absolute inset-0 border-[6px] border-[#635BFF] rounded-full border-t-transparent animate-spin"></div>
              <BrainCircuit className="absolute inset-0 m-auto h-10 w-10 text-[#635BFF] animate-pulse" />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-[#3E3B52] tracking-tight">Pixel Mismatch.</h3>
            <p className="text-[#635BFF] font-black text-[10px] md:text-xs mt-4 uppercase tracking-[0.2em] animate-pulse">Initializing Deep Forensics...</p>
          </div>
        )}

        {status === 'done' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {matchType === 'exact' && (
               <MatchCard 
                type="success" 
                title="Verified Authentic" 
                icon={ShieldCheck} 
                owner={originalOwnerId}
                desc="Mathematically perfect match to an official registered asset."
              />
            )}
            {matchType === 'derived' && (
               <MatchCard 
                type="warning" 
                title="Derived Work" 
                icon={ShieldAlert} 
                owner={originalOwnerId}
                desc="Altered pixels, but maps to a registered perceptual fingerprint."
              />
            )}
            {matchType === 'none' && (
               <MatchCard 
                type="danger" 
                title="Unknown Origin" 
                icon={AlertTriangle} 
                desc="Unregistered media. No cryptographic seal found."
              />
            )}

            {forensicReport && (
              <div className="glass-card rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl shadow-indigo-100/30 overflow-hidden border-white/80">
                <div className="bg-white/40 border-b border-white px-8 md:px-12 py-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 text-[#635BFF] mr-4" />
                    <h3 className="font-black text-[#3E3B52] text-sm md:text-lg tracking-tight uppercase">Forensic Report</h3>
                  </div>
                </div>
                <div className="p-8 md:p-12">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 border-b border-black/5 pb-12">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#A09CB0] mb-3">Trust Score</p>
                      <p className="text-sm md:text-base text-[#8E8AAB] font-medium max-w-sm">Calculated via noise variance analysis.</p>
                    </div>
                    <div className={clsx("text-8xl md:text-9xl font-black tracking-tighter leading-none", forensicReport.is_suspicious ? "text-rose-500" : "text-emerald-500")}>
                      {forensicReport.estimated_trust}<span className="text-4xl text-[#A09CB0] ml-2">/100</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <MetricCard 
                      title="Error Level (ELA)" 
                      val={forensicReport.ela_score} 
                      icon={Layers} 
                      status={forensicReport.ela_score > 10 ? 'High Variance' : 'Standard'} 
                      isDanger={forensicReport.ela_score > 10}
                    />
                    <MetricCard 
                      title="Noise Variance" 
                      val={forensicReport.noise_variance} 
                      icon={BrainCircuit} 
                      status={forensicReport.noise_variance < 100 ? 'Artificial' : 'Organic'} 
                      isDanger={forensicReport.noise_variance < 100}
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="text-center pt-8">
               <button 
                  onClick={() => { setStatus('idle'); setForensicReport(null); setMatchType(null); }}
                  className="inline-flex items-center space-x-4 px-12 py-5 bg-[#3E3B52] text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-[#635BFF] hover:scale-105 transition-all shadow-2xl shadow-indigo-200/50"
                >
                  <RefreshCcw className="w-4 h-4" /> <span>Scan New Asset</span>
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS (One definition only) ---

function MatchCard({ type, title, icon: Icon, owner, desc }: MatchCardProps) {
  const styles = {
    success: "bg-emerald-50/90 border-emerald-200 text-emerald-600 shadow-emerald-100/50",
    warning: "bg-orange-50/90 border-orange-200 text-orange-600 shadow-orange-100/50",
    danger: "bg-rose-50/90 border-rose-200 text-rose-600 shadow-rose-100/50"
  }[type];

  const iconStyles = {
    success: "bg-emerald-500",
    warning: "bg-orange-500",
    danger: "bg-rose-500"
  }[type];

  return (
    <div className={clsx("backdrop-blur-md border rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center shadow-2xl transition-all", styles)}>
      <div className={clsx("p-5 rounded-[1.75rem] mr-8 shadow-lg mb-6 md:mb-0 flex-shrink-0 text-white", iconStyles)}>
        <Icon className="h-8 w-8 md:h-10 md:w-10" />
      </div>
      <div className="flex-1">
        <h3 className="font-black text-2xl md:text-3xl mb-3 tracking-tight">{title}</h3>
        <p className="text-current opacity-80 font-medium text-base md:text-lg leading-relaxed">
          {desc} 
          {owner && (
            <span className="block mt-4 md:inline-flex md:mt-0 md:ml-4 items-center bg-white px-4 py-1.5 rounded-2xl border border-current/10 shadow-sm text-xs font-mono uppercase tracking-widest">
              {owner}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

function MetricCard({ title, val, icon: Icon, status, isDanger }: MetricCardProps) {
  return (
    <div className="bg-white/60 border border-white p-8 rounded-[2rem] shadow-sm relative overflow-hidden group hover:bg-white transition-all duration-300">
      <Icon className="absolute top-6 right-6 w-12 h-12 text-slate-100 group-hover:text-indigo-50 transition-colors" />
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#A09CB0] mb-4 relative z-10">{title}</p>
      <p className="text-4xl font-black text-[#3E3B52] relative z-10">{val}</p>
      <div className={clsx(
        "mt-5 inline-flex items-center px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest relative z-10 border", 
        isDanger ? "bg-rose-100 text-rose-600 border-rose-200" : "bg-emerald-100 text-emerald-600 border-emerald-200"
      )}>
        <div className={clsx("w-2 h-2 rounded-full mr-2", isDanger ? "bg-rose-500" : "bg-emerald-500")}></div>
        {status}
      </div>
    </div>
  );
}