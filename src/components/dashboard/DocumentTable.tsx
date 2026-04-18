'use client'

import { useState } from 'react'
import { FileText, ExternalLink, Loader2, Trash2 } from 'lucide-react'
import { deleteDocument } from '@/app/actions'

type Doc = { id: string; name: string; size_bytes: number; created_at: string }

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function DocumentTable({
  documents: initial,
  storageMB,
}: {
  documents: Doc[]
  storageMB: number
}) {
  const [docs, setDocs] = useState(initial)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    setDeletingId(id)
    setConfirmId(null)
    const snapshot = [...docs]
    setDocs(prev => prev.filter(d => d.id !== id))
    const result = await deleteDocument(id)
    if (result?.error) setDocs(snapshot)
    setDeletingId(null)
  }

  if (docs.length === 0) return null

  return (
    <div id="documents" className="cx-panel overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--cx-line)' }}>
        <div>
          <p className="cx-rule-label mb-1">Documents</p>
          <h3 className="text-[15px] font-semibold tracking-tight" style={{ color: 'var(--cx-ink)' }}>
            {docs.length} files · <span className="cx-num" style={{ color: 'var(--cx-mute-1)' }}>{storageMB} MB</span> indexed
          </h3>
        </div>
      </div>

      {/* Table header */}
      <div
        className="grid gap-4 px-6 py-2.5 cx-rule-label"
        style={{
          gridTemplateColumns: '1fr 100px 120px 80px',
          background: 'var(--cx-paper)',
        }}
      >
        <span>Name</span>
        <span>Size</span>
        <span>Added</span>
        <span>Status</span>
      </div>

      <div className="divide-y" style={{ borderColor: 'var(--cx-line)' }}>
        {docs.map(doc => {
          const isDeleting = deletingId === doc.id
          const isConfirming = confirmId === doc.id

          return (
            <div
              key={doc.id}
              className="grid gap-4 items-center px-6 py-3.5 transition-colors group"
              style={{
                gridTemplateColumns: '1fr 100px 120px 80px',
                opacity: isDeleting ? 0.4 : 1,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--cx-paper)')}
              onMouseLeave={e => (e.currentTarget.style.background = '')}
            >
              {/* Name */}
              <div className="flex items-center gap-3 min-w-0">
                <FileText size={14} className="flex-shrink-0" style={{ color: 'var(--cx-mute-2)' }} />
                <span className="text-[13px] font-medium truncate" style={{ color: 'var(--cx-ink)' }}>{doc.name}</span>
              </div>

              {/* Size */}
              <span className="cx-num text-[11.5px]" style={{ color: 'var(--cx-mute-1)' }}>
                {formatBytes(doc.size_bytes)}
              </span>

              {/* Added */}
              <span className="cx-num text-[11.5px]" style={{ color: 'var(--cx-mute-1)' }}>
                {timeAgo(doc.created_at)}
              </span>

              {/* Status + actions */}
              <div className="flex items-center gap-2">
                {isConfirming ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="text-[11px] font-bold transition-colors"
                      style={{ color: 'var(--cx-err)' }}
                    >
                      Delete
                    </button>
                    <span style={{ color: 'var(--cx-line-2)' }}>·</span>
                    <button
                      onClick={() => setConfirmId(null)}
                      className="text-[11px] font-medium"
                      style={{ color: 'var(--cx-mute-2)' }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : isDeleting ? (
                  <Loader2 size={12} className="animate-spin" style={{ color: 'var(--cx-mute-2)' }} />
                ) : (
                  <>
                    <span
                      className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[.14em] rounded-full px-2 py-0.5 border w-fit"
                      style={{
                        color: 'var(--cx-ok)',
                        background: 'var(--cx-ok-wash)',
                        borderColor: 'rgba(60,110,71,0.2)',
                      }}
                    >
                      Embedded
                    </span>
                    <button
                      onClick={() => setConfirmId(doc.id)}
                      className="opacity-0 group-hover:opacity-100 size-6 rounded flex items-center justify-center transition-all"
                      style={{ color: 'var(--cx-mute-2)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--cx-paper-2)')}
                      onMouseLeave={e => (e.currentTarget.style.background = '')}
                    >
                      <Trash2 size={11} />
                    </button>
                    <button
                      className="opacity-0 group-hover:opacity-100 size-6 rounded flex items-center justify-center transition-all"
                      style={{ color: 'var(--cx-mute-2)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--cx-paper-2)')}
                      onMouseLeave={e => (e.currentTarget.style.background = '')}
                    >
                      <ExternalLink size={11} />
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
