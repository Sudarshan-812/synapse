"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { 
  Database, FileSearch, BrainCircuit, Zap, 
  ChevronDown, MessageSquare, ShieldCheck, Layers, LogOut 
} from "lucide-react";

const featuresMenu = [
  { icon: Database, title: "Enterprise RAG Pipeline", description: "768-dim embeddings in pgvector via Supabase", href: "#features" },
  { icon: FileSearch, title: "Hybrid Search", description: "Vector cosine + BM25 keyword fusion", href: "#features" },
  { icon: BrainCircuit, title: "AI Re-ranking", description: "Gemini-powered relevance scoring on top chunks", href: "#features" },
  { icon: Zap, title: "Zero-Latency Streaming", description: "Server-Sent Events for instant token delivery", href: "#features" },
  { icon: MessageSquare, title: "Cited Answers", description: "Every response backed by exact source citations", href: "#features" },
  { icon: ShieldCheck, title: "Workspace Isolation", description: "Fully private, tenant-isolated document stores", href: "#features" },
];

const useCasesMenu = [
  { icon: Layers, title: "Research & Analysis", description: "Query large document libraries instantly", href: "#how-it-works" },
  { icon: ShieldCheck, title: "Legal & Compliance", description: "Find clauses and policies across contracts", href: "#how-it-works" },
  { icon: MessageSquare, title: "Internal Knowledge Base", description: "Turn company docs into a smart assistant", href: "#how-it-works" },
];

type DropdownKey = "features" | "usecases" | null;

interface NavbarProps {
  isLoggedIn?: boolean;
  avatarUrl?: string;
}

export function Navbar({ isLoggedIn = false, avatarUrl }: NavbarProps) {
  const [open, setOpen] = useState<DropdownKey>(null);
  const navRef = useRef<HTMLElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpen(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function toggle(key: DropdownKey) {
    setOpen(prev => (prev === key ? null : key));
  }

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh(); // Refresh the page to update the server component state
  }

  return (
    <header className="absolute top-0 inset-x-0 z-50">
      <div className="max-w-[1200px] mx-auto px-6 h-24 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-1">
          <img src="/CortexLogo.png" alt="Cortex" className="h-8 md:h-10 w-auto object-contain" />
          <span className="text-xl md:text-2xl font-semibold tracking-tight text-zinc-950">Cortex</span>
        </Link>

        {/* Center Nav */}
        <nav ref={navRef} className="hidden md:flex items-center gap-0.5 relative">
          
          <Link href="#product" className="px-4 py-2 text-[14px] font-medium text-zinc-500 hover:text-zinc-950 hover:bg-white/60 rounded-xl transition-all">
            Product
          </Link>
          
          {/* Features dropdown */}
          <div className="relative">
            <button onClick={() => toggle("features")} className={`flex items-center gap-1.5 px-4 py-2 text-[14px] font-medium rounded-xl transition-all ${open === "features" ? "text-zinc-950 bg-white/70 backdrop-blur-sm shadow-sm" : "text-zinc-500 hover:text-zinc-950 hover:bg-white/60"}`}>
              Features <ChevronDown className={`size-3.5 transition-transform duration-200 ${open === "features" ? "rotate-180" : ""}`} />
            </button>
            {open === "features" && (
              <div className="absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 w-[380px] bg-white/80 backdrop-blur-2xl border border-zinc-200/60 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.12)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top">
                <div className="grid grid-cols-1 gap-0.5">
                  {featuresMenu.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link key={item.title} href={item.href} onClick={() => setOpen(null)} className="flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-50/80 transition-colors group">
                        <div className="size-9 rounded-xl bg-zinc-100 border border-zinc-200/60 flex items-center justify-center flex-shrink-0 group-hover:bg-zinc-200 transition-colors"><Icon className="size-4 text-zinc-700" /></div>
                        <div className="min-w-0"><p className="text-[13px] font-semibold text-zinc-900">{item.title}</p><p className="text-[12px] text-zinc-500 mt-0.5 leading-snug">{item.description}</p></div>
                      </Link>
                    );
                  })}
                </div>
                <div className="border-t border-zinc-100 mt-2 pt-2 px-1">
                  <Link href="#features" onClick={() => setOpen(null)} className="flex items-center justify-center gap-1.5 py-2 text-[12.5px] font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">
                    View all features →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Use Cases dropdown */}
          <div className="relative">
            <button onClick={() => toggle("usecases")} className={`flex items-center gap-1.5 px-4 py-2 text-[14px] font-medium rounded-xl transition-all ${open === "usecases" ? "text-zinc-950 bg-white/70 backdrop-blur-sm shadow-sm" : "text-zinc-500 hover:text-zinc-950 hover:bg-white/60"}`}>
              Use Cases <ChevronDown className={`size-3.5 transition-transform duration-200 ${open === "usecases" ? "rotate-180" : ""}`} />
            </button>
            {open === "usecases" && (
              <div className="absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 w-[300px] bg-white/80 backdrop-blur-2xl border border-zinc-200/60 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.12)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top">
                {useCasesMenu.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.title} href={item.href} onClick={() => setOpen(null)} className="flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-50/80 transition-colors group">
                      <div className="size-9 rounded-xl bg-zinc-100 border border-zinc-200/60 flex items-center justify-center flex-shrink-0 group-hover:bg-zinc-200 transition-colors"><Icon className="size-4 text-zinc-700" /></div>
                      <div className="min-w-0"><p className="text-[13px] font-semibold text-zinc-900">{item.title}</p><p className="text-[12px] text-zinc-500 mt-0.5 leading-snug">{item.description}</p></div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <Link href="#docs" className="px-4 py-2 text-[14px] font-medium text-zinc-500 hover:text-zinc-950 hover:bg-white/60 rounded-xl transition-all">
            Docs
          </Link>
        </nav>

        {/* Dynamic Auth */}
        <div className="flex items-center justify-end gap-5 flex-1">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="text-[14px] font-medium text-zinc-500 hover:text-zinc-950 transition-colors hidden sm:block">
                Dashboard
              </Link>
              
              <button 
                onClick={handleSignOut}
                className="flex items-center gap-1.5 text-[14px] font-medium text-zinc-500 hover:text-red-600 transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>

              {/* Avatar without the Link wrapper, with referrerPolicy added to fix Google images */}
              <div className="h-9 w-9 rounded-full overflow-hidden border border-zinc-200 shadow-sm bg-zinc-100 flex-shrink-0">
                <img 
                  src={avatarUrl || `https://ui-avatars.com/api/?name=User&background=random`} 
                  alt="Avatar" 
                  className="h-full w-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="text-[14px] font-medium text-zinc-500 hover:text-zinc-950 transition-colors">
                Log in
              </Link>
              <Link
                href="/login"
                className="h-9 px-5 inline-flex items-center justify-center bg-zinc-950 text-white rounded-full text-[14px] font-medium hover:bg-zinc-800 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}