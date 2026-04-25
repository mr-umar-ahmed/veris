"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, FileImage, ShieldCheck, Download, Sparkles, Loader2 } from 'lucide-react';
import { generateFileHash, generateDeviceSignature } from '@/lib/crypto';
import clsx from 'clsx';

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
      alert("Please upload an image file (JPG/PNG).");
      return;
    }

    setFile(selectedFile);
    setIsProcessing(true);
    setStatusText("Calculating Origin Hash...");
    
    try {
      const fileHash = await generateFileHash(selectedFile);
      setCryptoHash(fileHash);
      const devSig = generateDeviceSignature();

      setStatusText("Embedding Invisible Watermark...");
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("device_signature", devSig);

      const engineRes = await fetch('http://localhost:8000/api/seal-data', {
        method: 'POST',
        body: formData,
      });

      if (!engineRes.ok) throw new Error("Engine failed");
      
      const engineData = (await engineRes.json()) as SealEngineResponse;
      setPhash(engineData.phash);
      setProtectedImage(`data:image/png;base64,${engineData.watermarked_image_b64}`);
      
      setStatusText("Ready to finalize.");
    } catch (error) {
      console.error(error);
      alert("Failed to process image. Ensure Python Engine is active.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSeal = async () => {
    if (!cryptoHash || !file || !phash) return;
    setIsProcessing(true);
    setStatusText("Registering Seal...");

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
    } catch (error) {
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
    <div className="w-full max-w-2xl mx-auto">
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={clsx(
            "glass-card rounded-[3rem] p-16 text-center cursor-pointer transition-all duration-500 border-white/80 group",
            isDragging ? "bg-white scale-105 shadow-2xl" : "hover:bg-white/60"
          )}
        >
          <div className="w-24 h-24 bg-white rounded-[2rem] shadow-sm mx-auto mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <UploadCloud className="h-10 w-10 text-[#635BFF]" />
          </div>
          <h3 className="text-2xl font-black text-[#3E3B52] tracking-tight">Drop media to seal</h3>
          <p className="text-sm font-medium text-[#A09CB0] mt-3 uppercase tracking-widest">High-Res PNG/JPG Only</p>
          
          <input 
            type="file" accept="image/*" className="hidden" id="file-upload" 
            onChange={(e) => e.target.files && processFile(e.target.files[0])}
          />
          <label htmlFor="file-upload" className="mt-10 inline-block bg-[#3E3B52] text-white px-10 py-4 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:scale-105 transition-transform cursor-pointer shadow-xl shadow-purple-200">
            Select Asset
          </label>
        </div>
      ) : (
        <div className="glass-card rounded-[3rem] p-10 border-white/80 animate-in fade-in zoom-in duration-500 shadow-2xl shadow-purple-100">
          <div className="flex items-center space-x-6 mb-10 pb-8 border-b border-white/60">
             <div className="p-4 bg-white rounded-3xl shadow-sm">
                <FileImage className="h-10 w-10 text-[#635BFF]" />
             </div>
             <div>
                <p className="text-xl font-black text-[#3E3B52] truncate max-w-xs">{file.name}</p>
                <p className="text-xs font-black text-[#A09CB0] uppercase tracking-widest">{(file.size / (1024 * 1024)).toFixed(2)} MB • File Ready</p>
             </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/40 rounded-[1.5rem] p-6 border border-white/60">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A09CB0] mb-2 flex items-center">
                <Sparkles className="w-3 h-3 mr-2" /> SHA-256 Origin Hash
              </p>
              <span className="text-xs font-bold font-mono text-[#7D7996] break-all">
                {cryptoHash || "Generating sequence..."}
              </span>
            </div>

            <div className="bg-white/40 rounded-[1.5rem] p-6 border border-white/60">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#635BFF] mb-2 flex items-center">
                <ShieldCheck className="w-3 h-3 mr-2" /> AI Perceptual Hash
              </p>
              <span className="text-xs font-bold font-mono text-[#3E3B52] break-all">
                {phash || "Decrypting pixels..."}
              </span>
            </div>
          </div>

          {protectedImage && (
            <div className="mt-8 p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex justify-between items-center animate-in slide-in-from-top-2 duration-500">
              <div>
                <p className="text-sm font-black text-emerald-800 uppercase tracking-wide">Watermark Applied</p>
                <p className="text-[10px] text-emerald-600 font-bold tracking-tight">Pixels re-encoded with hidden identity.</p>
              </div>
              <a 
                href={protectedImage} download={`veris_protected_${file.name}`}
                className="flex items-center text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-white border border-emerald-200 px-5 py-3 rounded-full hover:bg-emerald-100 transition-all shadow-sm"
              >
                <Download className="w-4 h-4 mr-2" /> Download
              </a>
            </div>
          )}

          <button 
            onClick={handleSeal} disabled={!cryptoHash || !phash || isProcessing}
            className="w-full mt-10 bg-[#3E3B52] text-white py-5 rounded-[2rem] text-sm font-black uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] flex justify-center items-center disabled:opacity-50 transition-all shadow-2xl shadow-purple-200"
          >
            {isProcessing ? (
              <div className="flex items-center space-x-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{statusText}</span>
              </div>
            ) : (
              <span className="flex items-center"><ShieldCheck className="h-5 w-5 mr-3" /> Finalize Registration</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}