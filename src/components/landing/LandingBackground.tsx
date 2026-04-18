"use client";

import { motion } from "framer-motion";
import SoftAurora from "@/components/SoftAurora";

export function LandingBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* WebGL aurora — warm cream base + muted rose-plum accent */}
      <SoftAurora
        speed={0.32}
        scale={1.6}
        brightness={0.87}
        color1="#f6f5f2"
        color2="#a84e7a"
        noiseFrequency={1.6}
        noiseAmplitude={0.58}
        bandHeight={0.42}
        bandSpread={1.3}
        octaveDecay={0.22}
        layerOffset={0.14}
        colorSpeed={0.42}
        enableMouseInteraction
        mouseInfluence={0.13}
      />

      {/* Warm amber bloom — top-left depth layer */}
      <motion.div
        className="absolute -top-[25%] -left-[8%] w-[70vw] h-[70vw] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(210,165,115,0.13) 0%, transparent 68%)',
          filter: 'blur(90px)',
        }}
        animate={{ x: [0, 35, -10, 0], y: [0, 20, -14, 0], scale: [1, 1.06, 0.96, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Plum haze — upper-right */}
      <motion.div
        className="absolute -top-[12%] right-[-8%] w-[52vw] h-[52vw] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(122,31,90,0.09) 0%, transparent 68%)',
          filter: 'blur(100px)',
        }}
        animate={{ x: [0, -28, 12, 0], y: [0, 30, -18, 0], scale: [1, 1.09, 0.94, 1] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />

      {/* Editorial grain overlay */}
      <div
        className="absolute inset-0 mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')",
          opacity: 0.032,
        }}
      />
    </div>
  );
}
