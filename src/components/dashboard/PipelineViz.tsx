'use client'

import {
  UploadCloud, FileText, Layers, Database,
  FileSearch, BrainCircuit, Bot,
} from 'lucide-react'

const stages = [
  { Icon: UploadCloud,   label: 'Ingest',    sub: 'PDF · DOCX' },
  { Icon: FileText,      label: 'Chunk',     sub: 'LangChain' },
  { Icon: Layers,        label: 'Embed',     sub: 'Matryoshka' },
  { Icon: Database,      label: 'pgvector',  sub: 'Supabase' },
  { Icon: FileSearch,    label: 'Retrieve',  sub: 'Hybrid+BM25' },
  { Icon: BrainCircuit,  label: 'Re-rank',   sub: 'Gemini' },
  { Icon: Bot,           label: 'Agent',     sub: 'SSE' },
]

export function PipelineViz() {
  return (
    <div className="cx-panel p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="cx-rule-label mb-1.5">Retrieval pipeline</p>
          <h2 className="text-[17px] font-semibold tracking-tight" style={{ color: 'var(--cx-ink)' }}>
            Live flow — ingest to agent response
          </h2>
        </div>
        <div
          className="flex items-center gap-2 px-2.5 py-1 rounded-full border"
          style={{ borderColor: 'var(--cx-line)' }}
        >
          <span className="cx-dot cx-pulse-dot" style={{ background: 'var(--cx-ok)' }} />
          <span className="text-[10.5px] font-medium uppercase tracking-[.18em]" style={{ color: 'var(--cx-mute-1)' }}>
            Operational · p95 214ms
          </span>
        </div>
      </div>

      <div className="relative flex items-center justify-between">
        {stages.map(({ Icon, label, sub }, i) => (
          <div key={i} className="contents">
            <div className="flex flex-col items-center gap-2.5 z-10 flex-shrink-0">
              <div
                className="relative size-11 rounded-full border flex items-center justify-center"
                style={{ background: 'var(--cx-surface)', borderColor: 'var(--cx-line)' }}
              >
                <Icon size={15} style={{ color: 'var(--cx-ink-2)' }} />
                {i === 4 && (
                  <span
                    className="absolute -inset-1 rounded-full border cx-breathe"
                    style={{ borderColor: 'var(--cx-accent-line)' }}
                  />
                )}
              </div>
              <div className="text-center">
                <div className="text-[11.5px] font-semibold leading-none" style={{ color: 'var(--cx-ink)' }}>{label}</div>
                <div className="text-[10px] font-mono mt-1 leading-none" style={{ color: 'var(--cx-mute-2)' }}>{sub}</div>
              </div>
            </div>
            {i < stages.length - 1 && (
              <svg className="flex-1 h-[14px] mx-2" viewBox="0 0 100 14" preserveAspectRatio="none">
                <line x1="0" y1="7" x2="100" y2="7" stroke="var(--cx-line)" strokeWidth="1" />
                <line
                  x1="0" y1="7" x2="100" y2="7"
                  stroke="var(--cx-accent)" strokeOpacity="0.5"
                  strokeWidth="1" strokeDasharray="3 6"
                  className="cx-flow-line"
                />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
