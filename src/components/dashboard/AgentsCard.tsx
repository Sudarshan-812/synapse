'use client'

const AGENTS = [
  { name: 'Legal Diligence',     runs: 148, status: 'running' },
  { name: 'Compliance Auditor',  runs:  92, status: 'idle'    },
  { name: 'Contract Summarizer', runs:  64, status: 'running' },
  { name: 'Redline Reviewer',    runs:  37, status: 'idle'    },
] as const

export function AgentsCard() {
  return (
    <div id="agents" className="cx-panel p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="cx-rule-label">Active agents</p>
        <button className="text-[11px] font-medium transition-colors" style={{ color: 'var(--cx-mute-1)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--cx-ink)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--cx-mute-1)')}>
          Manage →
        </button>
      </div>
      <div className="space-y-3">
        {AGENTS.map(a => (
          <div key={a.name} className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`cx-dot flex-shrink-0 ${a.status === 'running' ? 'cx-pulse-dot' : ''}`}
                    style={{ background: a.status === 'running' ? 'var(--cx-ok)' : 'var(--cx-line-2)' }}
                  />
                  <span className="text-[12.5px] font-medium truncate" style={{ color: 'var(--cx-ink)' }}>{a.name}</span>
                </div>
                <span className="cx-num text-[10.5px] flex-shrink-0" style={{ color: 'var(--cx-mute-2)' }}>{a.runs} runs</span>
              </div>
              <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'var(--cx-paper-2)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(100, a.runs / 1.5)}%`,
                    background: a.status === 'running' ? 'var(--cx-accent)' : 'var(--cx-line-2)',
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
