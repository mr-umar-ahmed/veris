"use client";

import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, Fingerprint, BrainCircuit, Activity, Lock, Search, ChevronRight } from 'lucide-react';
// --- ADD THIS IMPORT ---
import { clsx } from 'clsx'; 

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#E5E1E6] overflow-x-hidden selection:bg-[#635BFF] selection:text-white pb-32">
      
      {/* --- AMBIENT BACKGROUND BLOBS --- */}
      <div className="absolute top-[-5%] left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-orange-300/30 blur-[80px] md:blur-[120px] rounded-full animate-pulse pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[350px] md:w-[700px] h-[350px] md:h-[700px] bg-indigo-300/30 blur-[100px] md:blur-[150px] rounded-full animate-pulse pointer-events-none" style={{animationDelay: '-2s'}}></div>
      <div className="absolute bottom-[10%] left-[10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-rose-300/20 blur-[80px] md:blur-[120px] rounded-full animate-pulse pointer-events-none" style={{animationDelay: '-4s'}}></div>

      {/* --- HERO SECTION --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 md:pt-48 text-center">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-white text-[#635BFF] text-[10px] md:text-xs font-black uppercase tracking-widest mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 mr-2 text-orange-400" />
            Veris Enterprise Engine v1.0
          </div>

          <h1 className="text-5xl md:text-8xl lg:text-[10rem] font-black text-[#3E3B52] tracking-tighter mb-8 leading-[0.9] md:leading-[0.85]">
            Secure <span className="text-[#635BFF]">Media</span>.<br className="hidden md:block" />
            Detect Use.
          </h1>

          <p className="text-lg md:text-2xl text-[#8E8AAB] max-w-3xl mx-auto mb-12 md:mb-16 leading-relaxed font-medium px-4">
            The ultimate cryptographic command center. Authenticate digital assets, embed invisible ownership signatures, and flag misappropriation across the web.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 px-4">
            <Link href="/login" className="w-full sm:w-auto px-10 py-5 bg-[#3E3B52] text-white text-sm font-black uppercase tracking-widest rounded-[2rem] shadow-2xl shadow-indigo-200 hover:bg-[#635BFF] hover:scale-105 transition-all flex items-center justify-center">
              Access Vault <ArrowRight className="ml-3 w-5 h-5" />
            </Link>
            <Link href="/check" className="w-full sm:w-auto px-10 py-5 bg-white/60 backdrop-blur-xl border border-white text-[#3E3B52] text-sm font-black uppercase tracking-widest rounded-[2rem] hover:bg-white hover:shadow-xl hover:shadow-indigo-50 transition-all flex items-center justify-center">
              <Search className="mr-3 w-5 h-5 text-[#635BFF]" /> Public Scanner
            </Link>
          </div>
        </div>
      </div>

      {/* --- STATS SECTION --- */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 mt-24 md:mt-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/40 bg-white/40 backdrop-blur-xl border border-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 shadow-xl shadow-indigo-50/50">
          <div className="py-6 md:py-4">
            <p className="text-4xl md:text-5xl font-black text-[#3E3B52] mb-2">10M+</p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A09CB0]">Assets Secured</p>
          </div>
          <div className="py-6 md:py-4">
            <p className="text-4xl md:text-5xl font-black text-[#635BFF] mb-2">99.9%</p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A09CB0]">AI Detection Rate</p>
          </div>
          <div className="py-6 md:py-4">
            <p className="text-4xl md:text-5xl font-black text-[#3E3B52] mb-2">0-Day</p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A09CB0]">Forgery Alerts</p>
          </div>
        </div>
      </div>

      {/* --- FEATURES GRID --- */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 mt-32 md:mt-40">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-6xl font-black text-[#3E3B52] tracking-tight mb-6 px-2">Forensics at Pixel Scale.</h2>
          <p className="text-base md:text-lg text-[#8E8AAB] font-medium max-w-2xl mx-auto px-4">Stop relying on metadata that can be stripped. Veris uses pixel-level mathematics to prove ownership.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-white/60 backdrop-blur-xl border border-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-xl shadow-indigo-50/50 hover:scale-[1.01] md:hover:scale-[1.02] transition-transform">
              <div className={`${f.bg} w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-6 md:mb-8 shadow-inner`}>
                <f.icon className={`w-7 h-7 md:w-8 md:h-8 ${f.text}`} />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-[#3E3B52] mb-4">{f.title}</h3>
              <p className="text-sm md:text-base text-[#8E8AAB] font-medium leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* --- THE PROTOCOL (Workflow) --- */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 mt-32 md:mt-40">
        <div className="bg-[#3E3B52] rounded-[3rem] md:rounded-[4rem] p-10 md:p-20 shadow-2xl shadow-indigo-900/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-[#635BFF]/30 blur-[80px] md:blur-[100px] rounded-full pointer-events-none"></div>
          <div className="text-center mb-12 md:mb-16 relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">The Veris Protocol</h2>
            <p className="text-[#A09CB0] font-medium">Three steps to absolute digital provenance.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center relative z-10">
            <Step num="1" title="Initialize & Seal" desc="Upload original assets. We embed your ID into the pixels." />
            <div className="hidden md:flex justify-center text-white/20"><ChevronRight /></div>
            <Step num="2" title="Lock to Ledger" desc="Unalterable hashes are saved to your secure organization vault." active />
            <div className="hidden md:flex justify-center text-white/20"><ChevronRight /></div>
            <Step num="3" title="Global Scanning" desc="Public scanners verify extracted payloads against your vault." />
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({ num, title, desc, active = false }: { num: string, title: string, desc: string, active?: boolean }) {
  return (
    <div className="text-center flex flex-col items-center">
      <div className={clsx(
        "w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-6 font-black text-xl md:text-2xl",
        active ? "bg-[#635BFF] text-white shadow-lg shadow-[#635BFF]/50" : "bg-white/10 text-white border border-white/20"
      )}>{num}</div>
      <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
      <p className="text-[#A09CB0] text-xs md:text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

const features = [
  { title: "Invisible Watermarking", icon: Lock, bg: "bg-indigo-100", text: "text-[#635BFF]", desc: "Embed cryptographic IDs into the frequency domain (DWT-DCT). Survives cropping and compression." },
  { title: "Deep Pixel Forensics", icon: Activity, bg: "bg-rose-100", text: "text-rose-500", desc: "Our ELA algorithms highlight spliced pixels and inconsistent compression ratios in seconds." },
  { title: "Neural AI Detection", icon: BrainCircuit, bg: "bg-emerald-100", text: "text-emerald-500", desc: "Identify Stable Diffusion or Midjourney via Laplacian noise variance analysis." },
  { title: "Perceptual Fingerprinting", icon: Fingerprint, bg: "bg-orange-100", text: "text-orange-500", desc: "Generate robust pHash vectors. Track your assets even after heavy filtering." },
];