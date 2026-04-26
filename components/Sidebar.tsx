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
  User,
} from "lucide-react";
import { clsx } from "clsx";
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

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    /* Hidden on mobile, visible from md (768px) upwards */
    <aside className="hidden md:flex w-72 h-[calc(100vh-2rem)] sticky top-24 p-6 pt-0 flex-col">
      <div className="h-full rounded-[3rem] bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl shadow-indigo-100/50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-4 duration-700">
        
        {/* --- NAVIGATION SECTION --- */}
        <div className="p-8 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#A09CB0] mb-8 ml-4">
            Command Menu
          </h2>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    "flex items-center px-5 py-4 rounded-[1.5rem] transition-all duration-300 group",
                    isActive
                      ? "bg-white shadow-xl shadow-indigo-100/50 text-[#3E3B52] scale-[1.02]"
                      : "text-[#8E8AAB] hover:bg-white/50 hover:text-[#3E3B52]"
                  )}
                >
                  <item.icon
                    className={clsx(
                      "mr-4 h-5 w-5 flex-shrink-0 transition-colors duration-300",
                      isActive ? "text-[#635BFF]" : "group-hover:text-[#635BFF]"
                    )}
                  />
                  <span className="font-bold text-xs uppercase tracking-widest whitespace-nowrap">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* --- USER PROFILE FOOTER --- */}
        <div className="mt-auto p-6 border-t border-white/40 bg-white/20">
          <div className="bg-white p-4 rounded-[2rem] flex items-center space-x-3 mb-4 shadow-sm border border-white">
            <div className="h-10 w-10 rounded-[1.25rem] bg-gradient-to-tr from-indigo-50 to-white border border-indigo-100 flex items-center justify-center text-[#635BFF] shadow-inner">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="avatar" className="h-full w-full rounded-[1.25rem] object-cover" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-black text-[#3E3B52] truncate w-28 uppercase tracking-tighter">
                {user?.displayName || user?.email?.split('@')[0] || "Umar Ahmed"}
              </p>
              <p className="text-[9px] font-bold text-[#A09CB0] uppercase tracking-widest">
                Forensic Admin
              </p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-3 text-[#A09CB0] hover:text-rose-500 transition-all group font-black text-[10px] uppercase tracking-[0.2em]"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Terminate Session</span>
          </button>
        </div>
      </div>
    </aside>
  );
}