"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

interface CTAProps {
  isLoggedIn?: boolean;
}

export function CTA({ isLoggedIn = false }: CTAProps) {
  return (
    <section className="relative z-10 max-w-[1200px] mx-auto px-6 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.65, ease }}
        className="relative overflow-hidden rounded-[2rem] px-10 py-16 text-center"
        style={{
          background: 'var(--cx-ink)',
          boxShadow: '0 24px 80px rgba(10,10,10,0.22), 0 1px 0 rgba(255,255,255,0.05) inset',
        }}
      >
        {/* Plum radial glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(122,31,90,0.22), transparent)' }} />

        {/* Decorative dashed ring */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full border border-dashed pointer-events-none"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full border pointer-events-none"
          style={{ borderColor: 'rgba(255,255,255,0.04)' }} />

        <div className="relative z-10 flex flex-col items-center gap-5">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border cx-num"
            style={{ background: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.1)' }}>
            <span className="size-1.5 rounded-full cx-pulse-dot" style={{ background: 'var(--cx-ok)' }} />
            <span className="text-[10.5px] font-semibold tracking-[.12em] uppercase" style={{ color: 'rgba(246,245,242,0.6)' }}>
              Free to get started
            </span>
          </div>

          <h2 className="text-3xl md:text-[2.6rem] font-semibold tracking-tight leading-[1.1] max-w-lg"
            style={{ color: '#f6f5f2' }}>
            Your knowledge base is one upload away.
          </h2>

          <p className="text-[15px] max-w-sm leading-relaxed"
            style={{ color: 'rgba(246,245,242,0.5)' }}>
            Drop in your PDFs and start asking questions in seconds. No setup, no config — just answers.
          </p>

          <motion.div whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }} className="mt-2">
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-[15px] transition-all"
              style={{ background: '#f6f5f2', color: 'var(--cx-ink)', boxShadow: '0 8px 28px rgba(0,0,0,0.3)' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#ede9e0')}
              onMouseLeave={e => (e.currentTarget.style.background = '#f6f5f2')}
            >
              {isLoggedIn ? "Go to Dashboard" : "Start for Free"}
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
