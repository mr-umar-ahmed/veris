"use client";

import { useState, useCallback } from 'react';
import { Key, UploadCloud, Fingerprint, Search, Copy, Check } from 'lucide-react';
import clsx from 'clsx';

export default function FingerprintingPage() {
  const [activeTab, setActiveTab] = useState<'generate' | 'compare'>('generate');
  const [file, setFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  
  const [hashes, setHashes] = useState<{ [key: string]: string } | null>(null);

  const generateHashes = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsGenerating(true);
    setHashes(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch('http://localhost:8000/api/fingerprint', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error("Engine unreachable");
      const data = await res.json();
      setHashes(data.hashes);
    } catch (error) {
      console.error(error);
      alert("Failed to generate fingerprints. Is Python running?");
    } finally {
      setIsGenerating(false);
    }
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      generateHashes(e.dataTransfer.files[0]);
    }
  }, []);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(type);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="border-b border-white/40 pb-6 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-[#3E3B52] flex items-center tracking-tight">
            <div className="bg-orange-500 p-2 rounded-2xl mr-4 shadow-lg shadow-orange-200">
              <Key className="w-8 h-8 text-white" />
            </div>
            Content Fingerprinting
          </h1>
          <p className="text-[#8E8AAB] mt-3 text-lg font-medium">
            Generate unique perceptual hashes or compare two images to detect unauthorized derivatives.
          </p>
        </div>
      </div>

      {/* Tabs (Light Theme Pill Design) */}
      <div className="flex space-x-2 bg-white/40 p-2 rounded-full shadow-sm border border-white/60 w-fit overflow-x-auto">
        <button
          onClick={() => { setActiveTab('generate'); setFile(null); setHashes(null); }}
          className={clsx(
            "flex items-center px-6 py-3 text-sm font-bold rounded-full transition-all whitespace-nowrap",
            activeTab === 'generate' ? "bg-white text-orange-500 shadow-sm" : "text-[#8E8AAB] hover:text-[#3E3B52] hover:bg-white/50"
          )}
        >
          <Fingerprint className="w-4 h-4 mr-2 flex-shrink-0" /> Generate Fingerprint
        </button>
        <button
          onClick={() => { setActiveTab('compare'); setFile(null); setHashes(null); }}
          className={clsx(
            "flex items-center px-6 py-3 text-sm font-bold rounded-full transition-all whitespace-nowrap",
            activeTab === 'compare' ? "bg-white text-orange-500 shadow-sm" : "text-[#8E8AAB] hover:text-[#3E3B52] hover:bg-white/50"
          )}
        >
          <Search className="w-4 h-4 mr-2 flex-shrink-0" /> Compare Images
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Upload Region */}
        <div className="bg-white/60 backdrop-blur-xl border border-white p-8 rounded-[3rem] shadow-xl shadow-orange-50/50 flex flex-col h-fit">
          <h2 className="text-xl font-black text-[#3E3B52] mb-6">
            {activeTab === 'generate' ? 'Source Media' : 'Upload Primary Image'}
          </h2>
          
          {!file ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              className={clsx(
                "flex-1 border-2 border-dashed rounded-[2rem] p-12 text-center transition-all flex flex-col items-center justify-center bg-white/40",
                isDragging ? "border-orange-400 bg-orange-50" : "border-[#A09CB0]/30 hover:border-orange-400/50 cursor-pointer"
              )}
            >
              <input 
                type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer hidden" id="fingerprint-upload"
                onChange={(e) => e.target.files && generateHashes(e.target.files[0])}
              />
              <div className="bg-white p-3 rounded-full shadow-sm mb-4">
                <UploadCloud className="w-8 h-8 text-orange-500" />
              </div>
              <p className="text-[#3E3B52] font-black tracking-tight text-lg mb-1">Drag & drop image here</p>
              <label htmlFor="fingerprint-upload" className="mt-6 inline-block bg-[#3E3B52] text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-orange-500 hover:scale-105 hover:shadow-lg hover:shadow-orange-200 cursor-pointer transition-all relative z-10">
                Browse Files
              </label>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center border border-white rounded-[2rem] bg-white/50 p-8 text-center shadow-sm">
               <Fingerprint className={clsx("w-16 h-16 mb-4", isGenerating ? "text-orange-500 animate-pulse" : "text-[#A09CB0]")} />
               <p className="text-[#3E3B52] font-black mb-1 truncate w-full px-4">{file.name}</p>
               <p className="text-xs text-[#8E8AAB] font-medium mb-6">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
               <button 
                  onClick={() => { setFile(null); setHashes(null); }}
                  className="px-6 py-3 bg-white border-2 border-[#E5E1E6] hover:border-[#3E3B52] text-[#3E3B52] rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-sm"
                >
                  Clear Image
                </button>
            </div>
          )}
        </div>

        {/* Output Region */}
        <div className="bg-white/60 backdrop-blur-xl border border-white p-8 rounded-[3rem] shadow-xl shadow-orange-50/50 flex flex-col min-h-[500px]">
           <h2 className="text-xl font-black text-[#3E3B52] mb-6">Generated Fingerprints</h2>
           
           {!hashes && !isGenerating ? (
             <div className="flex-1 bg-white/40 rounded-[2rem] border-2 border-dashed border-[#A09CB0]/20 flex flex-col items-center justify-center text-center p-8">
               <Key className="w-16 h-16 text-[#A09CB0] mb-4 opacity-50" />
               <p className="text-[#8E8AAB] font-bold max-w-xs">Upload an image to extract its unique perceptual and cryptographic signatures.</p>
             </div>
           ) : isGenerating ? (
             <div className="flex-1 bg-white/40 rounded-[2rem] border border-white flex flex-col items-center justify-center shadow-inner p-8">
               <div className="animate-spin rounded-full h-12 w-12 border-[4px] border-[#E5E1E6] border-t-orange-500 mb-6"></div>
               <p className="text-orange-500 font-black text-sm uppercase tracking-widest animate-pulse">Extracting Vectors...</p>
             </div>
           ) : hashes ? (
             <div className="flex-1 space-y-6">
                
                {/* Perceptual Hashes (Robust to edits) */}
                <div className="bg-white/80 border border-white rounded-[2rem] p-6 shadow-sm">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-[#A09CB0] mb-4 flex items-center">
                    <Fingerprint className="w-4 h-4 mr-2 text-orange-400" /> Perceptual Identifiers
                  </h3>
                  
                  <div className="space-y-3">
                    {['pHash', 'dHash', 'aHash'].map((type) => (
                      <div key={type} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white border border-[#E5E1E6] rounded-2xl shadow-sm">
                        <span className="text-xs font-bold text-[#8E8AAB] uppercase tracking-wider mb-2 sm:mb-0 w-16">{type}</span>
                        <code className="font-mono text-orange-600 bg-orange-50 px-3 py-2 rounded-xl break-all flex-1 sm:ml-4 sm:mr-4 text-xs sm:text-sm text-center border border-orange-100">
                          {hashes[type]}
                        </code>
                        <button 
                          onClick={() => copyToClipboard(hashes[type], type)}
                          className="mt-2 sm:mt-0 p-2 text-[#8E8AAB] hover:text-[#3E3B52] bg-white border border-[#E5E1E6] hover:border-[#3E3B52] rounded-xl transition-colors self-end sm:self-auto shadow-sm"
                        >
                          {copiedHash === type ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cryptographic Hash (Fragile to edits) */}
                <div className="bg-white/80 border border-white rounded-[2rem] p-6 shadow-sm mt-6">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-[#A09CB0] mb-4 flex items-center">
                    <Key className="w-4 h-4 mr-2 text-[#635BFF]" /> Cryptographic Integrity (SHA-256)
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white border border-[#E5E1E6] rounded-2xl shadow-sm">
                    <code className="font-mono text-[#635BFF] bg-indigo-50 px-3 py-2 rounded-xl break-all text-xs flex-1 sm:mr-4 border border-indigo-100 text-center sm:text-left">
                      {hashes.sha256}
                    </code>
                    <button 
                      onClick={() => copyToClipboard(hashes.sha256, 'sha256')}
                      className="mt-2 sm:mt-0 p-2 text-[#8E8AAB] hover:text-[#3E3B52] bg-white border border-[#E5E1E6] hover:border-[#3E3B52] rounded-xl transition-colors self-end sm:self-auto shadow-sm"
                    >
                      {copiedHash === 'sha256' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-[#A09CB0] font-medium mt-4 leading-relaxed">
                    Used for exact 1:1 file verification. Any pixel alteration changes this hash completely.
                  </p>
                </div>

             </div>
           ) : null}
        </div>

      </div>
    </div>
  );
}