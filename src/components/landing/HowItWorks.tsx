"use client";

import { motion } from "framer-motion";
import { Upload, Cpu, MessageSquare } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Upload your documents",
    description:
      "Drop any PDF into your workspace. Cortex automatically extracts text, splits it into optimal chunks, and generates 768-dimensional embeddings.",
  },
  {
    step: "02",
    icon: Cpu,
    title: "Hybrid retrieval runs",
    description:
      "When you ask a question, Cortex runs both semantic vector search and BM25 keyword search in parallel, then fuses the results using Reciprocal Rank Fusion.",
  },
  {
    step: "03",
    icon: MessageSquare,
    title: "Get a cited answer",
    description:
      "The top chunks are re-ranked by Gemini, synthesized into a clear answer, and streamed back to you with exact document citations.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-zinc-50 border-t border-zinc-100">
      <div className="max-w-[1100px] mx-auto">

        {/* Header */}
        <div className="max-w-xl mb-16">
          <p className="text-[12px] font-bold tracking-widest text-violet-600 uppercase mb-3">
            How it works
          </p>
          <h2 className="text-[2.4rem] font-bold tracking-tight text-zinc-950 leading-[1.1] mb-4">
            From upload to answer in seconds
          </h2>
          <p className="text-zinc-500 text-[1rem] leading-relaxed">
            No configuration needed. Upload once, query forever.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-5 left-full w-8 h-px bg-zinc-200 z-10 -translate-x-4" />
                )}

                <div className="flex items-center gap-3 mb-5">
                  <div className="size-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
                    <Icon className="size-4.5 text-zinc-700" />
                  </div>
                  <span className="text-[12px] font-bold text-zinc-300 tracking-widest">
                    {step.step}
                  </span>
                </div>

                <h3 className="text-[1.05rem] font-bold text-zinc-900 mb-2 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-[0.9rem] text-zinc-500 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
