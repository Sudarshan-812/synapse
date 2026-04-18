'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUp, Check, RotateCcw } from 'lucide-react'

const PROMPT = 'Find indemnification caps across MSAs signed after 2023.'

type Token = string | { cite: number }

const TOKENS: Token[] = [
  'Across ', 'the ', '12 ', 'MSAs ', 'signed ', 'after ', 'January ', '2023, ',
  'indemnification ', 'caps ', 'cluster ', 'into ', 'three ', 'bands.\n\n',
  'The ', 'Globex ', 'and ', 'Initech ', 'agreements ', 'cap ', 'liability ',
  'at ', '**2× ', 'the ', 'trailing ', '12-month ', 'fees**',
  { cite: 1 }, ', ',
  'with ', 'carve-outs ', 'for ', 'IP ', 'infringement ', 'and ', 'breach ',
  'of ', 'confidentiality', { cite: 2 }, '. ',
  'The ', 'Umbrella ', 'and ', 'Pied ', 'Piper ', 'contracts ', 'use ', 'a ',
  '**fixed ', 'USD ', 'cap** ', '(typically ', '$1M–$5M)', { cite: 3 }, ', ',
  'while ', 'the ', 'Hooli ', 'redline ', 'is ', 'currently ', 'pushing ', 'for ',
  '**uncapped** ', 'indemnity ', 'on ', 'data-privacy ', 'claims', { cite: 4 }, '. ',
  'No ', 'agreement ', 'signed ', 'after ', '2023 ', 'carries ', 'a ', 'super-cap ',
  'above ', '3×.',
]

const CHUNKS = [
  { id: 1, doc: 'MSA — Globex 2025.pdf',        page: 14, sim: 91, text: '"…the aggregate liability of either party shall not exceed two (2) times the fees paid during the twelve (12) months immediately preceding the event giving rise to the claim…"' },
  { id: 2, doc: 'Amendment — Initech v3.pdf',   page:  6, sim: 88, text: '"…the foregoing limitation shall not apply to (a) breaches of Section 9 (Confidentiality), (b) third-party intellectual property infringement, or (c) gross negligence…"' },
  { id: 3, doc: 'SOW — Pied Piper Q2.pdf',      page:  3, sim: 86, text: "\u201c\u2026Provider\u2019s total cumulative liability for all claims arising out of or related to this SOW shall be capped at US $3,000,000, irrespective of the form of action\u2026\u201d" },
  { id: 4, doc: 'Redline — Hooli MSA.pdf',      page: 21, sim: 84, text: '"…Notwithstanding the foregoing, Provider shall have UNCAPPED liability for any breach of Article 11 (Data Privacy & Personal Information), including fines and penalties…"' },
]

type Stage = 'search' | 'rerank' | 'stream' | 'done'

const STEPS = [
  { key: 'search', label: 'search_documents',  done: '18 candidates',  running: 'Scanning vector store' },
  { key: 'rerank', label: 'rerank · Gemini',   done: 'Top-4 selected', running: 'Scoring relevance'     },
  { key: 'stream', label: 'synthesize · SSE',  done: 'Streamed',       running: 'Generating response'   },
] as const

function ToolTrace({ stage }: { stage: Stage }) {
  const order: Stage[] = ['search', 'rerank', 'stream', 'done']
  const idx = order.indexOf(stage)
  return (
    <div className="cx-panel-flat p-3 space-y-1.5" style={{ background: 'var(--cx-paper)' }}>
      {STEPS.map((s, i) => {
        const state = i < idx ? 'done' : i === idx ? 'running' : 'pending'
        return (
          <div key={s.key} className="flex items-center gap-2.5">
            <div
              className="size-4 rounded-full border flex items-center justify-center flex-shrink-0"
              style={{
                background: state === 'done' ? 'var(--cx-ok-wash)' : state === 'running' ? 'var(--cx-accent-wash)' : 'var(--cx-surface)',
                borderColor: state === 'done' ? 'rgba(60,110,71,0.3)' : state === 'running' ? 'var(--cx-accent-line)' : 'var(--cx-line)',
              }}
            >
              {state === 'done'
                ? <Check size={9} style={{ color: 'var(--cx-ok)' }} strokeWidth={3} />
                : state === 'running'
                  ? <span className="size-1.5 rounded-full cx-breathe" style={{ background: 'var(--cx-accent)' }} />
                  : <span className="cx-dot" style={{ background: 'var(--cx-line-2)' }} />}
            </div>
            <span className={`text-[11.5px] font-mono ${state === 'pending' ? '' : state === 'running' ? 'cx-shimmer' : ''}`}
              style={{ color: state === 'pending' ? 'var(--cx-mute-2)' : state === 'running' ? undefined : 'var(--cx-ink-2)' }}>
              {s.label}
            </span>
            <span className="flex-1 text-right text-[10.5px] truncate" style={{ color: 'var(--cx-mute-2)' }}>
              {state === 'done' ? s.done : state === 'running' ? s.running : ''}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function RenderTokens({ tokens, onCite }: { tokens: Token[]; onCite: (id: number) => void }) {
  const out: React.ReactNode[] = []
  let buf = ''
  let key = 0

  const flush = () => {
    if (!buf) return
    const pieces = buf.split(/(\*\*[^*]+\*\*)/g)
    pieces.forEach(p => {
      if (!p) return
      if (p.startsWith('**') && p.endsWith('**')) {
        out.push(<strong key={key++} className="font-semibold" style={{ color: 'var(--cx-ink)' }}>{p.slice(2, -2)}</strong>)
      } else {
        p.split(/\n\n/).forEach((chunk, j, arr) => {
          if (chunk) out.push(<span key={key++}>{chunk}</span>)
          if (j < arr.length - 1) out.push(<span key={key++} className="block h-3" />)
        })
      }
    })
    buf = ''
  }

  tokens.forEach(t => {
    if (typeof t === 'string') buf += t
    else if ('cite' in t) {
      flush()
      out.push(
        <button key={key++} onClick={() => onCite(t.cite)} className="cx-cite" title={`Source ${t.cite}`}>{t.cite}</button>
      )
    }
  })
  flush()
  return <>{out}</>
}

export function ChatDemo() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [done, setDone] = useState(false)
  const [stage, setStage] = useState<Stage>('search')
  const [flashId, setFlashId] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const runKey = useRef(0)

  const runStream = useCallback(() => {
    runKey.current += 1
    const key = runKey.current
    setTokens([]); setDone(false); setStage('search')

    const timers: ReturnType<typeof setTimeout>[] = []
    timers.push(setTimeout(() => { if (runKey.current === key) setStage('rerank') }, 1100))
    timers.push(setTimeout(() => { if (runKey.current === key) setStage('stream') }, 2000))

    let i = 0
    function pushNext() {
      if (runKey.current !== key) return
      if (i >= TOKENS.length) { setDone(true); setStage('done'); return }
      const t = TOKENS[i++]
      setTokens(prev => [...prev, t])
      const delay = typeof t === 'object' ? 170 : 28 + Math.random() * 55
      timers.push(setTimeout(pushNext, delay))
    }
    timers.push(setTimeout(pushNext, 2000))
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => { return runStream() }, [runStream])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [tokens])

  const onCiteClick = (id: number) => {
    const el = document.getElementById(`cx-chunk-${id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setFlashId(null)
      requestAnimationFrame(() => setFlashId(id))
      setTimeout(() => setFlashId(null), 2100)
    }
  }

  return (
    <div className="cx-panel overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-5">
        {/* Left — conversation */}
        <div className="lg:col-span-3 flex flex-col min-h-[540px]">
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--cx-line)' }}>
            <div>
              <p className="cx-rule-label mb-1">Agent session · demo</p>
              <h3 className="text-[14.5px] font-semibold tracking-tight" style={{ color: 'var(--cx-ink)' }}>
                Indemnification caps review
              </h3>
            </div>
            <button onClick={runStream} className="cx-btn-ghost h-7 px-3 text-[11px] font-medium rounded-full flex items-center gap-1.5" style={{ color: 'var(--cx-ink-2)' }}>
              <RotateCcw size={11} /> Replay
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-5 cx-scroll-thin">
            {/* User message */}
            <div className="flex justify-end">
              <div
                className="max-w-[82%] rounded-2xl rounded-tr-md px-4 py-2.5 text-[13.5px] leading-relaxed"
                style={{ background: 'var(--cx-paper-2)', color: 'var(--cx-ink-2)' }}
              >
                {PROMPT}
              </div>
            </div>

            {/* Agent response */}
            <div className="flex gap-3 items-start">
              <div
                className="flex-shrink-0 size-7 rounded-full border flex items-center justify-center"
                style={{ borderColor: 'var(--cx-line)', background: 'var(--cx-surface)' }}
              >
                <svg width="14" height="14" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"
                  className={!done ? 'cx-spin' : ''}>
                  <defs>
                    <linearGradient id="cxg-chat" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#f0abfc" />
                      <stop offset="55%" stopColor="#d946ef" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                  <rect x="0" y="0" width="40" height="40" rx="10" fill="url(#cxg-chat)" />
                  <g stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round">
                    <path d="M14 13.5c0-1.9 1.6-3.5 3.6-3.5 1.2 0 2.3.6 2.9 1.5.6-.9 1.7-1.5 2.9-1.5 2 0 3.6 1.6 3.6 3.5 0 .6-.1 1.1-.4 1.6 1.1.7 1.8 2 1.8 3.4 0 1.6-.9 3-2.3 3.7.2.5.3 1 .3 1.5 0 2-1.6 3.8-3.6 3.8-.9 0-1.7-.3-2.4-.8-.7.5-1.5.8-2.4.8-2 0-3.6-1.7-3.6-3.8 0-.5.1-1 .3-1.5-1.3-.7-2.3-2.1-2.3-3.7 0-1.4.7-2.7 1.8-3.4-.2-.5-.2-1-.2-1.6z" />
                    <circle cx="20" cy="20" r="1.6" fill="white" stroke="none" />
                  </g>
                </svg>
              </div>

              <div className="flex-1 min-w-0 space-y-3.5">
                <ToolTrace stage={stage} />
                {tokens.length > 0 && (
                  <div
                    className={`text-[13.5px] leading-[1.78] ${!done ? 'cx-caret' : ''}`}
                    style={{ color: 'var(--cx-ink-2)' }}
                  >
                    <RenderTokens tokens={tokens} onCite={onCiteClick} />
                  </div>
                )}
                {done && (
                  <div className="pt-2 cx-fade-up">
                    <p className="cx-rule-label mb-2">Sources</p>
                    <div className="flex flex-wrap gap-1.5">
                      {CHUNKS.map(c => (
                        <button
                          key={c.id}
                          onClick={() => onCiteClick(c.id)}
                          className="inline-flex items-center gap-2 h-7 px-2.5 rounded-full border cx-btn-ghost text-[11.5px] font-medium"
                          style={{ color: 'var(--cx-ink-2)' }}
                        >
                          <span className="cx-cite">{c.id}</span>
                          <span className="truncate max-w-[160px]">{c.doc}</span>
                          <span className="cx-num text-[10.5px]" style={{ color: 'var(--cx-mute-2)' }}>p.{c.page}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Input bar */}
          <div className="px-6 pb-5 pt-1">
            <div
              className="flex items-center gap-2 rounded-xl pr-1.5 pl-4 py-1.5"
              style={{ background: 'var(--cx-paper)', border: '1px solid var(--cx-line)' }}
            >
              <span className="flex-1 text-[13px]" style={{ color: 'var(--cx-mute-1)' }}>Ask Cortex a follow-up…</span>
              <button
                className="h-7 w-7 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--cx-ink)' }}
              >
                <ArrowUp size={13} className="text-white" strokeWidth={2.25} />
              </button>
            </div>
            <p className="text-center text-[10.5px] mt-2.5" style={{ color: 'var(--cx-mute-2)' }}>
              Gemini Flash · hybrid retrieval · verify before relying on answers
            </p>
          </div>
        </div>

        {/* Right — context chunks */}
        <div
          className="lg:col-span-2 border-t lg:border-t-0 lg:border-l flex flex-col"
          style={{ borderColor: 'var(--cx-line)', background: 'linear-gradient(180deg, var(--cx-paper) 0%, transparent 100%)' }}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--cx-line)' }}>
            <div>
              <p className="cx-rule-label mb-1">Retrieved context</p>
              <h3 className="text-[13px] font-semibold" style={{ color: 'var(--cx-ink)' }}>Top-4 chunks · re-ranked</h3>
            </div>
            <span className="cx-num text-[10.5px]" style={{ color: 'var(--cx-mute-2)' }}>{CHUNKS.length}</span>
          </div>
          <div className="p-3 space-y-2 overflow-y-auto cx-scroll-thin flex-1">
            {CHUNKS.map(c => (
              <div
                key={c.id}
                id={`cx-chunk-${c.id}`}
                className={`p-3.5 rounded-xl cx-panel-flat transition-all duration-300 ${flashId === c.id ? 'cx-chunk-flash' : ''}`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="cx-cite" style={{ height: 18, minWidth: 18, fontSize: 10 }}>{c.id}</span>
                    <span className="text-[12px] font-medium truncate" style={{ color: 'var(--cx-ink)' }}>{c.doc}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="cx-num text-[10px]" style={{ color: 'var(--cx-mute-2)' }}>p.{c.page}</span>
                    <span className="cx-num text-[10px] font-semibold" style={{ color: 'var(--cx-accent)' }}>{c.sim}</span>
                  </div>
                </div>
                <p className="text-[12px] leading-relaxed cx-serif italic" style={{ color: 'var(--cx-mute-1)' }}>
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
