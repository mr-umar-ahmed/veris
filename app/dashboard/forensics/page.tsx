"use client";

import { useState, useCallback } from 'react';
import { 
  Search, 
  Image as ImageIcon, 
  Crosshair, 
  Layers, 
  UploadCloud, 
  Activity, 
  AlertCircle, 
  CheckCircle,
  RefreshCcw,
  Zap,
  Loader2
} from 'lucide-react';
import { clsx } from 'clsx';

// --- TS Types & Interfaces ---
type TabType = 'ela' | 'noise' | 'clone';

interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ElementType;
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
    if (!file) return;
    setIsAnalyzing(true);
    setAnalyzedTab(null);
    
    // Simulate complex forensic processing
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzedTab(activeTab);
    }, 2400);
  };

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    if (analyzedTab !== tabId) {
      setAnalyzedTab(null);
    }
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setAnalyzedTab(null);
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      
      {/* --- HEADER --- */}
      <div className="border-b border-white/40 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-[#3E3B52] flex items-center tracking-tighter uppercase leading-none">
            <div className="bg-purple-500 p-3 rounded-2xl mr-5 shadow-xl shadow-purple-100 hidden sm:block">
              <Search className="w-8 h-8 text-white" />
            </div>
            Pixel Forensics
          </h1>
          <p className="text-[#8E8AAB] mt-4 text-sm md:text-lg font-medium max-w-2xl leading-relaxed">
            Execute deep-pixel scrutiny to isolate manipulation markers, compression artifacts, and generative neural noise.
          </p>
        </div>
      </div>

      {/* --- WORKSPACE NAVIGATION --- */}
      <div className="flex items-center space-x-3 bg-white/40 p-2 rounded-[2rem] border border-white/60 w-fit backdrop-blur-md shadow-sm overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={clsx(
              "flex items-center px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-full transition-all whitespace-nowrap",
              activeTab === tab.id 
                ? "bg-white text-purple-600 shadow-md scale-105" 
                : "text-[#8E8AAB] hover:text-[#3E3B52] hover:bg-white/50"
            )}
          >
            <tab.icon className="w-4 h-4 mr-2 flex-shrink-0" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- MAIN WORKSPACE GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: INPUT SIDEBAR (Col 4) */}
        <div className="lg:col-span-4 bg-white/60 backdrop-blur-xl border border-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl shadow-indigo-50/50 flex flex-col h-fit">
          <h2 className="text-xl font-black text-[#3E3B52] tracking-tight uppercase mb-8">Forensic Target</h2>
          
          {!file ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              className={clsx(
                "border border-white rounded-[2.5rem] p-10 text-center transition-all duration-500 flex flex-col items-center justify-center bg-white/40 group",
                isDragging ? "bg-white scale-[1.02] border-purple-200" : "hover:bg-white/80"
              )}
            >
              <input 
                type="file" accept="image/*" className="hidden" id="forensic-upload"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFile(e.target.files[0]);
                    setAnalyzedTab(null);
                  }
                }}
              />
              <div className="bg-white p-5 rounded-[1.5rem] shadow-sm mb-6 border border-purple-50 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8 text-purple-500" />
              </div>
              <p className="text-[#3E3B52] font-black tracking-tight text-xl uppercase mb-2">Drop Media</p>
              <p className="text-[10px] text-[#A09CB0] font-black uppercase tracking-widest mb-10">High-Fidelity Scans</p>
              
              <label htmlFor="forensic-upload" className="inline-block bg-[#3E3B52] text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.25em] hover:bg-purple-500 hover:scale-105 transition-all cursor-pointer shadow-xl shadow-purple-100">
                Browse Files
              </label>
            </div>
          ) : (
            <div className="space-y-8 animate-in zoom-in duration-300">
              <div className="bg-white/80 p-5 rounded-[2rem] flex items-center border border-white shadow-inner">
                <div className="bg-purple-100 p-4 rounded-2xl mr-4 shadow-sm">
                  <ImageIcon className="w-6 h-6 text-purple-500" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-black text-[#3E3B52] truncate">{file.name}</p>
                  <p className="text-[10px] font-black text-[#8E8AAB] uppercase tracking-widest mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              
              <button 
                onClick={() => { setFile(null); setAnalyzedTab(null); }} 
                className="w-full text-[10px] font-black uppercase tracking-[0.3em] text-[#A09CB0] hover:text-rose-500 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCcw className="w-3 h-3" /> Clear Session
              </button>

              <div className="pt-6 border-t border-black/5">
                <button 
                  onClick={handleRunAnalysis}
                  disabled={isAnalyzing}
                  className="w-full py-5 bg-[#3E3B52] hover:bg-purple-500 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-2xl shadow-purple-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center"
                >
                  {isAnalyzing ? (
                    <><Loader2 className="animate-spin h-4 w-4 mr-3" /> Computing...</>
                  ) : (
                    <><Zap className="w-4 h-4 mr-3 text-purple-300" /> Execute Filter</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: WORKSPACE AREA (Col 8) */}
        <div className="lg:col-span-8 glass-card border-white/80 p-8 md:p-12 rounded-[3rem] md:rounded-[4rem] shadow-2xl shadow-indigo-100/30 min-h-[550px] flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl md:text-2xl font-black text-[#3E3B52] tracking-tight uppercase">Forensic Workspace</h2>
            {analyzedTab && (
                 <div className="bg-white px-4 py-2 rounded-xl border border-indigo-50 shadow-sm flex items-center">
                    <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Active Scan: {analyzedTab.toUpperCase()}</span>
                 </div>
            )}
          </div>

          {!file ? (
            <div className="flex-1 bg-white/20 rounded-[2.5rem] border-2 border-dashed border-[#A09CB0]/20 flex flex-col items-center justify-center text-center p-12">
              <Crosshair className="w-12 h-12 text-[#A09CB0] mb-6 opacity-30" />
              <h3 className="text-[#3E3B52] font-black text-lg uppercase tracking-tight">System Standby</h3>
              <p className="text-[#8E8AAB] text-sm mt-3 max-w-sm font-medium leading-relaxed uppercase tracking-wider">
                Awaiting asset ingestion. Select a media file and forensic filter to begin analysis.
              </p>
            </div>
          ) : isAnalyzing ? (
            <div className="flex-1 bg-white/40 rounded-[2.5rem] border border-white flex flex-col items-center justify-center shadow-inner">
              <div className="relative w-28 h-28 mb-10">
                <div className="absolute inset-0 border-[6px] border-purple-50 rounded-full"></div>
                <div className="absolute inset-0 border-[6px] border-purple-500 rounded-full border-t-transparent animate-spin"></div>
                <Crosshair className="absolute inset-0 m-auto w-10 h-10 text-purple-500 animate-pulse" />
              </div>
              <p className="text-purple-500 font-black text-[10px] md:text-xs uppercase tracking-[0.3em] animate-pulse">Scanning Bitstream...</p>
            </div>
          ) : analyzedTab ? (
            <div className="flex-1 animate-in fade-in zoom-in duration-700 flex flex-col">
                {/* Simulated Heatmap Display */}
                <div className="flex-1 bg-slate-900 rounded-[2.5rem] overflow-hidden relative shadow-2xl mb-8 flex items-center justify-center group border-[8px] border-white">
                  
                  {analyzedTab === 'ela' && (
                      <div className="absolute inset-0">
                         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-600/30 via-transparent to-transparent animate-pulse opacity-70"></div>
                         <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-red-500/20 blur-3xl rounded-full"></div>
                         <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full"></div>
                      </div>
                  )}

                  {analyzedTab === 'noise' && (
                      <div className="w-full h-full flex items-end justify-between px-10 pb-16 pt-20 space-x-1.5 opacity-60">
                         {[...Array(45)].map((_, i) => {
                            const pseudoHeight = Math.max(15, Math.abs(Math.sin(i * 0.8)) * 100);
                            return (
                                <div key={i} className="w-full bg-emerald-400 rounded-t-sm transition-all duration-1000" style={{ height: `${pseudoHeight}%` }}></div>
                            );
                         })}
                      </div>
                  )}

                  {analyzedTab === 'clone' && (
                      <div className="absolute inset-0">
                         <div className="absolute top-1/4 left-1/4 w-24 h-24 border-2 border-orange-500 bg-orange-500/10 rounded-2xl shadow-[0_0_20px_rgba(249,115,22,0.3)]"></div>
                         <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border-2 border-orange-500 bg-orange-500/10 rounded-2xl shadow-[0_0_20px_rgba(249,115,22,0.3)]"></div>
                         <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                             <line x1="30%" y1="30%" x2="70%" y2="70%" stroke="#f97316" strokeWidth="2" strokeDasharray="8 8" />
                         </svg>
                      </div>
                  )}

                  <ImageIcon className="w-16 h-16 text-white/10" />
                  <div className="absolute bottom-6 left-6 bg-black/40 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10 shadow-xl">
                    <p className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Forensic Overlay: {activeTab}</p>
                  </div>
                </div>

                {/* Verdict Box */}
                <div className={clsx(
                  "p-8 rounded-[2.5rem] border flex items-start shadow-xl animate-in slide-in-from-bottom-2 duration-500",
                  analyzedTab === 'noise' ? "bg-emerald-50/90 border-emerald-100" : "bg-rose-50/90 border-rose-100"
                )}>
                  {analyzedTab === 'noise' ? (
                      <CheckCircle className="w-8 h-8 text-emerald-500 mr-5 flex-shrink-0" />
                  ) : (
                      <AlertCircle className="w-8 h-8 text-rose-500 mr-5 flex-shrink-0" />
                  )}
                  <div>
                    <h3 className={clsx("font-black text-xl tracking-tight mb-2 uppercase", analyzedTab === 'noise' ? "text-emerald-700" : "text-rose-700")}>
                      {analyzedTab === 'ela' && "Inconsistent Resaving Detected"}
                      {analyzedTab === 'noise' && "Natural Sensor Signature"}
                      {analyzedTab === 'clone' && "Duplicated Structures Identified"}
                    </h3>
                    <p className={clsx("font-medium text-sm leading-relaxed", analyzedTab === 'noise' ? "text-emerald-600/80" : "text-rose-600/80")}>
                      {analyzedTab === 'ela' && "Analysis confirms a bright cluster in the highlighted quadrant. This region was processed with a different JPEG quantization table than the background layer."}
                      {analyzedTab === 'noise' && "Laplacian distribution is uniform. No evidence of AI-upscaling or GAN-based pixel smoothing was found in this asset."}
                      {analyzedTab === 'clone' && "ORB feature descriptor matching detected two identical pixel groups. High probability of copy-move object manipulation."}
                    </p>
                  </div>
                </div>
            </div>
          ) : (
            <div className="flex-1 bg-white/20 rounded-[2.5rem] border-2 border-dashed border-[#A09CB0]/20 flex flex-col items-center justify-center text-center p-12">
              <Zap className="w-12 h-12 text-[#A09CB0] mb-6 opacity-30" />
              <h3 className="text-[#3E3B52] font-black text-lg uppercase tracking-tight">Ready for analysis</h3>
              <p className="text-[#8E8AAB] text-sm mt-3 max-w-sm font-medium leading-relaxed uppercase tracking-wider">
                The engine is calibrated. Click Execute Filter on the left to begin pixel computation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}