"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname: string = usePathname();

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl z-50">
      {/* Replacing 'glass-card' and adding border/shadow for a proper floating element look */}
      <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-[2.5rem] px-8 h-18 flex justify-between items-center shadow-xl">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="bg-[#635BFF] p-2 rounded-2xl rotate-3 group-hover:rotate-0 transition-transform shadow-lg shadow-indigo-200">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#3E3B52]">
            Veris
          </span>
        </Link>

        {/* LINKS */}
        <div className="flex items-center space-x-6">
          <Link
            href="/check"
            className="text-[#6B6686] hover:text-[#3E3B52] font-medium transition-colors text-sm"
          >
            Public Scanner
          </Link>

          <Link
            href="/login"
            className="bg-[#3E3B52] text-white px-7 py-2.5 rounded-full text-sm font-bold shadow-xl shadow-purple-200 hover:scale-105 transition-transform"
          >
            Command Center
          </Link>
        </div>
      </div>
    </nav>
  );
}