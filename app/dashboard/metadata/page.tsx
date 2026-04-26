"use client";

import { useState, useCallback } from 'react';
import { 
  FileText, 
  UploadCloud, 
  Flag, 
  Camera, 
  Settings, 
  Database, 
  AlertCircle,
  RefreshCcw,
  Loader2,
  Cpu
} from 'lucide-react';
import { clsx } from 'clsx';

// --- TS INTERFACES ---
interface MetadataState {
  camera: { make: string; model: string; lens: string };
  settings: { aperture: string; shutter: string; iso: string; focalLength: string };
  fileInfo: { size: string; dimensions: string; format: string; colorSpace: string };
  software: string;
  dateCreated: string;
  warnings: string[];
}

interface MetadataCardProps {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
}

export default function MetadataPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [metadata, setMetadata] = useState<MetadataState | null>(null);

  const extractData = async (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
        alert("Please upload a valid image file.");
        return;
    }
    setFile(selectedFile);
    setIsExtracting(true);
    setMetadata(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch('http://localhost:8000/api/metadata', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error("Forensic Engine Unreachable");
      const data = await res.json();
      setMetadata(data.metadata);
    } catch (error: unknown) {
      console.error(error);
      const msg = error instanceof Error ? error.message : "Unknown error";
      alert(`Extraction failed: ${msg}`);
      setFile(null);
    } finally {
      setIsExtracting(false);
    }
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length > 0) {
      extractData(e.dataTransfer.files[0]);
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32 antialiased">
      
      {/* --- HEADER --- */}
      <div className="border-b border-white/40 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-[#3E3B52] flex items-center tracking-tighter uppercase leading-none">
            <div className="bg-pink-500 p-3 rounded-2xl mr-5 shadow-xl shadow-pink-100 hidden sm:block">
              <FileText className="w-8 h-8 text-white" />
            </div>
            File Forensics
          </h1>
          <p className="text-[#8E8AAB] mt-4 text-sm md:text-lg font-medium max-w-2xl leading-relaxed">
            Parse internal EXIF directories, verify hardware provenance, and detect software manipulation signatures.
          </p>
        </div>
        <div className="bg-white/60 px-5 py-2 rounded-2xl border border-white self-start md:self-center shadow-sm">
            <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest flex items-center">
                <Cpu className="w-3 h-3 mr-2" /> Header Parser v2.0
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* --- LEFT: TARGET INPUT (Col 4) --- */}
        <div className="lg:col-span-4 bg-white/60 backdrop-blur-xl border border-white p-8 rounded-[3rem] shadow-2xl shadow-indigo-50/50 flex flex-col h-full min-h-[400px]">
          <h2 className="text-xl font-black text-[#3E3B52] tracking-tight uppercase mb-8">Target Asset</h2>
          
          {!file ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              className={clsx(
                "flex-1 border border-white rounded-[2.5rem] p-8 text-center transition-all duration-500 flex flex-col items-center justify-center bg-white/40 group",
                isDragging ? "bg-white scale-[1.02] border-pink-200" : "hover:bg-white/80"
              )}
            >
              <input 
                type="file" accept="image/*" className="hidden" id="metadata-upload"
                onChange={(e) => e.target.files && extractData(e.target.files[0])}
              />
              <div className="bg-white p-5 rounded-[1.5rem] shadow-sm mb-6 border border-pink-50 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8 text-pink-500" />
              </div>
              <p className="text-[#3E3B52] font-black tracking-tight text-xl uppercase mb-2">Drop Media</p>
              <p className="text-[10px] text-[#A09CB0] font-black uppercase tracking-widest mb-8">EXIF, IPTC, XMP Supported</p>
              
              <label htmlFor="metadata-upload" className="inline-block bg-[#3E3B52] text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.25em] hover:bg-pink-500 hover:scale-105 transition-all cursor-pointer shadow-xl shadow-pink-100">
                Browse Files
              </label>
            </div>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center border border-white rounded-[2.5rem] bg-white/80 p-10 text-center shadow-inner animate-in zoom-in duration-300">
               <div className="p-6 bg-white rounded-[2rem] shadow-sm mb-6">
                <FileText className={clsx("w-12 h-12", isExtracting ? "text-pink-500 animate-pulse" : "text-[#A09CB0]")} />
               </div>
               <p className="text-[#3E3B52] font-black text-sm mb-2 truncate w-full px-4">{file.name}</p>
               <p className="text-[10px] text-[#8E8AAB] font-black uppercase tracking-widest mb-10">{(file.size / 1024 / 1024).toFixed(2)} MB Payload</p>
               <button 
                  onClick={() => { setFile(null); setMetadata(null); }}
                  className="flex items-center space-x-2 px-8 py-4 bg-white border border-white hover:border-[#3E3B52] text-[#3E3B52] rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                >
                  <RefreshCcw className="w-3 h-3" /> <span>Switch Asset</span>
                </button>
            </div>
          )}
        </div>

        {/* --- RIGHT: DATA OUTPUT (Col 8) --- */}
        <div className="lg:col-span-8 glass-card border-white/80 p-8 md:p-12 rounded-[3rem] md:rounded-[4rem] shadow-2xl shadow-indigo-100/30 min-h-[500px] flex flex-col">
           <div className="flex items-center justify-between mb-10">
                <h2 className="text-xl md:text-2xl font-black text-[#3E3B52] tracking-tight uppercase">Extracted Ledger</h2>
                {metadata && (
                    <div className="bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100 flex items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></div>
                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Read Complete</span>
                    </div>
                )}
           </div>
           
           {!metadata && !isExtracting ? (
             <div className="flex-1 bg-white/20 rounded-[2.5rem] border-2 border-dashed border-[#A09CB0]/20 p-12 flex flex-col items-center justify-center text-center">
                <div className="bg-white p-6 rounded-full shadow-sm mb-6 border border-indigo-50">
                    <Database className="w-10 h-10 text-[#A09CB0] opacity-30" />
                </div>
                <p className="text-[#3E3B52] font-black text-lg tracking-tight uppercase">Ledger Standby</p>
                <p className="text-sm text-[#8E8AAB] mt-3 max-w-xs font-medium leading-relaxed uppercase tracking-wider">
                    Upload an asset to begin bitstream analysis of internal metadata directories.
                </p>
             </div>
           ) : isExtracting ? (
             <div className="flex-1 bg-white/40 rounded-[2.5rem] border border-white p-12 flex flex-col items-center justify-center shadow-inner">
               <Loader2 className="animate-spin h-12 w-12 text-pink-500 mb-6" />
               <p className="text-pink-500 font-black text-[10px] md:text-xs uppercase tracking-[0.3em] animate-pulse">Scanning Headers...</p>
             </div>
           ) : metadata ? (
             <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-700">
                
                <DataCard title="File Architecture" icon={FileText}>
                    <DataRow label="Dimensions" val={metadata.fileInfo?.dimensions} />
                    <DataRow label="Disk Size" val={metadata.fileInfo?.size} />
                    <DataRow label="Encoding" val={metadata.fileInfo?.format} />
                    <DataRow label="Color Space" val={metadata.fileInfo?.colorSpace} isLast />
                </DataCard>

                <DataCard title="Hardware Source" icon={Camera}>
                    <DataRow label="Manufacturer" val={metadata.camera?.make} />
                    <DataRow label="Unit Model" val={metadata.camera?.model} />
                    <DataRow label="Lens Profile" val={metadata.camera?.lens} isLast />
                </DataCard>

                <DataCard title="Capture Context" icon={Settings}>
                    <DataRow label="Aperture" val={metadata.settings?.aperture} />
                    <DataRow label="Shutter Speed" val={metadata.settings?.shutter} />
                    <DataRow label="ISO Sens." val={metadata.settings?.iso} />
                    <DataRow label="Seal Date" val={metadata.dateCreated} isLast />
                </DataCard>

                <DataCard title="Provenance Chain" icon={Flag}>
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-black text-[#A09CB0] uppercase tracking-widest mb-3">Software Signature</p>
                      {metadata.software !== "Unknown" ? (
                        <span className="inline-flex bg-pink-50 text-pink-600 px-4 py-2 rounded-xl text-xs font-black font-mono border border-pink-100 shadow-sm">{metadata.software}</span>
                      ) : (
                        <span className="inline-flex bg-slate-50 text-slate-400 px-4 py-2 rounded-xl text-xs font-black font-mono border border-slate-100 italic">No Modification Data</span>
                      )}
                    </div>
                    
                    {metadata.warnings?.length > 0 && (
                      <div className="pt-2">
                        <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-3">Security Alerts</p>
                        <div className="space-y-2">
                          {metadata.warnings.map((warning, i) => (
                            <div key={i} className="flex items-start bg-rose-50 text-rose-600 p-3 rounded-xl border border-rose-100">
                              <AlertCircle className="w-3.5 h-3.5 mr-2 flex-shrink-0 mt-0.5" />
                              <span className="text-[10px] font-black leading-tight uppercase tracking-tight">{warning}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </DataCard>

             </div>
           ) : null}
        </div>

      </div>
    </div>
  );
}

// --- TYPED SUB-COMPONENTS ---

function DataCard({ title, icon: Icon, children }: MetadataCardProps) {
    return (
        <div className="bg-white/60 border border-white rounded-[2.5rem] p-8 shadow-sm hover:bg-white transition-all duration-300">
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-[#A09CB0] mb-6 flex items-center">
                <Icon className="w-4 h-4 mr-3 text-pink-400" /> {title}
            </h3>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
}

function DataRow({ label, val, isLast = false }: { label: string, val: string, isLast?: boolean }) {
    return (
        <div className={clsx("flex justify-between items-center gap-4", !isLast && "border-b border-black/5 pb-4")}>
            <span className="text-[#8E8AAB] font-bold text-xs uppercase tracking-widest">{label}</span>
            <span className="text-[#3E3B52] font-black font-mono text-xs truncate max-w-[140px]" title={val}>{val || "---"}</span>
        </div>
    );
}