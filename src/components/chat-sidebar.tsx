'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createChatSession, deleteChatSession } from '@/app/session-actions'
import { switchWorkspace } from '@/app/actions'
import {
  Plus, MessageSquare, Trash2, LayoutDashboard,
  Loader2, PanelLeftClose, PanelLeftOpen,
  ChevronDown, Check, Building2,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

type Session  = { id: string; title: string; updated_at: string }
type Workspace = { id: string; name: string }

export function ChatSidebar({
  sessions: initialSessions,
  workspaceId,
  workspaceName,
  workspaces = [],
}: {
  sessions: Session[]
  workspaceId: string
  workspaceName: string
  workspaces?: Workspace[]
}) {
  const router  = useRouter()
  const params  = useParams()
  const activeId = params?.sessionId as string | undefined

  const [sessions,    setSessions]    = useState<Session[]>(initialSessions)
  const [creating,    setCreating]    = useState(false)
  const [deletingId,  setDeletingId]  = useState<string | null>(null)
  const [collapsed,   setCollapsed]   = useState(false)
  const [wsOpen,      setWsOpen]      = useState(false)
  const [switchingWs, setSwitchingWs] = useState<string | null>(null)
  const wsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wsRef.current && !wsRef.current.contains(e.target as Node)) setWsOpen(false)
    }
    if (wsOpen) document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [wsOpen])

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
    e.preventDefault(); e.stopPropagation()
    setDeletingId(sessionId)
    setSessions(prev => prev.filter(s => s.id !== sessionId))
    await deleteChatSession(sessionId)
    if (activeId === sessionId) router.push('/chat')
    setDeletingId(null)
  }

  async function handleSwitchWorkspace(wsId: string) {
    if (wsId === workspaceId || switchingWs) return
    setSwitchingWs(wsId)
    setWsOpen(false)
    await switchWorkspace(wsId)
    router.refresh()
    router.push('/chat')
    setSwitchingWs(null)
  }

  return (
    <aside
      className={`flex flex-col h-full flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden border-r`}
      style={{
        width: collapsed ? 60 : 256,
        background: 'var(--cx-paper)',
        borderColor: 'var(--cx-line)',
      }}
    >
      {/* ── Header ──────────────────────────────────────────── */}
      <div
        className={`flex items-center h-[58px] px-3 border-b flex-shrink-0 ${collapsed ? 'justify-center' : 'justify-between gap-2'}`}
        style={{ borderColor: 'var(--cx-line)' }}
      >
        {!collapsed && (
          <div ref={wsRef} className="relative min-w-0 flex-1">
            <button
              onClick={() => workspaces.length > 1 && setWsOpen(v => !v)}
              className={`w-full text-left ${workspaces.length > 1 ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <p className="cx-rule-label leading-none">Workspace</p>
              <div className="flex items-center gap-1 mt-1">
                <p className="text-[13px] font-semibold truncate" style={{ color: 'var(--cx-ink)' }}>
                  {workspaceName}
                </p>
                {workspaces.length > 1 && (
                  <ChevronDown
                    size={12}
                    className={`flex-shrink-0 transition-transform duration-200 ${wsOpen ? 'rotate-180' : ''}`}
                    style={{ color: 'var(--cx-mute-2)' }}
                  />
                )}
              </div>
            </button>

            {wsOpen && workspaces.length > 1 && (
              <div
                className="absolute top-full left-0 mt-2 w-56 cx-panel p-1.5 z-50 cx-fade-up"
              >
                <p className="cx-rule-label px-2 pt-1 pb-1.5">Switch workspace</p>
                {workspaces.map(ws => {
                  const active     = ws.id === workspaceId
                  const isSwitching = switchingWs === ws.id
                  return (
                    <button
                      key={ws.id}
                      onClick={() => handleSwitchWorkspace(ws.id)}
                      disabled={active || !!switchingWs}
                      className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-left transition-colors"
                      style={{ background: active ? 'var(--cx-paper-2)' : '' }}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--cx-paper-2)' }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.background = '' }}
                    >
                      <span
                        className="size-5 rounded-md flex items-center justify-center flex-shrink-0 border"
                        style={{
                          background: active ? 'var(--cx-accent-wash)' : 'var(--cx-paper)',
                          borderColor: active ? 'var(--cx-accent-line)' : 'var(--cx-line)',
                        }}
                      >
                        {isSwitching
                          ? <Loader2 size={10} className="cx-spin" style={{ color: 'var(--cx-mute-1)' }} />
                          : active
                            ? <Check size={10} style={{ color: 'var(--cx-accent)' }} strokeWidth={2.5} />
                            : <Building2 size={10} style={{ color: 'var(--cx-mute-2)' }} />}
                      </span>
                      <span className="text-[12.5px] font-medium truncate" style={{ color: active ? 'var(--cx-ink)' : 'var(--cx-ink-2)' }}>
                        {ws.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => setCollapsed(v => !v)}
          className="flex-shrink-0 size-8 rounded-lg flex items-center justify-center transition-colors"
          style={{ color: 'var(--cx-mute-2)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--cx-paper-2)'; e.currentTarget.style.color = 'var(--cx-ink)' }}
          onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--cx-mute-2)' }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
        </button>
      </div>

      {/* ── New Chat ─────────────────────────────────────────── */}
      <div className={`px-2 pt-3 pb-2 flex-shrink-0 ${collapsed ? 'flex justify-center' : ''}`}>
        {collapsed ? (
          <button
            onClick={handleNewChat}
            disabled={creating}
            title="New Chat"
            className="size-9 rounded-lg border flex items-center justify-center transition-colors"
            style={{ borderColor: 'var(--cx-line)', background: 'var(--cx-surface)', color: 'var(--cx-mute-1)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--cx-paper-2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--cx-surface)')}
          >
            {creating
              ? <Loader2 size={13} className="cx-spin" style={{ color: 'var(--cx-accent)' }} />
              : <Plus size={13} />}
          </button>
        ) : (
          <button
            onClick={handleNewChat}
            disabled={creating}
            className="cx-btn-ink w-full flex items-center gap-2 rounded-full h-9 px-4 text-[12.5px] font-medium disabled:opacity-50"
          >
            {creating
              ? <Loader2 size={13} className="cx-spin flex-shrink-0" />
              : <Plus size={13} className="flex-shrink-0" />}
            {creating ? 'Creating…' : 'New Chat'}
          </button>
        )}
      </div>

      {/* ── Session list ─────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-2 py-1 cx-scroll-thin space-y-0.5">
        {!collapsed && sessions.length === 0 && (
          <div className="py-10 text-center px-3">
            <p className="cx-rule-label mb-1">No chats yet</p>
            <p className="text-[12px]" style={{ color: 'var(--cx-mute-2)' }}>
              Click New Chat to begin.
            </p>
          </div>
        )}

        {!collapsed && sessions.length > 0 && (
          <p className="cx-rule-label px-2 pt-1 pb-2">Recent</p>
        )}

        {sessions.map(session => {
          const isActive = activeId === session.id
          return (
            <div
              key={session.id}
              onClick={() => router.push(`/chat/${session.id}`)}
              title={collapsed ? session.title : undefined}
              className="group flex items-center gap-2.5 rounded-lg cursor-pointer transition-all duration-150"
              style={{
                padding: collapsed ? undefined : '8px 10px',
                justifyContent: collapsed ? 'center' : undefined,
                width: collapsed ? 36 : undefined,
                height: collapsed ? 36 : undefined,
                margin: collapsed ? '0 auto' : undefined,
                background: isActive ? 'var(--cx-ink)' : '',
                color: isActive ? '#f2f0eb' : 'var(--cx-ink-2)',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--cx-paper-2)' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = '' }}
            >
              <MessageSquare
                size={13}
                className="flex-shrink-0"
                style={{ color: isActive ? '#d5a8c2' : 'var(--cx-mute-2)' }}
              />
              {!collapsed && (
                <>
                  <span className="flex-1 text-[12.5px] font-medium truncate">{session.title}</span>
                  <button
                    onClick={e => handleDelete(session.id, e)}
                    disabled={deletingId === session.id}
                    className="opacity-0 group-hover:opacity-100 flex-shrink-0 transition-all rounded p-0.5"
                    style={{ color: isActive ? 'rgba(255,255,255,0.4)' : 'var(--cx-mute-2)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = isActive ? 'rgba(255,255,255,0.8)' : 'var(--cx-err)')}
                    onMouseLeave={e => (e.currentTarget.style.color = isActive ? 'rgba(255,255,255,0.4)' : 'var(--cx-mute-2)')}
                  >
                    {deletingId === session.id
                      ? <Loader2 size={12} className="animate-spin" />
                      : <Trash2 size={12} />}
                  </button>
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Footer ───────────────────────────────────────────── */}
      <div
        className={`p-2 border-t flex-shrink-0 ${collapsed ? 'flex flex-col items-center gap-1' : ''}`}
        style={{ borderColor: 'var(--cx-line)' }}
      >
        <Link
          href="/dashboard"
          title={collapsed ? 'Dashboard' : undefined}
          className="flex items-center gap-2.5 rounded-lg text-[12.5px] font-medium transition-colors"
          style={{
            padding: collapsed ? undefined : '8px 10px',
            justifyContent: collapsed ? 'center' : undefined,
            width: collapsed ? 36 : '100%',
            height: collapsed ? 36 : undefined,
            color: 'var(--cx-mute-1)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--cx-paper-2)'; e.currentTarget.style.color = 'var(--cx-ink)' }}
          onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--cx-mute-1)' }}
        >
          <LayoutDashboard size={14} className="flex-shrink-0" />
          {!collapsed && 'Dashboard'}
        </Link>

        {!collapsed && (
          <div className="flex items-center gap-2 px-2.5 pt-2 pb-1">
            <Image src="/CortexLogo.png" alt="Cortex" width={14} height={14} className="object-contain opacity-40" />
            <span className="cx-num text-[10px]" style={{ color: 'var(--cx-mute-2)' }}>Cortex v2.0</span>
          </div>
        )}
      </div>
    </aside>
  )
}
