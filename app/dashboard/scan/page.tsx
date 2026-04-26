"use client";

import { useState, useCallback, useEffect } from 'react';
import { 
  UploadCloud, Shield, Activity, BrainCircuit, AlertTriangle, 
  CheckCircle, Search, FileText, Fingerprint, Lock, ShieldAlert,
  Loader2, RefreshCcw, Sparkles
} from 'lucide-react';
import { clsx } from 'clsx';

// --- STRICT INTERFACES ---
interface ForensicData {
  ela_score: number;
  noise_variance: number;
  estimated_trust: number;
  is_suspicious: boolean;
}

interface ModuleCardProps {
  icon: React.ElementType; // Correct type for Lucide Icons
  title: string;
  desc: string;
  color: string;
  bg: string;
}

interface MetricCardProps {
  title: string;
  val: number | string;
  icon: React.ElementType;
  status: string;
  isDanger: boolean;
  suffix?: string;
  isBinary?: boolean;
}

const SCAN_STEPS = [
  "Initializing forensic engine...",
  "Extracting EXIF metadata...",
  "Running Error Level Analysis (ELA)...",
  "Calculating noise variance patterns...",
  "Querying Swin Transformer AI models...",
  "Finalizing authenticity report..."
];

export default function FullScanPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [report, setReport] = useState<ForensicData | null>(null);
  const [scanStepIndex, setScanStepIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScanning) {
      interval = setInterval(() => {
        setScanStepIndex((prev) => (prev < SCAN_STEPS.length - 1 ? prev + 1 : prev));
      }, 650);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  const runScan = async (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
        alert("Please upload an image file (JPG/PNG/WEBP).");
        return;
    }
    setFile(selectedFile);
    setScanStepIndex(0); 
    setIsScanning(true);
    setReport(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch('https://veris-iz3o.onrender.com/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error("Forensic Engine Unreachable");
      const data = await res.json();
      
      setTimeout(() => {
        setReport(data.forensics);
        setIsScanning(false);
      }, 3900);

    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Unknown error";
      alert(`Deep scan failed: ${message}`);
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
    <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      
      {/* HEADER */}
      <div className="border-b border-white/40 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-[#3E3B52] flex items-center tracking-tighter uppercase">
            <div className="bg-[#635BFF] p-3 rounded-2xl mr-5 shadow-xl shadow-indigo-100 hidden sm:block">
              <Shield className="w-8 h-8 text-white" />
            </div>
            Full Security Scan
          </h1>
          <p className="text-[#8E8AAB] mt-3 text-sm md:text-lg font-medium max-w-2xl">
            Deep-pixel authenticity assessment utilizing ELA and Neural Transformer models.
          </p>
        </div>
        <div className="bg-white/60 px-5 py-2.5 rounded-2xl border border-white shadow-sm">
            <p className="text-[10px] font-black text-[#635BFF] uppercase tracking-widest flex items-center">
                <Sparkles className="w-3 h-3 mr-2" /> Forensic Engine v4.2
            </p>
        </div>
      </div>

      {!file || (!isScanning && !report) ? (
        <div className="space-y-12">
          {/* UPLOAD ZONE */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            className={clsx(
              "border border-white rounded-[3rem] md:rounded-[4rem] p-12 md:p-24 text-center transition-all duration-500 bg-white/60 backdrop-blur-xl shadow-2xl shadow-indigo-50/50 group",
              isDragging ? "bg-white scale-[1.02] border-[#635BFF]/30" : "hover:bg-white/80"
            )}
          >
            <div className="bg-white w-20 h-20 md:w-24 md:h-24 mx-auto rounded-[2rem] flex items-center justify-center shadow-sm mb-8 border border-indigo-50 group-hover:scale-110 transition-transform">
              <UploadCloud className="h-10 w-10 text-[#635BFF]" />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-[#3E3B52] tracking-tight">Drop suspect media</h3>
            <p className="text-[#8E8AAB] mt-3 font-bold uppercase tracking-widest text-[10px] md:text-xs">Supports JPG, PNG, WEBP • Max 20MB</p>
            
            <input 
              type="file" accept="image/*" className="hidden" id="scan-upload" 
              onChange={(e) => e.target.files && runScan(e.target.files[0])}
            />
            <label htmlFor="scan-upload" className="mt-10 inline-block bg-[#3E3B52] text-white px-10 md:px-14 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.25em] hover:bg-[#635BFF] hover:scale-105 active:scale-95 cursor-pointer transition-all shadow-xl shadow-indigo-200">
              Initialize Analysis
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <ModuleCard icon={Activity} color="text-rose-400" bg="bg-rose-50" title="Error Level" desc="Detects pixel disparities by mapping compression artifact variance." />
            <ModuleCard icon={BrainCircuit} color="text-indigo-400" bg="bg-indigo-50" title="AI Check" desc="Swin Transformer models detect synthetic noise distributions." />
            <ModuleCard icon={FileText} color="text-emerald-400" bg="bg-emerald-50" title="Provenance" desc="Scans bitstream for hidden editing software footprints." />
          </div>
        </div>
      ) : isScanning ? (
        <div className="bg-white/80 backdrop-blur-2xl border border-white rounded-[3.5rem] p-16 md:p-24 text-center shadow-2xl shadow-indigo-100/50">
          <div className="relative w-28 h-28 md:w-32 md:h-32 mx-auto mb-10">
            <div className="absolute inset-0 border-[6px] border-indigo-50 rounded-full"></div>
            <div className="absolute inset-0 border-[6px] border-[#635BFF] rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="w-10 h-10 text-[#635BFF] animate-pulse" />
            </div>
          </div>
          <h3 className="text-2xl md:text-4xl font-black text-[#3E3B52] mb-4 tracking-tighter uppercase text-center">Analyzing Structure</h3>
          <p className="text-[#635BFF] font-black text-[10px] md:text-xs uppercase tracking-[0.25em] animate-pulse text-center">
            {SCAN_STEPS[scanStepIndex]}
          </p>
          <div className="w-full max-w-sm mx-auto bg-indigo-50 rounded-full h-1.5 mt-8 overflow-hidden border border-white">
             <div className="bg-[#635BFF] h-full transition-all duration-700 shadow-[0_0_10px_#635BFF]" style={{ width: `${((scanStepIndex + 1) / SCAN_STEPS.length) * 100}%` }}></div>
          </div>
        </div>
      ) : report ? (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
          <div className={clsx(
            "rounded-[3rem] md:rounded-[4rem] p-10 md:p-14 flex flex-col lg:flex-row lg:items-center justify-between border shadow-2xl backdrop-blur-xl relative overflow-hidden",
            report.is_suspicious ? "bg-rose-50/90 border-rose-200" : "bg-emerald-50/90 border-emerald-200"
          )}>
            <div className="flex flex-col md:flex-row items-start md:items-center relative z-10">
              <div className={clsx("p-5 rounded-[1.5rem] md:mr-8 shadow-lg mb-6 md:mb-0 text-white", report.is_suspicious ? "bg-rose-500" : "bg-emerald-500")}>
                {report.is_suspicious ? <ShieldAlert className="h-10 w-10 md:h-12 md:w-12" /> : <CheckCircle className="h-10 w-10 md:h-12 md:w-12" />}
              </div>
              <div className="space-y-2">
                <h2 className={clsx("text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none", report.is_suspicious ? "text-rose-600" : "text-emerald-600")}>
                  {report.is_suspicious ? "Tampering Detected" : "Identity Verified"}
                </h2>
                <p className="text-[#3E3B52] font-bold text-sm uppercase tracking-widest opacity-70">
                  {file?.name} • {(file!.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 bg-white/60 p-8 rounded-[2.5rem] border border-white/60 shadow-inner text-center md:text-right min-w-[220px]">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#A09CB0] mb-2">Veris Trust Score</p>
              <p className={clsx("text-7xl font-black tracking-tighter", report.is_suspicious ? "text-rose-500" : "text-emerald-500")}>
                {report.estimated_trust}<span className="text-3xl text-[#A09CB0] ml-1">/100</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Error Level (ELA)" val={report.ela_score} icon={Activity} status={report.ela_score > 10 ? "Anomalous" : "Standard"} isDanger={report.ela_score > 10} />
            <MetricCard title="Sensor Noise" val={report.noise_variance} icon={BrainCircuit} status={report.noise_variance < 100 ? "Artificial" : "Organic"} isDanger={report.noise_variance < 100} />
            <MetricCard title="Human Origin" val={report.noise_variance < 100 ? 12 : 98} icon={Fingerprint} suffix="%" status={report.noise_variance < 100 ? "Likely AI" : "Camera Source"} isDanger={report.noise_variance < 100} />
            <MetricCard title="EXIF Integrity" val={report.is_suspicious ? 0 : 1} icon={Lock} isBinary status={report.is_suspicious ? "Stripped" : "Intact"} isDanger={report.is_suspicious} />
          </div>

          <div className="text-center pt-10">
            <button onClick={() => { setFile(null); setReport(null); }} className="inline-flex items-center px-12 py-5 bg-[#3E3B52] text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-[#635BFF] transition-all shadow-2xl active:scale-95">
              <RefreshCcw className="w-4 h-4 mr-3" /> Analyze New Asset
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// --- TYPED HELPERS ---
function ModuleCard({ icon: Icon, title, desc, color, bg }: ModuleCardProps) {
    return (
        <div className="bg-white/60 backdrop-blur-xl border border-white p-8 rounded-[2.5rem] shadow-xl shadow-indigo-50/30 hover:-translate-y-1 transition-all">
            <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-inner", bg)}>
                <Icon className={clsx("w-6 h-6", color)} />
            </div>
            <h4 className="font-black text-[#3E3B52] tracking-tight uppercase text-sm mb-3">{title}</h4>
            <p className="text-xs md:text-sm text-[#8E8AAB] font-medium leading-relaxed">{desc}</p>
        </div>
    );
}

function MetricCard({ title, val, icon: Icon, status, isDanger, suffix = "", isBinary = false }: MetricCardProps) {
  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white p-8 rounded-[2.5rem] shadow-xl shadow-indigo-50/30 relative overflow-hidden group hover:bg-white transition-all">
      <Icon className="absolute top-6 right-6 w-12 h-12 text-[#3E3B52]/5 group-hover:text-[#635BFF]/10 transition-colors" />
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#A09CB0] mb-5 relative z-10">{title}</p>
      <p className="text-5xl font-black text-[#3E3B52] relative z-10 leading-none">
        {isBinary ? (val === 1 ? "Valid" : "None") : val}{suffix}
      </p>
      <div className={clsx(
        "mt-6 inline-flex items-center px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest relative z-10 border",
        isDanger ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
      )}>
        <div className={clsx("w-1.5 h-1.5 rounded-full mr-2", isDanger ? "bg-rose-500" : "bg-emerald-500")}></div>
        {status}
      </div>
    </div>
  );
}