"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Shield,
  Droplet,
  BrainCircuit,
  Search,
  Key,
  FileText,
  LogOut,
} from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/lib/AuthContext";
import { auth } from "@/lib/firebase";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Security Scan", href: "/dashboard/scan", icon: Shield },
  { name: "Watermark", href: "/dashboard/watermark", icon: Droplet },
  { name: "AI Detection", href: "/dashboard/ai-detect", icon: BrainCircuit },
  { name: "Image Forensics", href: "/dashboard/forensics", icon: Search },
  { name: "Fingerprinting", href: "/dashboard/fingerprint", icon: Key },
  { name: "Metadata", href: "/dashboard/metadata", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div className="w-72 h-screen sticky top-0 p-6">
      {/* Replaced 'glass-card' with Tailwind utility classes for the frosted glass effect */}
      <div className="h-full rounded-[3rem] bg-white/90 backdrop-blur-xl border border-white/60 shadow-lg flex flex-col overflow-hidden">
        
        {/* NAV */}
        <div className="p-10 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#A09CB0] mb-8">
            Navigation
          </h2>

          <nav className="space-y-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    "flex items-center px-5 py-4 rounded-[1.5rem] transition-all duration-300",
                    isActive
                      ? "bg-white shadow-sm text-[#3E3B52]" // Active item gets a solid white bg
                      : "text-[#8E8AAB] hover:bg-white/40 hover:text-[#3E3B52]"
                  )}
                >
                  <item.icon
                    className={clsx(
                      "mr-4 h-5 w-5 flex-shrink-0",
                      isActive && "text-[#635BFF]"
                    )}
                  />
                  <span className="font-bold text-sm whitespace-nowrap">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* USER PROFILE SECTION */}
        <div className="mt-auto p-8 border-t border-white/40">
          {/* Changed 'bg-white/50' to solid 'bg-white' and added 'shadow-sm' for a cleaner look */}
          <div className="bg-white p-4 rounded-[2rem] flex items-center space-x-3 mb-4 shadow-sm">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-orange-200 to-rose-200 flex items-center justify-center text-[#635BFF] font-bold">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-[#3E3B52] truncate w-28">
                {user?.displayName || user?.email || "Umar Ahmed"}
              </p>
              <p className="text-[10px] text-[#A09CB0]">
                Administrator
              </p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-3 text-[#A09CB0] hover:text-rose-500 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">
              Log Out
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}