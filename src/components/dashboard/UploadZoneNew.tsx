'use client'

import { useEffect, useRef, useState } from 'react'
import { FileText, Loader2, Check, UploadCloud } from 'lucide-react'
import { uploadDocument } from '@/app/actions'

const STAGES = [
  { key: 'processing', label: 'Process' },
  { key: 'chunking',   label: 'Chunk'   },
  { key: 'embedding',  label: 'Embed'   },
  { key: 'embedded',   label: 'Indexed' },
] as const

type StageName = typeof STAGES[number]['key']

type QueueItem = { id: string; name: string; stage: StageName; pct: number }

function UploadRow({ file }: { file: QueueItem }) {
  const stageIdx = STAGES.findIndex(s => s.key === file.stage)
  const isDone = file.stage === 'embedded'
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-1.5">
        <FileText size={12} style={{ color: 'var(--cx-mute-2)' }} className="flex-shrink-0" />
        <div className="min-w-0 flex-1 text-[12px] font-medium truncate" style={{ color: 'var(--cx-ink-2)' }}>
          {file.name}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {isDone
            ? <Check size={12} style={{ color: 'var(--cx-ok)' }} strokeWidth={2.5} />
            : <Loader2 size={11} className="animate-spin" style={{ color: 'var(--cx-accent)' }} />}
          <span className="cx-num text-[10px] w-7 text-right" style={{ color: 'var(--cx-mute-2)' }}>
            {Math.round(file.pct)}%
          </span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {STAGES.map((s, i) => {
          const active = i === stageIdx
          const done = i < stageIdx || isDone
          const fillWidth = done ? '100%'
            : active ? `${Math.min(100, Math.max(0, ((file.pct - i * 25) / 25) * 100))}%`
            : '0%'
          return (
            <div key={s.key} className="flex flex-col gap-1">
              <div className="h-[2px] rounded-full overflow-hidden" style={{ background: 'var(--cx-line)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: fillWidth, background: done ? 'var(--cx-ok)' : 'var(--cx-accent)' }}
                />
              </div>
              <span
                className="text-[9.5px] font-mono uppercase tracking-[.1em]"
                style={{
                  color: active ? 'var(--cx-ink-2)' : done ? 'var(--cx-mute-1)' : 'var(--cx-mute-2)',
                  fontWeight: active ? 600 : 500,
                }}
              >
                {s.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function UploadZoneNew({ workspaceId }: { workspaceId: string }) {
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [drag, setDrag] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (queue.length === 0) return
    const t = setInterval(() => {
      setQueue(q => q.map(f => {
        if (f.stage === 'embedded') return f
        let pct = f.pct + 1.6 + Math.random() * 2.4
        let stage: StageName = f.stage
        if (pct >= 100) { pct = 100; stage = 'embedded' }
        else if (pct >= 75) stage = 'embedding'
        else if (pct >= 45) stage = 'chunking'
        else stage = 'processing'
        return { ...f, pct, stage }
      }))
    }, 700)
    return () => clearInterval(t)
  }, [queue.length])

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const file = files[0]
    const newItem: QueueItem = { id: `q-${Date.now()}`, name: file.name, stage: 'processing', pct: 4 }
    setQueue(q => [newItem, ...q].slice(0, 5))

    const fd = new FormData()
    fd.append('file', file)
    fd.append('workspaceId', workspaceId)
    await uploadDocument(fd)
  }

  return (
    <div className="cx-panel overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div>
          <p className="cx-rule-label mb-1">Ingest</p>
          <h3 className="text-[14.5px] font-semibold tracking-tight" style={{ color: 'var(--cx-ink)' }}>
            Add to knowledge base
          </h3>
        </div>
      </div>

      <div className="px-5 pb-4">
        <div
          onDragOver={e => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files) }}
          onClick={() => fileRef.current?.click()}
          className="relative rounded-xl border border-dashed transition-all duration-200 flex flex-col items-center justify-center text-center px-6 py-7 cursor-pointer"
          style={{
            borderColor: drag ? 'var(--cx-accent)' : 'var(--cx-line-2)',
            background: drag ? 'var(--cx-accent-wash)' : 'var(--cx-paper)',
          }}
        >
          <input
            ref={fileRef}
            type="file"
            multiple
            className="hidden"
            onChange={e => handleFiles(e.target.files)}
            accept=".pdf,.docx,.doc,.txt,.md,.csv"
          />
          <UploadCloud size={20} className="mb-2" style={{ color: 'var(--cx-mute-1)' }} />
          <p className="text-[12.5px] font-medium mb-0.5" style={{ color: 'var(--cx-ink)' }}>
            Drop a file or click to browse
          </p>
          <p className="text-[10.5px] font-mono" style={{ color: 'var(--cx-mute-2)' }}>
            PDF · DOCX · TXT · MD · CSV · up to 50 MB
          </p>
        </div>
      </div>

      {queue.length > 0 && (
        <div className="border-t px-5 py-4 space-y-3" style={{ borderColor: 'var(--cx-line)' }}>
          <div className="flex items-center justify-between mb-1">
            <p className="cx-rule-label">Queue</p>
            <span className="cx-num text-[10.5px]" style={{ color: 'var(--cx-mute-2)' }}>
              {queue.filter(f => f.stage !== 'embedded').length} active · {queue.filter(f => f.stage === 'embedded').length} done
            </span>
          </div>
          {queue.map(f => <UploadRow key={f.id} file={f} />)}
        </div>
      )}
    </div>
  )
}
