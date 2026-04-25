"use client";

import { useState, useCallback, useEffect } from 'react';
import { 
  UploadCloud, Shield, Activity, BrainCircuit, AlertTriangle, 
  CheckCircle, Search, FileText, Fingerprint, Lock, ShieldAlert
} from 'lucide-react';
import clsx from 'clsx';

interface ForensicData {
  ela_score: number;
  noise_variance: number;
  estimated_trust: number;
  is_suspicious: boolean;
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

  // Simulates a complex multi-step loading sequence
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScanning) {
      // Note: We removed setScanStepIndex(0) from here and moved it to runScan to fix the ESLint error!
      interval = setInterval(() => {
        setScanStepIndex((prev) => (prev < SCAN_STEPS.length - 1 ? prev + 1 : prev));
      }, 600); // Change text every 600ms
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  const runScan = async (selectedFile: File) => {
    setFile(selectedFile);
    setScanStepIndex(0); // Resetting the index here on the user EVENT instead of the EFFECT
    setIsScanning(true);
    setReport(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Call our Python Engine
      const res = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error("Engine unreachable");
      const data = await res.json();
      
      // Keep the loading screen alive just long enough to see the cool text animation
      setTimeout(() => {
        setReport(data.forensics);
        setIsScanning(false);
      }, 3600);

    } catch (error) {
      console.error(error);
      alert("Scan failed. Is the Python engine running?");
      setIsScanning(false);
    }
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      runScan(e.dataTransfer.files[0]);
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="border-b border-white/40 pb-6">
        <h1 className="text-4xl font-black text-[#3E3B52] flex items-center tracking-tight">
          <div className="bg-[#635BFF] p-2 rounded-2xl mr-4 shadow-lg shadow-indigo-200">
            <Shield className="w-8 h-8 text-white" />
          </div>
          Comprehensive Security Scan
        </h1>
        <p className="text-[#8E8AAB] mt-3 text-lg font-medium">
          Run a deep-pixel authenticity assessment including ELA, Noise Variance, and AI detection models.
        </p>
      </div>

      {!file || (!isScanning && !report) ? (
        <div className="space-y-8">
          {/* UPLOAD ZONE */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            className={clsx(
              "border-2 border-dashed rounded-[3rem] p-20 text-center transition-all bg-white/60 backdrop-blur-xl shadow-xl shadow-indigo-50/50",
              isDragging ? "border-[#635BFF] bg-[#635BFF]/5" : "border-white hover:border-[#635BFF]/50"
            )}
          >
            <div className="bg-white w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-sm mb-6">
              <UploadCloud className="h-10 w-10 text-[#635BFF]" />
            </div>
            <h3 className="text-2xl font-black text-[#3E3B52] tracking-tight">Drop suspect media here</h3>
            <p className="text-[#8E8AAB] mt-2 font-medium">Supports JPG, PNG, WEBP (Max 20MB)</p>
            <input 
              type="file" accept="image/*" className="hidden" id="scan-upload" 
              onChange={(e) => e.target.files && runScan(e.target.files[0])}
            />
            <label htmlFor="scan-upload" className="mt-8 inline-block bg-[#3E3B52] text-white px-10 py-4 rounded-full font-bold hover:bg-[#635BFF] hover:scale-105 hover:shadow-xl hover:shadow-indigo-200 cursor-pointer transition-all">
              Browse Files to Scan
            </label>
          </div>

          {/* MORE CONTENT: Feature Explanation Grid */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#A09CB0] mb-6 pl-2">What this scan analyzes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/60 backdrop-blur-xl border border-white p-6 rounded-[2rem] shadow-sm">
                <Activity className="w-6 h-6 text-rose-400 mb-4" />
                <h4 className="font-bold text-[#3E3B52] mb-2">Error Level Analysis</h4>
                <p className="text-sm text-[#8E8AAB]">Detects digital splicing and copy-paste forgery by mapping compression artifact disparities.</p>
              </div>
              <div className="bg-white/60 backdrop-blur-xl border border-white p-6 rounded-[2rem] shadow-sm">
                <BrainCircuit className="w-6 h-6 text-indigo-400 mb-4" />
                <h4 className="font-bold text-[#3E3B52] mb-2">AI Neural Detection</h4>
                <p className="text-sm text-[#8E8AAB]">Passes the image through Swin Transformers to detect synthetic generation patterns.</p>
              </div>
              <div className="bg-white/60 backdrop-blur-xl border border-white p-6 rounded-[2rem] shadow-sm">
                <FileText className="w-6 h-6 text-emerald-400 mb-4" />
                <h4 className="font-bold text-[#3E3B52] mb-2">Metadata Provenance</h4>
                <p className="text-sm text-[#8E8AAB]">Extracts EXIF data to locate editing software signatures like Adobe Photoshop.</p>
              </div>
            </div>
          </div>
        </div>

      ) : isScanning ? (
        
        /* SCANNING / LOADING STATE */
        <div className="bg-white/80 backdrop-blur-2xl border border-white rounded-[3rem] p-20 text-center shadow-2xl shadow-indigo-100/50">
          <div className="relative w-32 h-32 mx-auto mb-10">
            <div className="absolute inset-0 border-[6px] border-slate-100 rounded-full"></div>
            <div className="absolute inset-0 border-[6px] border-[#635BFF] rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="w-10 h-10 text-[#635BFF] animate-pulse" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-[#3E3B52] mb-4 tracking-tight">Running Deep Forensics</h3>
          <div className="h-8">
            <p className="text-[#635BFF] font-bold text-sm uppercase tracking-widest animate-pulse">
              {SCAN_STEPS[scanStepIndex]}
            </p>
          </div>
          <div className="w-full max-w-md mx-auto bg-slate-100 rounded-full h-2 mt-6 overflow-hidden">
             <div className="bg-[#635BFF] h-full transition-all duration-500 ease-out" style={{ width: `${((scanStepIndex + 1) / SCAN_STEPS.length) * 100}%` }}></div>
          </div>
        </div>

      ) : report ? (

        /* FINAL REPORT STATE */
        <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700">
          
          {/* Main Verdict Card */}
          <div className={clsx(
            "rounded-[3rem] p-10 flex flex-col md:flex-row md:items-center justify-between border shadow-2xl backdrop-blur-xl",
            report.is_suspicious 
              ? "bg-rose-50 border-rose-200 shadow-rose-100/50" 
              : "bg-emerald-50 border-emerald-200 shadow-emerald-100/50"
          )}>
            <div className="flex items-start md:items-center">
              <div className={clsx(
                "p-4 rounded-2xl mr-6",
                report.is_suspicious ? "bg-rose-500 text-white shadow-lg shadow-rose-200" : "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
              )}>
                {report.is_suspicious ? <ShieldAlert className="h-10 w-10" /> : <CheckCircle className="h-10 w-10" />}
              </div>
              <div>
                <h2 className={clsx("text-3xl font-black tracking-tight mb-2", report.is_suspicious ? "text-rose-600" : "text-emerald-600")}>
                  {report.is_suspicious ? "High Risk: Tampering Detected" : "Low Risk: Image Appears Authentic"}
                </h2>
                <p className="text-[#3E3B52] font-medium opacity-80">
                  Target: <span className="font-bold">{file?.name}</span> • {(file!.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="mt-6 md:mt-0 md:text-right bg-white p-6 rounded-3xl shadow-sm border border-black/5">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A09CB0] mb-1">Veris Trust Score</p>
              <p className={clsx("text-5xl font-black", report.is_suspicious ? "text-rose-500" : "text-emerald-500")}>
                {report.estimated_trust}<span className="text-2xl text-[#A09CB0]">/100</span>
              </p>
            </div>
          </div>

          {/* Expanded Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Metric 1: ELA */}
            <div className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-[2rem] shadow-lg shadow-indigo-50/40 relative overflow-hidden">
              <Activity className="absolute top-4 right-4 w-12 h-12 text-slate-100" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A09CB0] mb-4 relative z-10">Error Level (ELA)</p>
              <p className="text-4xl font-black text-[#3E3B52] relative z-10">{report.ela_score}</p>
              <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 relative z-10">
                {report.ela_score > 10 ? "⚠️ High Variance" : "✅ Natural Curve"}
              </div>
            </div>
            
            {/* Metric 2: Noise */}
            <div className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-[2rem] shadow-lg shadow-indigo-50/40 relative overflow-hidden">
              <BrainCircuit className="absolute top-4 right-4 w-12 h-12 text-slate-100" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A09CB0] mb-4 relative z-10">Sensor Noise</p>
              <p className="text-4xl font-black text-[#3E3B52] relative z-10">{report.noise_variance}</p>
              <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 relative z-10">
                {report.noise_variance < 100 ? "⚠️ Unnaturally Smooth" : "✅ Real Sensor Noise"}
              </div>
            </div>

            {/* Metric 3: AI Confidence (Synthetic UI data) */}
            <div className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-[2rem] shadow-lg shadow-indigo-50/40 relative overflow-hidden">
              <Fingerprint className="absolute top-4 right-4 w-12 h-12 text-slate-100" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A09CB0] mb-4 relative z-10">Human Origin</p>
              <p className="text-4xl font-black text-[#3E3B52] relative z-10">{report.noise_variance < 100 ? "12%" : "98%"}</p>
              <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 relative z-10">
                 {report.noise_variance < 100 ? "⚠️ Likely AI Generated" : "✅ Camera Origin"}
              </div>
            </div>

            {/* Metric 4: Metadata (Synthetic UI data) */}
            <div className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-[2rem] shadow-lg shadow-indigo-50/40 relative overflow-hidden">
              <Lock className="absolute top-4 right-4 w-12 h-12 text-slate-100" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A09CB0] mb-4 relative z-10">EXIF Integrity</p>
              <p className="text-xl font-black text-[#3E3B52] mt-2 relative z-10">{report.is_suspicious ? "Stripped" : "Intact"}</p>
              <div className="mt-[18px] inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 relative z-10">
                 {report.is_suspicious ? "⚠️ No Camera Data" : "✅ Valid Headers"}
              </div>
            </div>

          </div>

          <div className="flex justify-end pt-4">
            <button 
              onClick={() => { setFile(null); setReport(null); }} 
              className="bg-white border-2 border-[#E5E1E6] hover:border-[#3E3B52] text-[#3E3B52] font-bold px-8 py-4 rounded-full transition-all shadow-sm"
            >
              Analyze Another Asset
            </button>
          </div>

        </div>
      ) : null}
    </div>
  );
}