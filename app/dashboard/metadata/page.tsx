"use client";

import { useState, useCallback } from 'react';
import { FileText, UploadCloud, Flag, Camera, Settings, Database, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface MetadataState {
  camera: { make: string; model: string; lens: string };
  settings: { aperture: string; shutter: string; iso: string; focalLength: string };
  fileInfo: { size: string; dimensions: string; format: string; colorSpace: string };
  software: string;
  dateCreated: string;
  warnings: string[];
}

export default function MetadataPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [metadata, setMetadata] = useState<MetadataState | null>(null);

  const extractData = async (selectedFile: File) => {
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

      if (!res.ok) throw new Error("Engine unreachable");
      const data = await res.json();
      setMetadata(data.metadata);
    } catch (error) {
      console.error(error);
      alert("Failed to extract metadata. Is Python running?");
    } finally {
      setIsExtracting(false);
    }
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      extractData(e.dataTransfer.files[0]);
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="border-b border-white/40 pb-6">
        <h1 className="text-4xl font-black text-[#3E3B52] flex items-center tracking-tight">
          <div className="bg-pink-500 p-2 rounded-2xl mr-4 shadow-lg shadow-pink-200">
            <FileText className="w-8 h-8 text-white" />
          </div>
          Metadata Forensics
        </h1>
        <p className="text-[#8E8AAB] mt-3 text-lg font-medium">
          Extract EXIF data, verify provenance, and detect editing software footprints.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Input */}
        <div className="lg:col-span-1 bg-white/60 backdrop-blur-xl border border-white p-8 rounded-[3rem] shadow-xl shadow-indigo-50/50 flex flex-col">
          <h2 className="text-xl font-black text-[#3E3B52] mb-6">Target File</h2>
          
          {!file ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              className={clsx(
                "flex-1 border-2 border-dashed rounded-[2rem] p-8 text-center transition-all flex flex-col items-center justify-center bg-white/40",
                isDragging ? "border-pink-400 bg-pink-50" : "border-[#A09CB0]/30 hover:border-pink-400/50 cursor-pointer"
              )}
            >
              <input 
                type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer hidden" id="metadata-upload"
                onChange={(e) => e.target.files && extractData(e.target.files[0])}
              />
              <div className="bg-white p-3 rounded-full shadow-sm mb-4">
                <UploadCloud className="w-8 h-8 text-pink-500" />
              </div>
              <p className="text-[#3E3B52] font-black tracking-tight text-lg mb-1">Drop media</p>
              <p className="text-xs text-[#A09CB0] font-medium mb-6">JPG, PNG, WEBP</p>
              <label htmlFor="metadata-upload" className="inline-block bg-[#3E3B52] text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-pink-500 hover:scale-105 hover:shadow-lg hover:shadow-pink-200 cursor-pointer transition-all relative z-10">
                Browse
              </label>
            </div>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center border border-white rounded-[2rem] bg-white/50 p-6 text-center shadow-sm">
               <FileText className={clsx("w-16 h-16 mb-4", isExtracting ? "text-pink-500 animate-pulse" : "text-[#A09CB0]")} />
               <p className="text-[#3E3B52] font-black text-sm mb-1 truncate w-full px-2">{file.name}</p>
               <p className="text-xs text-[#8E8AAB] font-medium mb-6">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
               <button 
                  onClick={() => { setFile(null); setMetadata(null); }}
                  className="px-6 py-3 bg-white border-2 border-[#E5E1E6] hover:border-[#3E3B52] text-[#3E3B52] rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-sm"
                >
                  Change File
                </button>
            </div>
          )}
        </div>

        {/* Right Output */}
        <div className="lg:col-span-2 bg-white/60 backdrop-blur-xl border border-white p-8 rounded-[3rem] shadow-xl shadow-indigo-50/50 flex flex-col min-h-[500px]">
           <h2 className="text-xl font-black text-[#3E3B52] mb-6 flex items-center">
             Extracted Properties
           </h2>
           
           {!metadata && !isExtracting ? (
             <div className="flex-1 bg-white/40 rounded-[2rem] border-2 border-dashed border-[#A09CB0]/20 p-6 flex flex-col items-center justify-center text-center">
                <Database className="w-12 h-12 text-[#A09CB0] mb-4 opacity-50" />
                <p className="text-[#8E8AAB] font-bold">Awaiting file input...</p>
                <p className="text-[#A09CB0] text-sm mt-2">Upload an image to parse its internal EXIF directories.</p>
             </div>
           ) : isExtracting ? (
             <div className="flex-1 bg-white/40 rounded-[2rem] border border-white p-6 flex flex-col items-center justify-center shadow-inner">
               <div className="animate-spin rounded-full h-10 w-10 border-[4px] border-[#E5E1E6] border-t-pink-500 mb-6"></div>
               <p className="text-pink-500 font-black text-sm uppercase tracking-widest animate-pulse">Parsing Headers...</p>
             </div>
           ) : metadata ? (
             <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* File Info */}
                <div className="bg-white/80 border border-white rounded-[2rem] p-6 shadow-sm">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-[#A09CB0] mb-4 flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-pink-400" /> File Architecture
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center border-b border-black/5 pb-2"><span className="text-[#8E8AAB] font-medium">Dimensions</span><span className="text-[#3E3B52] font-bold font-mono">{metadata.fileInfo?.dimensions}</span></div>
                    <div className="flex justify-between items-center border-b border-black/5 pb-2"><span className="text-[#8E8AAB] font-medium">File Size</span><span className="text-[#3E3B52] font-bold font-mono">{metadata.fileInfo?.size}</span></div>
                    <div className="flex justify-between items-center border-b border-black/5 pb-2"><span className="text-[#8E8AAB] font-medium">Format</span><span className="text-[#3E3B52] font-bold font-mono">{metadata.fileInfo?.format}</span></div>
                    <div className="flex justify-between items-center"><span className="text-[#8E8AAB] font-medium">Color Space</span><span className="text-[#3E3B52] font-bold font-mono">{metadata.fileInfo?.colorSpace}</span></div>
                  </div>
                </div>

                {/* Camera Hardware */}
                <div className="bg-white/80 border border-white rounded-[2rem] p-6 shadow-sm">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-[#A09CB0] mb-4 flex items-center">
                    <Camera className="w-4 h-4 mr-2 text-pink-400" /> Hardware Source
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center border-b border-black/5 pb-2"><span className="text-[#8E8AAB] font-medium">Make</span><span className="text-[#3E3B52] font-bold font-mono">{metadata.camera?.make}</span></div>
                    <div className="flex justify-between items-center border-b border-black/5 pb-2"><span className="text-[#8E8AAB] font-medium">Model</span><span className="text-[#3E3B52] font-bold font-mono">{metadata.camera?.model}</span></div>
                    <div className="flex justify-between items-center"><span className="text-[#8E8AAB] font-medium">Lens</span><span className="text-[#3E3B52] font-bold font-mono truncate ml-4" title={metadata.camera?.lens}>{metadata.camera?.lens}</span></div>
                  </div>
                </div>

                {/* Capture Settings */}
                <div className="bg-white/80 border border-white rounded-[2rem] p-6 shadow-sm">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-[#A09CB0] mb-4 flex items-center">
                    <Settings className="w-4 h-4 mr-2 text-pink-400" /> Capture Parameters
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center border-b border-black/5 pb-2"><span className="text-[#8E8AAB] font-medium">Aperture</span><span className="text-[#3E3B52] font-bold font-mono">{metadata.settings?.aperture}</span></div>
                    <div className="flex justify-between items-center border-b border-black/5 pb-2"><span className="text-[#8E8AAB] font-medium">Shutter</span><span className="text-[#3E3B52] font-bold font-mono">{metadata.settings?.shutter}</span></div>
                    <div className="flex justify-between items-center border-b border-black/5 pb-2"><span className="text-[#8E8AAB] font-medium">ISO</span><span className="text-[#3E3B52] font-bold font-mono">{metadata.settings?.iso}</span></div>
                    <div className="flex justify-between items-center"><span className="text-[#8E8AAB] font-medium">Created</span><span className="text-[#3E3B52] font-bold font-mono text-xs">{metadata.dateCreated}</span></div>
                  </div>
                </div>

                {/* Provenance & Warnings */}
                <div className="bg-white/80 border border-white rounded-[2rem] p-6 shadow-sm">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-[#A09CB0] mb-4 flex items-center">
                    <Flag className="w-4 h-4 mr-2 text-pink-400" /> Provenance & History
                  </h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <span className="text-[#8E8AAB] font-medium block mb-2">Software Signature:</span>
                      {metadata.software !== "Unknown" ? (
                        <span className="inline-block bg-pink-100 text-pink-600 px-3 py-1.5 rounded-full text-xs font-bold font-mono border border-pink-200">{metadata.software}</span>
                      ) : (
                        <span className="inline-block bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full text-xs font-bold font-mono border border-slate-200">No Signature</span>
                      )}
                    </div>
                    
                    {metadata.warnings && metadata.warnings.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {metadata.warnings.map((warning: string, i: number) => (
                          <div key={i} className="flex items-start bg-orange-50 text-orange-600 p-3 rounded-xl border border-orange-100">
                            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-xs font-bold leading-relaxed">{warning}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

             </div>
           ) : null}
        </div>

      </div>
    </div>
  );
}