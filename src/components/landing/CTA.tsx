"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function CTA() {
  return (
    <section className="py-28 px-6 bg-white border-t border-zinc-100">
      <div className="max-w-[680px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-100 mb-8">
            <span className="size-1.5 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-[11.5px] font-semibold text-violet-700 tracking-wide uppercase">
              Free to get started
            </span>
          </div>

          <h2 className="text-[2.8rem] md:text-[3.4rem] font-bold tracking-[-0.03em] text-zinc-950 leading-[1.05] mb-5">
            Make your documents<br />work for you.
          </h2>
          <p className="text-zinc-500 text-[1.05rem] leading-relaxed mb-10 max-w-[480px] mx-auto">
            Set up your knowledge base in minutes. Upload PDFs, ask questions, get cited answers instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="group inline-flex items-center justify-center gap-2 h-11 px-7 bg-zinc-950 text-white rounded-lg text-[14px] font-semibold hover:bg-zinc-800 transition-colors shadow-sm"
            >
              Get started free
              <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center h-11 px-7 text-zinc-500 text-[14px] font-semibold hover:text-zinc-900 transition-colors"
            >
              Sign in to existing workspace
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
