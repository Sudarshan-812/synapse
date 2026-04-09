'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createChatSession, deleteChatSession } from '@/app/session-actions'
import { Plus, MessageSquare, Trash2, LayoutDashboard, Loader2 } from 'lucide-react'
import Link from 'next/link'

type Session = {
  id: string
  title: string
  updated_at: string
}

export function ChatSidebar({
  sessions: initialSessions,
  workspaceId,
  workspaceName,
}: {
  sessions: Session[]
  workspaceId: string
  workspaceName: string
}) {
  const router = useRouter()
  const params = useParams()
  const activeId = params?.sessionId as string | undefined

  const [sessions, setSessions] = useState<Session[]>(initialSessions)
  const [creating, setCreating] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleNewChat() {
    setCreating(true)
    const result = await createChatSession(workspaceId)
    if (result.session) {
      setSessions(prev => [result.session!, ...prev])
      router.push(`/chat/${result.session.id}`)
    }
    setCreating(false)
  }

  async function handleDelete(sessionId: string, e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDeletingId(sessionId)
    setSessions(prev => prev.filter(s => s.id !== sessionId))
    await deleteChatSession(sessionId)
    if (activeId === sessionId) router.push('/chat')
    setDeletingId(null)
  }

  return (
    <aside className="flex flex-col h-full w-64 bg-white/80 backdrop-blur-xl border-r border-zinc-100 flex-shrink-0">

      {/* Brand */}
      <div className="px-5 py-5 border-b border-zinc-100">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <img src="/CortexLogo.png" alt="Cortex" className="h-7 w-auto object-contain" />
          <div>
            <p className="text-[13.5px] font-bold tracking-tight text-zinc-950">Cortex</p>
            <p className="text-[11px] text-zinc-400 truncate leading-none mt-0.5">{workspaceName}</p>
          </div>
        </Link>
      </div>

      {/* New Chat */}
      <div className="px-3 pt-4 pb-2">
        <button
          onClick={handleNewChat}
          disabled={creating}
          className="w-full flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 px-3.5 py-2.5 text-[13px] font-semibold text-zinc-700 transition-colors disabled:opacity-50 shadow-sm"
        >
          {creating
            ? <Loader2 className="h-3.5 w-3.5 animate-spin flex-shrink-0 text-fuchsia-500" />
            : <Plus className="h-3.5 w-3.5 flex-shrink-0 text-zinc-500" />
          }
          {creating ? 'Creating...' : 'New Chat'}
        </button>
      </div>

      {/* Sessions */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
        {sessions.length === 0 && (
          <p className="text-[11.5px] text-zinc-400 text-center py-8 px-4 leading-relaxed">
            No chats yet.<br />Click <span className="font-semibold text-zinc-600">New Chat</span> to begin.
          </p>
        )}
        {sessions.map(session => (
          <div
            key={session.id}
            onClick={() => router.push(`/chat/${session.id}`)}
            className={`group flex items-center gap-2.5 rounded-xl px-3 py-2.5 cursor-pointer transition-all duration-150 ${
              activeId === session.id
                ? 'bg-zinc-950 text-white shadow-sm'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <MessageSquare className={`h-3.5 w-3.5 flex-shrink-0 ${activeId === session.id ? 'text-zinc-300' : 'text-zinc-400'}`} />
            <span className="flex-1 text-[13px] font-medium truncate">{session.title}</span>
            <button
              onClick={e => handleDelete(session.id, e)}
              disabled={deletingId === session.id}
              className={`opacity-0 group-hover:opacity-100 flex-shrink-0 transition-all ${
                activeId === session.id ? 'hover:text-red-300 text-zinc-400' : 'hover:text-red-500 text-zinc-400'
              }`}
            >
              {deletingId === session.id
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : <Trash2 className="h-3.5 w-3.5" />
              }
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-zinc-100">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>
      </div>
    </aside>
  )
}
