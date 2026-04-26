"use client";

import { useState, useCallback } from 'react';
import { 
  BrainCircuit, 
  UploadCloud, 
  CheckCircle2, 
  Image as ImageIcon, 
  Sparkles, 
  Loader2, 
  RefreshCcw,
  Zap,
  Info
} from 'lucide-react';
import { clsx } from 'clsx';

// --- TS INTERFACES ---
interface DetectionResults {
  ai: number;
  real: number;
}

export default function AIDetectPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [results, setResults] = useState<DetectionResults | null>(null);

  const runScan = async (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
        alert("Please upload a valid image (JPG/PNG/WEBP).");
        return;
    }
    setFile(selectedFile);
    setIsScanning(true);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch('http://localhost:8000/api/ai-detect', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error("Neural Engine Unreachable");
      const data = await res.json();
      
      // Intentional delay to allow high-end scanning animations to play
      setTimeout(() => {
        setResults(data.results);
        setIsScanning(false);
      }, 2200);

    } catch (error: unknown) {
      console.error(error);
      const msg = error instanceof Error ? error.message : "Internal Error";
      alert(`Detection failed: ${msg}`);
      setIsScanning(false);
      setFile(null);
    }
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length > 0) {
      runScan(e.dataTransfer.files[0]);
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32 antialiased">
      
      {/* --- HEADER --- */}
      <div className="border-b border-white/40 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-[#3E3B52] flex items-center tracking-tighter uppercase leading-none">
            <div className="bg-emerald-500 p-3 rounded-2xl mr-5 shadow-xl shadow-emerald-100 hidden sm:block">
              <BrainCircuit className="w-8 h-8 text-white" />
            </div>
            AI Detection
          </h1>
          <p className="text-[#8E8AAB] mt-4 text-sm md:text-lg font-medium max-w-2xl leading-relaxed">
            Execute structural noise analysis to identify patterns from Midjourney, DALL-E, and Stable Diffusion models.
          </p>
        </div>
        <div className="bg-white/60 px-5 py-2.5 rounded-2xl border border-white self-start md:self-center shadow-sm">
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center">
                <Sparkles className="w-3 h-3 mr-2" /> Swin Transformer v2
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* --- LEFT: UPLOAD COLUMN (Col 5) --- */}
        <div className="lg:col-span-5 bg-white/60 backdrop-blur-xl border border-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl shadow-indigo-50/50 flex flex-col h-full min-h-[400px]">
          <h2 className="text-xl font-black text-[#3E3B52] tracking-tight uppercase mb-8">Inquiry Input</h2>
          
          {!file ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              className={clsx(
                "flex-1 border border-white rounded-[2.5rem] p-8 text-center transition-all duration-500 flex flex-col items-center justify-center bg-white/40 group",
                isDragging ? "bg-white scale-[1.02] border-emerald-200" : "hover:bg-white/80"
              )}
            >
              <input 
                type="file" accept="image/*" className="hidden" id="ai-upload" 
                onChange={(e) => e.target.files && runScan(e.target.files[0])}
              />
              <div className="bg-white p-5 rounded-[1.5rem] shadow-sm mb-6 border border-emerald-50 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8 text-emerald-500" />
              </div>
              <p className="text-[#3E3B52] font-black tracking-tight text-xl uppercase mb-2">Drop Media</p>
              <p className="text-[10px] text-[#A09CB0] font-black uppercase tracking-widest mb-8">Raw Pixels Required</p>
              
              <label htmlFor="ai-upload" className="inline-block bg-[#3E3B52] text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.25em] hover:bg-emerald-500 hover:scale-105 transition-all cursor-pointer shadow-xl shadow-emerald-100">
                Browse Files
              </label>
            </div>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center border border-white rounded-[2.5rem] bg-white/80 p-10 text-center shadow-inner animate-in zoom-in duration-300">
               <div className="p-6 bg-white rounded-[2rem] shadow-sm mb-6">
                <ImageIcon className={clsx("w-12 h-12", isScanning ? "text-emerald-500 animate-pulse" : "text-[#A09CB0]")} />
               </div>
               <p className="text-[#3E3B52] font-black text-sm mb-2 truncate w-full px-4">{file.name}</p>
               <p className="text-[10px] text-[#8E8AAB] font-black uppercase tracking-widest mb-10">{(file.size / 1024 / 1024).toFixed(2)} MB Payload</p>
               <button 
                  onClick={() => { setFile(null); setResults(null); }}
                  className="flex items-center space-x-2 px-8 py-4 bg-white border border-white hover:border-[#3E3B52] text-[#3E3B52] rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                >
                  <RefreshCcw className="w-3 h-3" /> <span>Clear Session</span>
                </button>
            </div>
          )}
        </div>

        {/* --- RIGHT: ANALYSIS COLUMN (Col 7) --- */}
        <div className="lg:col-span-7 glass-card border-white/80 p-8 md:p-12 rounded-[3rem] md:rounded-[4rem] shadow-2xl shadow-indigo-100/30 min-h-[500px] flex flex-col">
           <div className="flex items-center justify-between mb-10">
                <h2 className="text-xl md:text-2xl font-black text-[#3E3B52] tracking-tight uppercase">Neural Analysis</h2>
                {results && (
                    <div className="bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100 flex items-center shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></div>
                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Tensor Scan Complete</span>
                    </div>
                )}
           </div>
           
           {!file && !isScanning && !results ? (
             <div className="flex-1 bg-white/20 rounded-[2.5rem] border-2 border-dashed border-[#A09CB0]/20 p-12 flex flex-col items-center justify-center text-center">
                <div className="bg-white p-6 rounded-full shadow-sm mb-6 border border-indigo-50">
                    <Zap className="w-10 h-10 text-[#A09CB0] opacity-30" />
                </div>
                <p className="text-[#3E3B52] font-black text-lg tracking-tight uppercase">Engine Standby</p>
                <p className="text-sm text-[#8E8AAB] mt-3 max-w-xs font-medium leading-relaxed uppercase tracking-wider">
                    Upload an asset to begin high-dimensional probability mapping of pixel authenticity.
                </p>
             </div>
           ) : isScanning ? (
             <div className="flex-1 bg-white/40 rounded-[2.5rem] border border-white p-12 flex flex-col items-center justify-center shadow-inner">
               <Loader2 className="animate-spin h-12 w-12 text-emerald-500 mb-6" />
               <p className="text-emerald-500 font-black text-[10px] md:text-xs uppercase tracking-[0.3em] animate-pulse">Running Inception-V4...</p>
               <div className="mt-10 w-full max-w-xs bg-[#E5E1E6] rounded-full h-1.5 overflow-hidden border border-white">
                  <div className="h-full bg-emerald-400 rounded-full animate-[progress_2s_infinite]"></div>
               </div>
             </div>
           ) : results ? (
             <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
                
                <div className="bg-emerald-50/80 backdrop-blur-sm border border-emerald-100 p-8 rounded-[2.5rem] flex items-start shadow-sm">
                  <div className="bg-emerald-500 p-3 rounded-xl mr-5 shadow-lg shadow-emerald-100">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-emerald-700 font-black text-xl tracking-tight uppercase">Structural Audit Verified</h3>
                    <p className="text-emerald-600/80 font-bold text-sm mt-1 leading-relaxed">
                      Pixel structures have been cross-referenced against 10M+ known generative patterns. Probability weights are assigned below.
                    </p>
                  </div>
                </div>

                {/* PROBABILITY BARS */}
                <div className="bg-white/60 border border-white rounded-[2.5rem] p-8 md:p-10 shadow-sm hover:bg-white transition-all duration-300 space-y-10">
                  <ProbabilityBar 
                    label="Authentic / Hardware Source" 
                    val={results.real} 
                    color="bg-emerald-500" 
                    textColor="text-emerald-500" 
                  />
                  <ProbabilityBar 
                    label="Synthetically Generated" 
                    val={results.ai} 
                    color="bg-rose-500" 
                    textColor="text-rose-500" 
                  />

                  <div className="pt-6 border-t border-black/5 flex items-center text-[#A09CB0]">
                    <Info className="w-4 h-4 mr-3" />
                    <p className="text-[10px] font-bold uppercase tracking-widest">
                      Calculated via Noise Variance & Semantic Discontinuity
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={() => { setFile(null); setResults(null); }}
                    className="w-full flex items-center justify-center py-5 bg-white border border-white hover:border-[#3E3B52] text-[#3E3B52] rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-50/50 hover:scale-105 active:scale-95"
                  >
                    <RefreshCcw className="w-4 h-4 mr-3" /> Analyze New Inquiry
                  </button>
                </div>
             </div>
           ) : null}
        </div>

      </div>
    </div>
  );
}

// --- TYPED SUB-COMPONENTS ---

function ProbabilityBar({ label, val, color, textColor }: { label: string, val: number, color: string, textColor: string }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end px-1">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A09CB0]">{label}</span>
        <span className={clsx("font-black text-3xl md:text-4xl tracking-tighter", textColor)}>{val}%</span>
      </div>
      <div className="w-full bg-[#E5E1E6] rounded-full h-4 p-1 shadow-inner border border-white">
        <div 
          className={clsx(color, "h-2 rounded-full transition-all duration-1000 ease-out shadow-sm")} 
          style={{ width: `${val}%` }}
        ></div>
      </div>
    </div>
  );
}