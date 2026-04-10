'use client'

import dynamic from 'next/dynamic'

// SoftAurora spins up a WebGL context + rAF loop via OGL.
// Deferring with ssr:false means the browser parses and executes this
// chunk only after the page is interactive, eliminating its contribution
// to Total Blocking Time on the critical path.
const SoftAurora = dynamic(() => import('@/components/SoftAurora'), {
  ssr: false,
  loading: () => null, // purely decorative — no skeleton needed
})

interface AuroraBackgroundProps {
  speed?: number
  scale?: number
  brightness?: number
  color1?: string
  color2?: string
  noiseFrequency?: number
  noiseAmplitude?: number
  bandHeight?: number
  bandSpread?: number
  octaveDecay?: number
  layerOffset?: number
  colorSpeed?: number
}

export function AuroraBackground(props: AuroraBackgroundProps) {
  return (
    // enableMouseInteraction is always false here:
    // the mousemove handler + per-frame lerp adds unnecessary CPU work
    // for a purely decorative background element.
    <SoftAurora {...props} enableMouseInteraction={false} />
  )
}
