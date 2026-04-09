"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react"; // Added Plus icon
import SplitText from "@/components/SplitText";
import ScrollReveal from "@/components/ScrollReveal";

interface HeroProps {
  isLoggedIn?: boolean;
}

export function Hero({ isLoggedIn = false }: HeroProps) {
  return (
    <main className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-zinc-200/80 mb-8 shadow-sm">
          <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold tracking-widest text-zinc-800 uppercase">Production RAG Live</span>
        </div>

        <SplitText
          text="Your documents. Finally intelligent."
          className="text-6xl md:text-8xl lg:text-[6.5rem] font-bold tracking-[-0.03em] leading-[1.02] text-zinc-950 mb-8"
          delay={40}
          duration={1.1}
          tag="h1"
        />

        <div className="mb-10 max-w-3xl mx-auto">
          <ScrollReveal
            baseOpacity={0.1}
            enableBlur={true}
            baseRotation={2}
            blurStrength={4}
            textClassName="text-lg md:text-xl lg:text-2xl text-zinc-600 leading-relaxed font-medium text-center"
          >
            Cortex turns your PDFs, documents, and notes into a smart, conversational knowledge base using hybrid search, AI re-ranking, and source citations.
          </ScrollReveal>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 justify-center mt-6"
      >
        {isLoggedIn ? (
          /* ─── LOGGED IN STATE ─── */
          <>
            <Link
              href="/dashboard"
              className="group flex items-center justify-center gap-2 bg-zinc-950 hover:bg-black text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_24px_-6px_rgba(0,0,0,0.4)] hover:-translate-y-0.5"
            >
              Open Dashboard
              <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/dashboard" 
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white/50 backdrop-blur-xl border border-zinc-200/80 text-zinc-950 rounded-full font-bold text-lg hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <Plus className="size-5 text-zinc-600" />
              Create Workspace
            </Link>
          </>
        ) : (
          /* ─── LOGGED OUT STATE ─── */
          <>
            <Link
              href="/login"
              className="group flex items-center justify-center gap-2 bg-zinc-950 hover:bg-black text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_24px_-6px_rgba(0,0,0,0.4)] hover:-translate-y-0.5"
            >
              Start Analyzing Documents
              <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 bg-white/50 backdrop-blur-xl border border-zinc-200/80 text-zinc-950 rounded-full font-bold text-lg hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              Learn How It Works
            </Link>
          </>
        )}
      </motion.div>
    </main>
  );
}