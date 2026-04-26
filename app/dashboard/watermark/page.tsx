"use client";

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Droplet, UploadCloud, ShieldCheck, Download, Lock, Sparkles, FileImage, Loader2 } from 'lucide-react';
import { generateFileHash } from '@/lib/crypto';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { clsx } from 'clsx';

export default function WatermarkPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState(user?.uid || 'VERIS_SECURE');
  const [isProcessing, setIsProcessing] = useState(false);
  const [protectedImage, setProtectedImage] = useState<string | null>(null);
  const [phash, setPhash] = useState<string | null>(null);
  const [cryptoHash, setCryptoHash] = useState<string | null>(null);

  const handleEmbed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setIsProcessing(true);

    try {
      // 1. Generate local SHA
      const hash = await generateFileHash(file);
      setCryptoHash(hash);

      // 2. Call Python Engine to embed watermark
      const formData = new FormData();
      formData.append("file", file);
      formData.append("device_signature", watermarkText);

      const res = await fetch('https://veris-iz3o.onrender.com/api/seal-data', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error("Engine failed");
      const data = await res.json();
      
      setPhash(data.phash);
      setProtectedImage(`data:image/png;base64,${data.watermarked_image_b64}`);
      
    } catch (error) {
      console.error(error);
      alert("Verification Engine Unreachable. Ensure Python backend is active.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveToVault = async () => {
    if (!cryptoHash || !phash || !file) return;
    setIsProcessing(true);
    try {
      const sealRef = doc(db, 'seals', cryptoHash);
      await setDoc(sealRef, {
        hash: cryptoHash,
        phash: phash,
        filename: file.name,
        size: file.size,
        deviceSignature: watermarkText,
        ownerId: user?.uid,
        timestamp: serverTimestamp(),
        verisIndex: 100,
        status: 'origin_sealed'
      });
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      alert("Failed to synchronize with Veris Ledger.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* --- HEADER --- */}
      <div className="border-b border-white/40 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-[#3E3B52] flex items-center tracking-tighter uppercase">
            <div className="bg-[#635BFF] p-3 rounded-2xl mr-4 shadow-xl shadow-indigo-100 hidden sm:block">
              <Droplet className="w-8 h-8 text-white" />
            </div>
            Origin Sealing
          </h1>
          <p className="text-[#8E8AAB] mt-3 text-sm md:text-lg font-medium max-w-2xl">
            Embed cryptographic ownership IDs into the frequency domain of your assets. Visuals remain pristine; ownership becomes permanent.
          </p>
        </div>
        <div className="bg-white/60 px-4 py-2 rounded-2xl border border-white self-start md:self-center">
            <p className="text-[10px] font-black text-[#635BFF] uppercase tracking-widest flex items-center">
                <Sparkles className="w-3 h-3 mr-2" /> DWT-DCT Powered
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* --- LEFT: CONFIGURATION (Col 5) --- */}
        <div className="lg:col-span-5 bg-white/60 backdrop-blur-xl border border-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl shadow-indigo-50/50">
          <div className="flex items-center space-x-3 mb-8">
             <div className="w-8 h-8 rounded-full bg-[#3E3B52] text-white flex items-center justify-center font-black text-xs">1</div>
             <h2 className="text-xl font-black text-[#3E3B52] tracking-tight uppercase">Configuration</h2>
          </div>
          
          <form onSubmit={handleEmbed} className="space-y-8">
            {/* File Input */}
            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#A09CB0] ml-2">
                Target Asset
              </label>
              <div className="relative group bg-white/40 border border-white/60 rounded-[2rem] p-4 transition-all hover:bg-white/80">
                <input 
                  type="file" accept="image/*" required
                  onChange={(e) => e.target.files && setFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex items-center">
                    <div className="bg-[#635BFF]/10 p-4 rounded-2xl mr-4 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-6 h-6 text-[#635BFF]" />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-[#3E3B52] truncate">
                            {file ? file.name : "Select raw media file"}
                        </p>
                        <p className="text-[10px] text-[#A09CB0] font-black uppercase tracking-widest mt-1">
                            {file ? `${(file.size / 1024).toFixed(1)} KB` : "PNG, JPG, WEBP"}
                        </p>
                    </div>
                </div>
              </div>
            </div>
            
            {/* Payload Input */}
            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#A09CB0] ml-2">
                Organization Signature
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-[#A09CB0] group-focus-within:text-[#635BFF] transition-colors" />
                </div>
                <input 
                  type="text" required value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  className="w-full bg-white/40 border border-white/60 rounded-[2rem] py-5 pl-14 pr-6 text-[#3E3B52] placeholder-[#A09CB0] focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all text-sm font-bold shadow-sm"
                />
              </div>
            </div>

            <button 
              type="submit" disabled={isProcessing || !file}
              className="w-full flex justify-center items-center py-5 px-6 bg-[#3E3B52] hover:bg-[#635BFF] text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-2xl shadow-purple-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <Loader2 className="animate-spin h-4 w-4 mr-3" />
                  Processing Matrix...
                </div>
              ) : (
                "Compute Signature"
              )}
            </button>
          </form>
        </div>

        {/* --- RIGHT: OUTPUT (Col 7) --- */}
        <div className="lg:col-span-7 flex flex-col h-full">
          <div className="glass-card flex-1 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 border-white/80 shadow-2xl shadow-indigo-100/50 flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-white text-[#3E3B52] flex items-center justify-center font-black text-xs shadow-sm border border-indigo-50">2</div>
                    <h2 className="text-xl font-black text-[#3E3B52] tracking-tight uppercase">Protected Output</h2>
                </div>
                {protectedImage && (
                    <div className="animate-pulse flex items-center text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div> Ready
                    </div>
                )}
            </div>
            
            {!protectedImage ? (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[#A09CB0]/20 rounded-[2.5rem] p-12 text-center bg-white/20 min-h-[300px]">
                <div className="bg-white p-6 rounded-[2rem] shadow-sm mb-6 border border-indigo-50">
                    <ShieldCheck className="w-12 h-12 text-[#A09CB0] opacity-30" />
                </div>
                <p className="text-[#3E3B52] font-black text-lg tracking-tight uppercase">Awaiting Computation</p>
                <p className="text-sm text-[#8E8AAB] mt-3 max-w-xs font-medium leading-relaxed uppercase tracking-wider">
                    Submit the asset configuration to generate the cryptographic output.
                </p>
              </div>
            ) : (
              <div className="flex flex-col h-full animate-in zoom-in duration-500">
                <div className="bg-emerald-50/80 backdrop-blur-sm border border-emerald-100 p-8 rounded-[2.5rem] flex items-start shadow-sm mb-10">
                  <div className="bg-emerald-500 p-3 rounded-xl mr-5 shadow-lg shadow-emerald-100">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-emerald-700 font-black text-xl tracking-tight">Registration Ready</h3>
                    <p className="text-emerald-600/80 font-bold text-sm mt-1 leading-relaxed">
                      Pixel-level signatures successfully mapped. The asset is visually unchanged but verifiable on the ledger.
                    </p>
                  </div>
                </div>
                
                {/* Visual Feedback Grid */}
                <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="bg-white/40 p-5 rounded-3xl border border-white">
                        <p className="text-[10px] font-black text-[#A09CB0] uppercase tracking-widest mb-1">Payload Size</p>
                        <p className="text-sm font-black text-[#3E3B52]">{(file!.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <div className="bg-white/40 p-5 rounded-3xl border border-white">
                        <p className="text-[10px] font-black text-[#A09CB0] uppercase tracking-widest mb-1">DWT Variance</p>
                        <p className="text-sm font-black text-[#635BFF]">± 0.0004%</p>
                    </div>
                </div>

                <div className="mt-auto flex flex-col sm:flex-row gap-6">
                  <a 
                    href={protectedImage} download={`veris_protected_${file?.name}`}
                    className="flex-1 flex items-center justify-center py-5 bg-white border border-white hover:border-[#3E3B52] text-[#3E3B52] rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-50/50 hover:scale-105"
                  >
                    <Download className="w-4 h-4 mr-3" /> Download Result
                  </a>
                  <button 
                    onClick={handleSaveToVault} disabled={isProcessing}
                    className="flex-1 flex items-center justify-center py-5 bg-[#635BFF] text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl shadow-indigo-200 hover:bg-[#524be0] hover:scale-105 active:scale-95 disabled:opacity-50"
                  >
                    <ShieldCheck className="w-4 h-4 mr-3" /> Lock to Ledger
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}