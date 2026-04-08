'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createChatSession, deleteChatSession } from '@/app/session-actions'
import { Button } from '@/components/ui/button'
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
    <aside className="flex flex-col h-full w-64 bg-zinc-900 text-white flex-shrink-0">
      {/* Brand */}
      <div className="px-4 py-5 border-b border-zinc-700/60">
        <p className="font-bold text-base tracking-tight">Synapse</p>
        <p className="text-xs text-zinc-400 truncate mt-0.5">{workspaceName}</p>
      </div>

      {/* New Chat button */}
      <div className="px-3 pt-3 pb-2">
        <button
          onClick={handleNewChat}
          disabled={creating}
          className="w-full flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-700 transition-colors disabled:opacity-50"
        >
          {creating
            ? <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
            : <Plus className="h-4 w-4 flex-shrink-0" />
          }
          {creating ? 'Creating...' : 'New Chat'}
        </button>
      </div>

      {/* Sessions list */}
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5 py-1">
        {sessions.length === 0 && (
          <p className="text-xs text-zinc-500 text-center py-6 px-4">
            No chats yet. Click New Chat to begin.
          </p>
        )}
        {sessions.map(session => (
          <div
            key={session.id}
            onClick={() => router.push(`/chat/${session.id}`)}
            className={`group flex items-center gap-2.5 rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${
              activeId === session.id
                ? 'bg-zinc-700 text-white'
                : 'text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5 flex-shrink-0 text-zinc-400" />
            <span className="flex-1 text-sm truncate">{session.title}</span>
            <button
              onClick={e => handleDelete(session.id, e)}
              disabled={deletingId === session.id}
              className="opacity-0 group-hover:opacity-100 flex-shrink-0 hover:text-red-400 transition-all"
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
      <div className="p-3 border-t border-zinc-700/60">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-zinc-400 hover:text-white hover:bg-zinc-800 text-sm h-9"
          asChild
        >
          <Link href="/">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </Button>
      </div>
    </aside>
  )
}
