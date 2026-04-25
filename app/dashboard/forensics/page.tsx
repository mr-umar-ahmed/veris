"use client";

import { useState, useCallback } from 'react';
import { Search, Image as ImageIcon, Crosshair, Layers, UploadCloud, Activity, LucideIcon, AlertCircle, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

type TabType = 'ela' | 'noise' | 'clone';

interface TabConfig {
  id: TabType;
  label: string;
  icon: LucideIcon;
}

export default function ForensicsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('ela');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedTab, setAnalyzedTab] = useState<TabType | null>(null);

  const tabs: TabConfig[] = [
    { id: 'ela', label: 'Error Level Analysis', icon: Layers },
    { id: 'noise', label: 'Noise Pattern Variance', icon: Activity },
    { id: 'clone', label: 'Copy-Move Clone Detection', icon: Crosshair },
  ];

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setAnalyzedTab(null);
    
    // Simulate processing time
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzedTab(activeTab);
    }, 2000);
  };

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    if (analyzedTab !== tabId) {
      setAnalyzedTab(null); // Reset analysis state if switching to an un-run tab
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="border-b border-white/40 pb-6 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-[#3E3B52] flex items-center tracking-tight">
            <div className="bg-purple-500 p-2 rounded-2xl mr-4 shadow-lg shadow-purple-200">
              <Search className="w-8 h-8 text-white" />
            </div>
            Deep Image Forensics
          </h1>
          <p className="text-[#8E8AAB] mt-3 text-lg font-medium">
            Analyze pixel-level data to detect tampering, splicing, and digital manipulation.
          </p>
        </div>
      </div>

      {/* Forensic Tabs (Light Theme Pill Design) */}
      <div className="flex space-x-2 bg-white/40 p-2 rounded-full shadow-sm border border-white/60 w-fit overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={clsx(
              "flex items-center px-6 py-3 text-sm font-bold rounded-full transition-all whitespace-nowrap",
              activeTab === tab.id 
                ? "bg-white text-purple-600 shadow-sm" 
                : "text-[#8E8AAB] hover:text-[#3E3B52] hover:bg-white/50"
            )}
          >
            <tab.icon className="w-4 h-4 mr-2 flex-shrink-0" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Input */}
        <div className="lg:col-span-1 bg-white/60 backdrop-blur-xl border border-white rounded-[3rem] p-8 shadow-xl shadow-purple-50/50 flex flex-col h-fit">
          <h2 className="text-xl font-black text-[#3E3B52] mb-6">Target Media</h2>
          
          {!file ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  setFile(e.dataTransfer.files[0]);
                  setAnalyzedTab(null);
                }
              }}
              className={clsx(
                "border-2 border-dashed rounded-[2rem] p-8 text-center transition-all flex flex-col items-center justify-center bg-white/40",
                isDragging ? "border-purple-400 bg-purple-50" : "border-[#A09CB0]/30 hover:border-purple-400/50 cursor-pointer"
              )}
            >
              <input 
                type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer hidden" id="forensic-upload"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setFile(e.target.files[0]);
                    setAnalyzedTab(null);
                  }
                }}
              />
              <div className="bg-white p-3 rounded-full shadow-sm mb-4">
                <UploadCloud className="w-8 h-8 text-purple-500" />
              </div>
              <p className="text-[#3E3B52] font-black tracking-tight text-lg mb-1">Click or drag</p>
              <p className="text-xs text-[#A09CB0] font-medium mb-6">High-res images preferred</p>
              <label htmlFor="forensic-upload" className="inline-block bg-[#3E3B52] text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-purple-500 hover:scale-105 hover:shadow-lg hover:shadow-purple-200 cursor-pointer transition-all relative z-10">
                Select File
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white/80 p-4 rounded-[1.5rem] flex items-center border border-white shadow-sm">
                <div className="bg-purple-100 p-3 rounded-xl mr-4">
                  <ImageIcon className="w-6 h-6 text-purple-500" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-black text-[#3E3B52] truncate">{file.name}</p>
                  <p className="text-xs text-[#8E8AAB] font-medium mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              
              <button 
                onClick={() => { setFile(null); setAnalyzedTab(null); }} 
                className="w-full text-[10px] font-black uppercase tracking-[0.2em] text-[#8E8AAB] hover:text-rose-500 transition-colors"
              >
                Remove Image
              </button>

              <div className="pt-6 border-t border-black/5">
                <button 
                  onClick={handleRunAnalysis}
                  disabled={isAnalyzing}
                  className="w-full py-4 bg-purple-500 hover:bg-purple-400 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-xl shadow-purple-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center"
                >
                  {isAnalyzing ? (
                    <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div> Running...</>
                  ) : (
                    `Run ${tabs.find(t => t.id === activeTab)?.label}`
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Output/Heatmap Shell */}
        <div className="lg:col-span-2 bg-white/60 backdrop-blur-xl border border-white rounded-[3rem] p-8 shadow-xl shadow-indigo-50/50 min-h-[500px] flex flex-col">
          <h2 className="text-xl font-black text-[#3E3B52] mb-6 flex items-center">
            Forensic Workspace
          </h2>

          {!file ? (
            <div className="flex-1 bg-white/40 rounded-[2rem] border-2 border-dashed border-[#A09CB0]/20 flex flex-col items-center justify-center text-center p-8">
              <Crosshair className="w-16 h-16 text-[#A09CB0] mb-4 opacity-50" />
              <h3 className="text-[#3E3B52] font-black text-lg mb-2">Awaiting Target</h3>
              <p className="text-[#8E8AAB] text-sm max-w-md">
                Upload an image and run the selected analysis to generate heatmaps and manipulation reports.
              </p>
            </div>
          ) : isAnalyzing ? (
            <div className="flex-1 bg-white/40 rounded-[2rem] border border-white flex flex-col items-center justify-center shadow-inner">
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 border-4 border-purple-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
                <Crosshair className="absolute inset-0 m-auto w-8 h-8 text-purple-500 animate-pulse" />
              </div>
              <p className="text-purple-500 font-black text-sm uppercase tracking-widest animate-pulse">Computing Pixels...</p>
            </div>
          ) : analyzedTab === 'ela' ? (
            <div className="flex-1 animate-in fade-in zoom-in duration-500 flex flex-col">
               <div className="flex-1 bg-slate-900 rounded-[2rem] overflow-hidden relative shadow-inner mb-6 group flex items-center justify-center">
                 {/* Simulated Heatmap Visual */}
                 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-600/40 via-transparent to-transparent opacity-80 mix-blend-screen"></div>
                 <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-red-500/30 blur-2xl rounded-full"></div>
                 <ImageIcon className="w-12 h-12 text-white/20" />
                 <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                   <p className="text-white text-xs font-mono">Filter: ELA High-Pass</p>
                 </div>
               </div>
               <div className="bg-rose-50 border border-rose-100 p-6 rounded-[2rem] flex items-start shadow-sm">
                 <AlertCircle className="w-8 h-8 text-rose-500 mr-4 flex-shrink-0" />
                 <div>
                   <h3 className="text-rose-700 font-black text-lg tracking-tight mb-1">Inconsistent Compression Detected</h3>
                   <p className="text-rose-600/80 font-medium text-sm leading-relaxed">
                     The heatmap shows a bright cluster in the upper right quadrant. This indicates that region was saved at a different JPEG quality level than the rest of the image, strongly suggesting it was spliced in later.
                   </p>
                 </div>
               </div>
            </div>
          ) : analyzedTab === 'noise' ? (
            <div className="flex-1 animate-in fade-in zoom-in duration-500 flex flex-col">
               <div className="flex-1 bg-slate-900 rounded-[2rem] overflow-hidden relative shadow-inner mb-6 flex items-end p-8">
                 {/* Fixed: Replaced Math.random() with a pure sine-wave math function based on index */}
                 <div className="w-full h-32 flex items-end justify-between space-x-1 opacity-70">
                    {[...Array(40)].map((_, i) => {
                      const pseudoRandomHeight = Math.max(10, Math.abs(Math.sin(i * 12.34)) * 100);
                      return (
                        <div 
                          key={i} 
                          className="w-full bg-emerald-400/50 rounded-t-sm" 
                          style={{ height: `${pseudoRandomHeight}%` }}
                        ></div>
                      );
                    })}
                 </div>
                 <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                   <p className="text-white text-xs font-mono">Variance: Natural</p>
                 </div>
               </div>
               <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem] flex items-start shadow-sm">
                 <CheckCircle className="w-8 h-8 text-emerald-500 mr-4 flex-shrink-0" />
                 <div>
                   <h3 className="text-emerald-700 font-black text-lg tracking-tight mb-1">Natural Sensor Noise Verified</h3>
                   <p className="text-emerald-600/80 font-medium text-sm leading-relaxed">
                     The Laplacian noise variance across the image blocks is consistent and matches expected hardware sensor patterns. No unnatural smoothing (typical of AI generation) was detected.
                   </p>
                 </div>
               </div>
            </div>
          ) : analyzedTab === 'clone' ? (
            <div className="flex-1 animate-in fade-in zoom-in duration-500 flex flex-col">
               <div className="flex-1 bg-slate-900 rounded-[2rem] overflow-hidden relative shadow-inner mb-6 flex items-center justify-center">
                 {/* Simulated Clone visual */}
                 <ImageIcon className="w-12 h-12 text-white/20" />
                 <div className="absolute top-1/3 left-1/4 w-20 h-20 border-2 border-orange-500 bg-orange-500/20 rounded-lg"></div>
                 <div className="absolute bottom-1/3 right-1/3 w-20 h-20 border-2 border-orange-500 bg-orange-500/20 rounded-lg"></div>
                 <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <line x1="30%" y1="40%" x2="60%" y2="60%" stroke="#f97316" strokeWidth="2" strokeDasharray="4 4" />
                 </svg>
                 <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                   <p className="text-white text-xs font-mono">Matches: 1</p>
                 </div>
               </div>
               <div className="bg-orange-50 border border-orange-100 p-6 rounded-[2rem] flex items-start shadow-sm">
                 <AlertCircle className="w-8 h-8 text-orange-500 mr-4 flex-shrink-0" />
                 <div>
                   <h3 className="text-orange-700 font-black text-lg tracking-tight mb-1">Copy-Move Forgery Found</h3>
                   <p className="text-orange-600/80 font-medium text-sm leading-relaxed">
                     ORB feature matching identified two distinct regions in the image with mathematically identical pixel structures, indicating an object was cloned and moved within the same canvas.
                   </p>
                 </div>
               </div>
            </div>
          ) : (
            <div className="flex-1 bg-white/40 rounded-[2rem] border-2 border-dashed border-[#A09CB0]/20 flex flex-col items-center justify-center text-center p-8">
              <Crosshair className="w-16 h-16 text-[#A09CB0] mb-4 opacity-50" />
              <h3 className="text-[#3E3B52] font-black text-lg mb-2">Ready for Analysis</h3>
              <p className="text-[#8E8AAB] text-sm max-w-md">
                Click the Run button on the left to process the image using the selected forensic filter.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}