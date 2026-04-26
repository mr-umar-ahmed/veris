"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Shield, Menu, X, Search, LayoutDashboard, 
  Droplet, BrainCircuit, Key, FileText 
} from "lucide-react";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

// Duplicate the nav items from the sidebar for mobile use
const dashboardNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Security Scan", href: "/dashboard/scan", icon: Shield },
  { name: "Watermark", href: "/dashboard/watermark", icon: Droplet },
  { name: "AI Detection", href: "/dashboard/ai-detect", icon: BrainCircuit },
  { name: "Image Forensics", href: "/dashboard/forensics", icon: Search },
  { name: "Fingerprinting", href: "/dashboard/fingerprint", icon: Key },
  { name: "Metadata", href: "/dashboard/metadata", icon: FileText },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper to check if a link is active
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50">
      {/* --- MAIN DESKTOP CONTAINER --- */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2rem] md:rounded-[2.5rem] px-6 md:px-8 h-16 md:h-20 flex justify-between items-center shadow-2xl shadow-indigo-100/50 transition-all duration-500">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="bg-[#635BFF] p-2 rounded-xl md:rounded-2xl rotate-3 group-hover:rotate-0 transition-transform shadow-lg shadow-indigo-200">
            <Shield className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </div>
          <span className="text-xl md:text-2xl font-black tracking-tighter text-[#3E3B52] uppercase">
            Veris
          </span>
        </Link>

        {/* DESKTOP NAVIGATION LINKS (Hidden on Mobile) */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/check"
            className={clsx(
              "text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-[#635BFF]",
              isActive("/check") ? "text-[#635BFF]" : "text-[#8E8AAB]"
            )}
          >
            Public Scanner
          </Link>

          <Link
            href="/login"
            className="bg-[#3E3B52] text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-purple-200 hover:bg-[#635BFF] hover:scale-105 active:scale-95 transition-all"
          >
            Command Center
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-[#3E3B52] hover:bg-white/50 rounded-xl transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* --- MOBILE DROPDOWN MENU (Hidden on Desktop) --- */}
      <div 
        className={clsx(
          "absolute top-20 left-0 w-full bg-white/95 backdrop-blur-2xl border border-white/60 rounded-[2rem] p-6 shadow-2xl transition-all duration-300 origin-top md:hidden",
          isMobileMenuOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
        )}
      >
        <div className="flex flex-col space-y-2 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* Dashboard Items */}
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A09CB0] mb-2 ml-2 mt-2">
            Command Center
          </div>
          
          {dashboardNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={clsx(
                "flex items-center p-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-colors",
                isActive(item.href) ? "bg-[#635BFF]/10 text-[#635BFF]" : "bg-white/50 text-[#8E8AAB]"
              )}
            >
              <item.icon className="w-4 h-4 mr-3 flex-shrink-0" />
              {item.name}
            </Link>
          ))}

          <div className="h-px bg-black/5 my-4"></div>

          {/* Public Tools */}
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A09CB0] mb-2 ml-2">
            Public Tools
          </div>
          
          <Link
            href="/check"
            onClick={() => setIsMobileMenuOpen(false)}
            className={clsx(
              "flex items-center p-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-colors",
              isActive("/check") ? "bg-[#635BFF]/10 text-[#635BFF]" : "bg-white/50 text-[#8E8AAB]"
            )}
          >
            <Search className="w-4 h-4 mr-3 flex-shrink-0" />
            Public Scanner
          </Link>

        </div>
      </div>
    </nav>
  );
}