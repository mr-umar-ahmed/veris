"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, FileImage, ShieldCheck, Download, Sparkles, Loader2, RefreshCcw } from 'lucide-react';
import { generateFileHash, generateDeviceSignature } from '@/lib/crypto';
import { clsx } from 'clsx';

interface SealEngineResponse {
  success: boolean;
  phash: string;
  watermarked_image_b64: string;
}

export default function UploadZone() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [cryptoHash, setCryptoHash] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  
  const [protectedImage, setProtectedImage] = useState<string | null>(null);
  const [phash, setPhash] = useState<string | null>(null);

  const processFile = async (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      alert("Verification requires raw image buffers (JPG/PNG).");
      return;
    }

    setFile(selectedFile);
    setIsProcessing(true);
    setStatusText("Computing Origin Hash...");
    
    try {
      const fileHash = await generateFileHash(selectedFile);
      setCryptoHash(fileHash);
      const devSig = generateDeviceSignature();

      setStatusText("Injecting Neural Watermark...");
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("device_signature", devSig);

      const engineRes = await fetch('https://veris-iz3o.onrender.com/api/seal-data', {
        method: 'POST',
        body: formData,
      });

      if (!engineRes.ok) throw new Error("Engine offline");
      
      const engineData = (await engineRes.json()) as SealEngineResponse;
      setPhash(engineData.phash);
      setProtectedImage(`data:image/png;base64,${engineData.watermarked_image_b64}`);
      
      setStatusText("Ready for Registry.");
    } catch (error: unknown) {
      console.error(error);
      alert("Forensic Engine Mismatch. Ensure Python backend is active.");
      setFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSeal = async () => {
    if (!cryptoHash || !file || !phash) return;
    setIsProcessing(true);
    setStatusText("Locking to Ledger...");

    try {
      const response = await fetch('/api/seal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hash: cryptoHash,
          phash: phash,
          filename: file.name,
          size: file.size,
          deviceSignature: generateDeviceSignature(),
        }),
      });

      if (response.ok) {
        router.push(`/verify/${cryptoHash}`);
      }
    } catch (error: unknown) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length > 0) processFile(e.dataTransfer.files[0]);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 md:px-0">
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={clsx(
            "glass-card rounded-[2.5rem] md:rounded-[3.5rem] p-12 md:p-20 text-center transition-all duration-500 border-white/80 group",
            isDragging ? "bg-white scale-[1.02] shadow-2xl" : "hover:bg-white/60 cursor-pointer"
          )}
        >
          <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-[2rem] shadow-sm mx-auto mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-indigo-50">
            <UploadCloud className="h-10 w-10 text-[#635BFF]" />
          </div>
          <h3 className="text-2xl font-black text-[#3E3B52] tracking-tight uppercase">Injest Media</h3>
          <p className="text-[10px] font-black text-[#A09CB0] mt-4 uppercase tracking-[0.2em]">High-Resolution Assets Only</p>
          
          <input 
            type="file" accept="image/*" className="hidden" id="file-upload" 
            onChange={(e) => e.target.files && processFile(e.target.files[0])}
          />
          <label htmlFor="file-upload" className="mt-10 inline-block bg-[#3E3B52] text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.25em] hover:bg-[#635BFF] hover:scale-105 transition-all cursor-pointer shadow-xl shadow-purple-200">
            Select Archive
          </label>
        </div>
      ) : (
        <div className="glass-card rounded-[3rem] p-8 md:p-12 border-white/80 animate-in fade-in zoom-in duration-700 shadow-2xl shadow-indigo-100/50">
          <div className="flex items-center space-x-6 mb-10 pb-8 border-b border-white/60">
             <div className="p-4 md:p-5 bg-white rounded-[1.5rem] shadow-sm border border-indigo-50">
                <FileImage className="h-8 w-8 md:h-10 md:w-10 text-[#635BFF]" />
             </div>
             <div className="overflow-hidden">
                <p className="text-lg md:text-xl font-black text-[#3E3B52] truncate">{file.name}</p>
                <div className="flex items-center mt-1">
                    <span className="text-[10px] font-black text-[#A09CB0] uppercase tracking-widest">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB • Verification Ready
                    </span>
                </div>
             </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/40 rounded-[1.5rem] p-5 md:p-6 border border-white/60 shadow-inner">
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#A09CB0] mb-3 flex items-center">
                <Sparkles className="w-3 h-3 mr-2 text-orange-400" /> SHA-256 Bitstream Hash
              </p>
              <code className="text-[10px] md:text-xs font-bold font-mono text-[#7D7996] break-all leading-relaxed">
                {cryptoHash || "Calculating Bit-Sequence..."}
              </code>
            </div>

            <div className="bg-white/40 rounded-[1.5rem] p-5 md:p-6 border border-white/60 shadow-inner">
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#635BFF] mb-3 flex items-center">
                <ShieldCheck className="w-3 h-3 mr-2" /> Neural Perceptual Identity
              </p>
              <code className="text-[10px] md:text-xs font-bold font-mono text-[#3E3B52] break-all leading-relaxed">
                {phash || "Synthesizing Vectors..."}
              </code>
            </div>
          </div>

          {protectedImage && (
            <div className="mt-8 p-6 bg-emerald-50/80 backdrop-blur-sm rounded-[2rem] border border-emerald-100 flex flex-col sm:flex-row justify-between items-center animate-in slide-in-from-top-2 duration-500 gap-4">
              <div className="text-center sm:text-left">
                <p className="text-xs font-black text-emerald-800 uppercase tracking-widest">Seal Embedded</p>
                <p className="text-[10px] text-emerald-600 font-bold mt-1 tracking-tight">Pixel-buffers re-written with origin ID.</p>
              </div>
              <a 
                href={protectedImage} download={`veris_sealed_${file.name}`}
                className="w-full sm:w-auto flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-white border border-emerald-200 px-6 py-3 rounded-full hover:bg-emerald-100 transition-all shadow-sm active:scale-95"
              >
                <Download className="w-4 h-4 mr-2" /> Export
              </a>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <button 
                onClick={() => {setFile(null); setProtectedImage(null);}}
                className="flex-1 flex items-center justify-center py-5 rounded-[1.5rem] bg-white border border-white text-[10px] font-black uppercase tracking-widest text-[#A09CB0] hover:text-rose-500 transition-all"
            >
                <RefreshCcw className="w-4 h-4 mr-2" /> Abort
            </button>
            <button 
                onClick={handleSeal} disabled={!cryptoHash || !phash || isProcessing}
                className="flex-[2] bg-[#3E3B52] text-white py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#635BFF] hover:scale-[1.02] active:scale-[0.98] flex justify-center items-center disabled:opacity-50 transition-all shadow-2xl shadow-purple-200"
            >
                {isProcessing ? (
                <div className="flex items-center">
                    <Loader2 className="w-4 h-4 animate-spin mr-3" />
                    <span>{statusText}</span>
                </div>
                ) : (
                <span className="flex items-center"><ShieldCheck className="h-4 h-4 mr-3" /> Execute Seal</span>
                )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}