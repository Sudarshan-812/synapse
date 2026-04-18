'use client'

type Service = { name: string; status: 'operational' | 'degraded' | 'down'; latency: string }

const SERVICES: Service[] = [
  { name: 'Ingestion API',       status: 'operational', latency: '38ms'  },
  { name: 'pgvector (Supabase)', status: 'operational', latency: '12ms'  },
  { name: 'Embedding worker',    status: 'degraded',    latency: '860ms' },
  { name: 'Gemini re-ranker',    status: 'operational', latency: '214ms' },
  { name: 'SSE gateway',         status: 'operational', latency: '9ms'   },
]

const STATUS_COLOR: Record<Service['status'], string> = {
  operational: 'var(--cx-ok)',
  degraded:    'var(--cx-warn)',
  down:        'var(--cx-err)',
}

export function SystemStatus() {
  return (
    <div className="cx-panel p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="cx-rule-label">System status</p>
        <span className="cx-num text-[10.5px]" style={{ color: 'var(--cx-mute-2)' }}>99.98%</span>
      </div>
      <div className="space-y-2 -mx-1">
        {SERVICES.map(s => (
          <div key={s.name} className="flex items-center gap-2.5 px-1 py-1">
            <span
              className="cx-dot cx-pulse-dot flex-shrink-0"
              style={{ background: STATUS_COLOR[s.status] }}
            />
            <span className="flex-1 text-[12px] truncate" style={{ color: 'var(--cx-ink-2)' }}>{s.name}</span>
            <span className="cx-num text-[10.5px] flex-shrink-0" style={{ color: 'var(--cx-mute-2)' }}>{s.latency}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
