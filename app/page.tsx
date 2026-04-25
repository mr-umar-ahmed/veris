"use client";

import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, Fingerprint, BrainCircuit, Activity, Lock, Search, ChevronRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#E5E1E6] overflow-hidden selection:bg-[#635BFF] selection:text-white pb-32">
      
      {/* Background Soft Blobs - Extended for scrolling */}
      <div className="absolute top-[-5%] left-[-10%] w-[600px] h-[600px] bg-orange-300/30 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[700px] h-[700px] bg-indigo-300/30 blur-[150px] rounded-full animate-pulse pointer-events-none" style={{animationDelay: '-2s'}}></div>
      <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-rose-300/20 blur-[120px] rounded-full animate-pulse pointer-events-none" style={{animationDelay: '-4s'}}></div>

      {/* --- HERO SECTION --- */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-40 text-center">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center px-5 py-2 rounded-full bg-white/80 backdrop-blur-md border border-white text-[#635BFF] text-xs font-black uppercase tracking-widest mb-10 shadow-sm">
            <Sparkles className="w-4 h-4 mr-2 text-orange-400" />
            Veris Enterprise Engine v1.0
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black text-[#3E3B52] tracking-tighter mb-8 leading-[0.85]">
            Secure <span className="text-[#635BFF]">Media</span>.<br />
            Detect Use.
          </h1>

          <p className="text-xl md:text-2xl text-[#8E8AAB] max-w-3xl mx-auto mb-16 leading-relaxed font-medium">
            The ultimate cryptographic command center. Authenticate digital assets, embed invisible ownership signatures, and flag misappropriation across the web in near real-time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/login" className="px-10 py-5 bg-[#3E3B52] text-white text-sm md:text-base font-black uppercase tracking-widest rounded-[2rem] shadow-2xl shadow-indigo-200 hover:bg-[#635BFF] hover:scale-105 transition-all flex items-center">
              Access Vault <ArrowRight className="ml-3 w-5 h-5" />
            </Link>
            <Link href="/check" className="px-10 py-5 bg-white/60 backdrop-blur-xl border border-white text-[#3E3B52] text-sm md:text-base font-black uppercase tracking-widest rounded-[2rem] hover:bg-white hover:shadow-xl hover:shadow-indigo-50 transition-all flex items-center">
              <Search className="mr-3 w-5 h-5 text-[#635BFF]" /> Public Scanner
            </Link>
          </div>
        </div>
      </div>

      {/* --- STATS SECTION --- */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 mt-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/40 bg-white/40 backdrop-blur-xl border border-white rounded-[3rem] p-10 shadow-xl shadow-indigo-50/50">
          <div className="p-4">
            <p className="text-5xl font-black text-[#3E3B52] mb-2">10M+</p>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#A09CB0]">Assets Secured</p>
          </div>
          <div className="p-4">
            <p className="text-5xl font-black text-[#635BFF] mb-2">99.9%</p>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#A09CB0]">AI Detection Rate</p>
          </div>
          <div className="p-4">
            <p className="text-5xl font-black text-[#3E3B52] mb-2">0-Day</p>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#A09CB0]">Forgery Alerts</p>
          </div>
        </div>
      </div>

      {/* --- FEATURES GRID --- */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 mt-40">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-[#3E3B52] tracking-tight mb-6">Military-Grade Forensics.</h2>
          <p className="text-lg text-[#8E8AAB] font-medium max-w-2xl mx-auto">Stop relying on metadata that can be stripped. Veris uses pixel-level mathematics to prove ownership and authenticity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Feature 1 */}
          <div className="bg-white/60 backdrop-blur-xl border border-white p-10 rounded-[3rem] shadow-xl shadow-indigo-50/50 hover:scale-[1.02] transition-transform">
            <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
              <Lock className="w-8 h-8 text-[#635BFF]" />
            </div>
            <h3 className="text-2xl font-black text-[#3E3B52] mb-4">Invisible Watermarking</h3>
            <p className="text-[#8E8AAB] font-medium leading-relaxed">
              Embed cryptographic IDs directly into the frequency domain (DWT-DCT) of your images. It survives cropping, compression, and color filtering without altering the visual image.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/60 backdrop-blur-xl border border-white p-10 rounded-[3rem] shadow-xl shadow-indigo-50/50 hover:scale-[1.02] transition-transform">
            <div className="bg-rose-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
              <Activity className="w-8 h-8 text-rose-500" />
            </div>
            <h3 className="text-2xl font-black text-[#3E3B52] mb-4">Deep Pixel Forensics</h3>
            <p className="text-[#8E8AAB] font-medium leading-relaxed">
              Detect Photoshop jobs instantly. Our Error Level Analysis (ELA) and Clone-Detection algorithms highlight spliced pixels and inconsistent compression ratios in seconds.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/60 backdrop-blur-xl border border-white p-10 rounded-[3rem] shadow-xl shadow-indigo-50/50 hover:scale-[1.02] transition-transform">
            <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
              <BrainCircuit className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-black text-[#3E3B52] mb-4">Neural AI Detection</h3>
            <p className="text-[#8E8AAB] font-medium leading-relaxed">
              Is it a real photograph or Stable Diffusion? Our Swin Transformer models analyze Laplacian noise variance to confidently identify synthetically generated media.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white/60 backdrop-blur-xl border border-white p-10 rounded-[3rem] shadow-xl shadow-indigo-50/50 hover:scale-[1.02] transition-transform">
            <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
              <Fingerprint className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-2xl font-black text-[#3E3B52] mb-4">Perceptual Fingerprinting</h3>
            <p className="text-[#8E8AAB] font-medium leading-relaxed">
              Generate robust pHash and dHash vectors for every asset. If a thief steals your photo and applies a heavy Instagram filter, our scanner still knows it belongs to you.
            </p>
          </div>

        </div>
      </div>

      {/* --- HOW IT WORKS / WORKFLOW --- */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 mt-40">
        <div className="bg-[#3E3B52] rounded-[4rem] p-12 md:p-20 shadow-2xl shadow-indigo-900/20 overflow-hidden relative">
          
          {/* Dark card background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#635BFF]/30 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="text-center mb-16 relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">The Veris Protocol</h2>
            <p className="text-[#A09CB0] font-medium max-w-xl mx-auto">Three steps to absolute digital provenance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/20 text-white font-black text-2xl">1</div>
              <h4 className="text-xl font-bold text-white mb-3">Initialize & Seal</h4>
              <p className="text-[#A09CB0] text-sm leading-relaxed">Upload your original asset. We generate its cryptographic hashes and invisibly embed your Organization ID into the pixels.</p>
            </div>
            
            <div className="hidden md:flex items-center justify-center text-white/20">
              <ChevronRight className="w-12 h-12" />
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-[#635BFF] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#635BFF]/50 text-white font-black text-2xl">2</div>
              <h4 className="text-xl font-bold text-white mb-3">Lock to Ledger</h4>
              <p className="text-[#A09CB0] text-sm leading-relaxed">The unalterable SHA-256 and Perceptual Hashes are saved to your secure organization vault, establishing the undeniable origin date.</p>
            </div>

            <div className="hidden md:flex items-center justify-center text-white/20">
              <ChevronRight className="w-12 h-12" />
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/20 text-white font-black text-2xl">3</div>
              <h4 className="text-xl font-bold text-white mb-3">Global Scanning</h4>
              <p className="text-[#A09CB0] text-sm leading-relaxed">Anyone can drop a suspected stolen image into the Public Scanner. We extract the hidden payload and verify it against your vault.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}