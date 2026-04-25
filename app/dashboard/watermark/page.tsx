"use client";

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Droplet, UploadCloud, ShieldCheck, Download, Lock } from 'lucide-react';
import { generateFileHash } from '@/lib/crypto';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

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

      const res = await fetch('http://localhost:8000/api/seal-data', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error("Engine failed");
      const data = await res.json();
      
      setPhash(data.phash);
      setProtectedImage(`data:image/png;base64,${data.watermarked_image_b64}`);
      
    } catch (error) {
      console.error(error);
      alert("Failed to embed watermark.");
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
        ownerId: user?.uid, // Tie it to the logged-in user!
        timestamp: serverTimestamp(),
        verisIndex: 100,
        status: 'origin_sealed'
      });
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      alert("Failed to save to vault.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="border-b border-white/40 pb-6">
        <h1 className="text-4xl font-black text-[#3E3B52] flex items-center tracking-tight">
          <div className="bg-[#635BFF] p-2 rounded-2xl mr-4 shadow-lg shadow-indigo-200">
            <Droplet className="w-8 h-8 text-white" />
          </div>
          Invisible Watermarking
        </h1>
        <p className="text-[#8E8AAB] mt-3 text-lg font-medium">
          Embed cryptographic ownership IDs directly into the frequency domain of your images.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Input */}
        <div className="bg-white/60 backdrop-blur-xl border border-white p-8 rounded-[3rem] shadow-xl shadow-indigo-50/50">
          <h2 className="text-xl font-black text-[#3E3B52] mb-6">1. Configuration</h2>
          
          <form onSubmit={handleEmbed} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#A09CB0] ml-2 mb-2">
                Original Image
              </label>
              <div className="bg-white/50 border border-white/60 rounded-full p-2 flex items-center shadow-sm">
                <input 
                  type="file" accept="image/*" required
                  onChange={(e) => e.target.files && setFile(e.target.files[0])}
                  className="block w-full text-sm text-[#8E8AAB] file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#635BFF]/10 file:text-[#635BFF] hover:file:bg-[#635BFF]/20 cursor-pointer transition-colors"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#A09CB0] ml-2 mb-2">
                Watermark Payload (Hidden ID)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#A09CB0] group-focus-within:text-[#635BFF] transition-colors" />
                </div>
                <input 
                  type="text" required value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  className="w-full bg-white/50 border border-white/60 rounded-[1.5rem] py-4 pl-14 pr-4 text-[#3E3B52] placeholder-[#A09CB0] focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all text-sm font-medium shadow-sm"
                />
              </div>
              <p className="text-xs text-[#A09CB0] font-medium mt-2 ml-2">Defaults to your secure Firebase User ID.</p>
            </div>

            <div className="pt-4">
              <button 
                type="submit" disabled={isProcessing || !file}
                className="w-full flex justify-center items-center py-4 px-4 bg-[#3E3B52] hover:bg-[#635BFF] text-white text-sm font-black uppercase tracking-widest rounded-full shadow-xl shadow-purple-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Processing DWT-DCT...
                  </>
                ) : (
                  "Embed Watermark"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Output */}
        <div className="bg-white/60 backdrop-blur-xl border border-white p-8 rounded-[3rem] shadow-xl shadow-indigo-50/50 flex flex-col">
          <h2 className="text-xl font-black text-[#3E3B52] mb-6">2. Protected Output</h2>
          
          {!protectedImage ? (
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[#A09CB0]/30 rounded-[2rem] p-8 text-center bg-white/30">
              <ShieldCheck className="w-16 h-16 text-[#A09CB0] mb-4 opacity-50" />
              <p className="text-[#8E8AAB] font-bold">Awaiting processing...</p>
              <p className="text-sm text-[#A09CB0] mt-2">Configure and embed a watermark to see the result.</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem] flex items-start shadow-sm mb-8">
                <ShieldCheck className="w-8 h-8 text-emerald-500 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-emerald-700 font-black text-lg tracking-tight">Successfully Embedded</h3>
                  <p className="text-emerald-600/80 font-medium text-sm mt-1 leading-relaxed">
                    The image is visually identical, but your cryptographic payload is now permanently hidden within the frequency domain.
                  </p>
                </div>
              </div>
              
              <div className="mt-auto flex flex-col sm:flex-row gap-4">
                <a 
                  href={protectedImage} download={`veris_protected_${file?.name}`}
                  className="flex-1 flex items-center justify-center py-4 bg-white border-2 border-[#E5E1E6] hover:border-[#3E3B52] text-[#3E3B52] rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-sm"
                >
                  <Download className="w-4 h-4 mr-2" /> Download
                </a>
                <button 
                  onClick={handleSaveToVault} disabled={isProcessing}
                  className="flex-1 flex items-center justify-center py-4 bg-[#635BFF] hover:bg-[#524be0] text-white rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4 mr-2" /> Save to Vault
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}