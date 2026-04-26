"use client";

import { useState, useCallback } from 'react';
import { 
  Key, 
  UploadCloud, 
  Fingerprint, 
  Search, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Loader2, 
  RefreshCcw,
  Binary
} from 'lucide-react';
import { clsx } from 'clsx';

// --- TS INTERFACES ---
interface FingerprintHashes {
  [key: string]: string;
  sha256: string;
  pHash: string;
  dHash: string;
  aHash: string;
}

export default function FingerprintingPage() {
  const [activeTab, setActiveTab] = useState<'generate' | 'compare'>('generate');
  const [file, setFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [hashes, setHashes] = useState<FingerprintHashes | null>(null);

  const generateHashes = async (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
        alert("Please upload a valid image file.");
        return;
    }
    setFile(selectedFile);
    setIsGenerating(true);
    setHashes(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch('https://veris-iz3o.onrender.com/api/fingerprint', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error("Forensic Engine Unreachable");
      const data = await res.json();
      setHashes(data.hashes);
    } catch (error: unknown) {
      console.error(error);
      const msg = error instanceof Error ? error.message : "Engine failure";
      alert(`Generation failed: ${msg}`);
      setFile(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length > 0) {
      generateHashes(e.dataTransfer.files[0]);
    }
  }, []);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(type);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      
      {/* --- HEADER --- */}
      <div className="border-b border-white/40 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-[#3E3B52] flex items-center tracking-tighter uppercase leading-none">
            <div className="bg-orange-500 p-3 rounded-2xl mr-5 shadow-xl shadow-orange-100 hidden sm:block">
              <Key className="w-8 h-8 text-white" />
            </div>
            Vector Mapping
          </h1>
          <p className="text-[#8E8AAB] mt-4 text-sm md:text-lg font-medium max-w-2xl leading-relaxed">
            Generate unique perceptual identifiers or compare assets to detect unauthorized derivatives across the digital landscape.
          </p>
        </div>
        <div className="bg-white/60 px-5 py-2.5 rounded-2xl border border-white self-start md:self-center shadow-sm">
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center">
                <Sparkles className="w-3 h-3 mr-2" /> Neural Hash v1.0
            </p>
        </div>
      </div>

      {/* --- TAB NAVIGATION --- */}
      <div className="flex items-center space-x-3 bg-white/40 p-2 rounded-[2rem] border border-white/60 w-fit backdrop-blur-md shadow-sm">
        <TabButton 
            active={activeTab === 'generate'} 
            onClick={() => { setActiveTab('generate'); setFile(null); setHashes(null); }}
            icon={Fingerprint}
            label="Generate"
        />
        <TabButton 
            active={activeTab === 'compare'} 
            onClick={() => { setActiveTab('compare'); setFile(null); setHashes(null); }}
            icon={Search}
            label="Compare"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* --- LEFT: UPLOAD REGION (Col 4) --- */}
        <div className="lg:col-span-4 bg-white/60 backdrop-blur-xl border border-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl shadow-indigo-50/50 flex flex-col h-full min-h-[400px]">
          <h2 className="text-xl font-black text-[#3E3B52] tracking-tight uppercase mb-8">
            {activeTab === 'generate' ? 'Source Media' : 'Primary Base'}
          </h2>
          
          {!file ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              className={clsx(
                "flex-1 border border-white rounded-[2.5rem] p-8 text-center transition-all duration-500 flex flex-col items-center justify-center bg-white/40 group",
                isDragging ? "bg-white scale-[1.02] border-orange-200" : "hover:bg-white/80"
              )}
            >
              <input 
                type="file" accept="image/*" className="hidden" id="fingerprint-upload"
                onChange={(e) => e.target.files && generateHashes(e.target.files[0])}
              />
              <div className="bg-white p-5 rounded-[1.5rem] shadow-sm mb-6 border border-orange-50 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8 text-orange-500" />
              </div>
              <p className="text-[#3E3B52] font-black tracking-tight text-xl uppercase mb-2">Drop Image</p>
              <p className="text-[10px] text-[#A09CB0] font-black uppercase tracking-widest mb-8">Analyze Visual DNA</p>
              
              <label htmlFor="fingerprint-upload" className="inline-block bg-[#3E3B52] text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.25em] hover:bg-orange-500 hover:scale-105 transition-all cursor-pointer shadow-xl shadow-orange-100">
                Browse Files
              </label>
            </div>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center border border-white rounded-[2.5rem] bg-white/80 p-10 text-center shadow-inner animate-in zoom-in duration-300">
               <div className="p-6 bg-white rounded-[2rem] shadow-sm mb-6">
                <Fingerprint className={clsx("w-12 h-12", isGenerating ? "text-orange-500 animate-pulse" : "text-[#A09CB0]")} />
               </div>
               <p className="text-[#3E3B52] font-black text-sm mb-2 truncate w-full px-4">{file.name}</p>
               <p className="text-[10px] text-[#8E8AAB] font-black uppercase tracking-widest mb-10">{(file.size / 1024 / 1024).toFixed(2)} MB Payload</p>
               <button 
                  onClick={() => { setFile(null); setHashes(null); }}
                  className="flex items-center space-x-2 px-8 py-4 bg-white border border-white hover:border-[#3E3B52] text-[#3E3B52] rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                >
                  <RefreshCcw className="w-3 h-3" /> <span>Reset Session</span>
                </button>
            </div>
          )}
        </div>

        {/* --- RIGHT: OUTPUT REGION (Col 8) --- */}
        <div className="lg:col-span-8 glass-card border-white/80 p-8 md:p-12 rounded-[3rem] md:rounded-[4rem] shadow-2xl shadow-indigo-100/30 min-h-[500px] flex flex-col">
           <div className="flex items-center justify-between mb-10">
                <h2 className="text-xl md:text-2xl font-black text-[#3E3B52] tracking-tight uppercase">Forensic Identifiers</h2>
                {hashes && (
                    <div className="bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100 flex items-center shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></div>
                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest uppercase">Verification Success</span>
                    </div>
                )}
           </div>
           
           {!hashes && !isGenerating ? (
             <div className="flex-1 bg-white/20 rounded-[2.5rem] border-2 border-dashed border-[#A09CB0]/20 p-12 flex flex-col items-center justify-center text-center">
                <div className="bg-white p-6 rounded-full shadow-sm mb-6 border border-indigo-50">
                    <Binary className="w-10 h-10 text-[#A09CB0] opacity-30" />
                </div>
                <p className="text-[#3E3B52] font-black text-lg tracking-tight uppercase">Standby for Data</p>
                <p className="text-sm text-[#8E8AAB] mt-3 max-w-sm font-medium leading-relaxed uppercase tracking-wider">
                    Upload an asset to derive its multi-dimensional perceptual vectors and master cryptographic hash.
                </p>
             </div>
           ) : isGenerating ? (
             <div className="flex-1 bg-white/40 rounded-[2.5rem] border border-white p-12 flex flex-col items-center justify-center shadow-inner">
               <Loader2 className="animate-spin h-12 w-12 text-orange-500 mb-6" />
               <p className="text-orange-500 font-black text-[10px] md:text-xs uppercase tracking-[0.3em] animate-pulse">Extracting DNA...</p>
             </div>
           ) : hashes ? (
             <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
                
                {/* Perceptual Hashes (Robust to edits) */}
                <div className="bg-white/60 border border-white rounded-[2.5rem] p-8 shadow-sm hover:bg-white transition-all duration-300">
                  <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-[#A09CB0] mb-6 flex items-center">
                    <Fingerprint className="w-4 h-4 mr-3 text-orange-400" /> Neural Perceptual Mapping
                  </h3>
                  
                  <div className="space-y-4">
                    {['pHash', 'dHash', 'aHash'].map((type) => (
                      <HashRow 
                        key={type} 
                        label={type} 
                        val={hashes[type]} 
                        isCopied={copiedHash === type} 
                        onCopy={() => copyToClipboard(hashes[type], type)} 
                        theme="orange"
                      />
                    ))}
                  </div>
                  <p className="text-[9px] text-[#A09CB0] font-bold uppercase tracking-widest mt-6 ml-1 opacity-70">
                    * Robust identifiers used for detecting cropped, filtered, or resized versions.
                  </p>
                </div>

                {/* Cryptographic Hash */}
                <div className="bg-white/60 border border-white rounded-[2.5rem] p-8 shadow-sm hover:bg-white transition-all duration-300">
                  <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-[#A09CB0] mb-6 flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-3 text-[#635BFF]" /> Integrity Ledger (SHA-256)
                  </h3>
                  <HashRow 
                    label="SHA256" 
                    val={hashes.sha256} 
                    isCopied={copiedHash === 'sha256'} 
                    onCopy={() => copyToClipboard(hashes.sha256, 'sha256')} 
                    theme="indigo"
                  />
                  <p className="text-[9px] text-[#A09CB0] font-bold uppercase tracking-widest mt-6 ml-1 opacity-70">
                    * Fragile identifier for 1:1 binary validation.
                  </p>
                </div>

             </div>
           ) : null}
        </div>

      </div>
    </div>
  );
}

// --- TYPED SUB-COMPONENTS ---

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: React.ElementType, label: string }) {
    return (
        <button
            onClick={onClick}
            className={clsx(
                "flex items-center px-8 py-3 text-[10px] font-black uppercase tracking-widest rounded-full transition-all whitespace-nowrap",
                active 
                ? "bg-white text-orange-600 shadow-md scale-105" 
                : "text-[#8E8AAB] hover:text-[#3E3B52] hover:bg-white/50"
            )}
        >
            <Icon className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
            {label}
        </button>
    );
}

function HashRow({ label, val, isCopied, onCopy, theme }: { label: string, val: string, isCopied: boolean, onCopy: () => void, theme: 'orange' | 'indigo' }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/40 border border-white/80 rounded-2xl shadow-sm hover:shadow-md transition-all group">
            <span className="text-[10px] font-black text-[#8E8AAB] uppercase tracking-widest mb-3 sm:mb-0 w-16">{label}</span>
            <code className={clsx(
                "font-mono px-4 py-2.5 rounded-xl break-all flex-1 sm:mx-6 text-[10px] sm:text-xs text-center border leading-relaxed",
                theme === 'orange' ? "text-orange-600 bg-orange-50 border-orange-100" : "text-[#635BFF] bg-indigo-50 border-indigo-100"
            )}>
                {val}
            </code>
            <button 
                onClick={onCopy}
                className="mt-3 sm:mt-0 p-2.5 text-[#8E8AAB] hover:text-[#3E3B52] bg-white border border-white hover:border-[#3E3B52] rounded-xl transition-all self-end sm:self-auto shadow-sm active:scale-90"
            >
                {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
        </div>
    );
}