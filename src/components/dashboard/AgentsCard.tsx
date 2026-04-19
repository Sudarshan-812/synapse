'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const AGENTS = [
  { name: 'Legal Diligence',     runs: 148, status: 'running' },
  { name: 'Compliance Auditor',  runs:  92, status: 'idle'    },
  { name: 'Contract Summarizer', runs:  64, status: 'running' },
  { name: 'Redline Reviewer',    runs:  37, status: 'idle'    },
] as const

export function AgentsCard() {
  const router = useRouter()
  return (
    <div id="agents" className="cx-panel p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="cx-rule-label">Active agents</p>
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => router.push('/chat')}
          className="text-[11px] font-medium transition-colors"
          style={{ color: 'var(--cx-mute-1)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--cx-ink)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--cx-mute-1)')}
        >
          Manage →
        </motion.button>
      </div>

      <div className="space-y-3.5">
        {AGENTS.map((a, i) => (
          <motion.div
            key={a.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 + i * 0.08, duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`cx-dot flex-shrink-0 ${a.status === 'running' ? 'cx-pulse-dot' : ''}`}
                    style={{ background: a.status === 'running' ? 'var(--cx-ok)' : 'var(--cx-line-2)' }}
                  />
                  <span className="text-[12.5px] font-medium truncate" style={{ color: 'var(--cx-ink)' }}>
                    {a.name}
                  </span>
                </div>
                <span className="cx-num text-[10.5px] flex-shrink-0" style={{ color: 'var(--cx-mute-2)' }}>
                  {a.runs} runs
                </span>
              </div>

              {/* Animated progress bar */}
              <div
                className="h-[3px] rounded-full overflow-hidden"
                style={{ background: 'var(--cx-paper-2)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: a.status === 'running' ? 'var(--cx-accent)' : 'var(--cx-line-2)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, a.runs / 1.5)}%` }}
                  transition={{ delay: 0.25 + i * 0.08, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
