'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Loader2, Bot, User, ChevronDown, ChevronUp, FileText, Globe, Search } from 'lucide-react'

type Source = {
  chunk_id: string
  document_id: string | null
  document_name: string
  content: string
  similarity: number
}

type ToolEvent = {
  name: string
  status: 'running' | 'done'
  count?: number
}

type Message = {
  id?: string
  role: 'user' | 'assistant'
  content: string
  sources?: Source[]
}

export function ChatWindow({
  sessionId,
  workspaceId,
  initialMessages,
}: {
  sessionId: string
  workspaceId: string
  initialMessages: Message[]
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTools, setActiveTools] = useState<ToolEvent[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, activeTools])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return

    const query = input.trim()
    setInput('')
    setLoading(true)
    setActiveTools([])

    setMessages(prev => [
      ...prev,
      { role: 'user', content: query },
      { role: 'assistant', content: '', sources: [] },
    ])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, workspaceId, query }),
      })

      if (!response.ok) throw new Error(`Request failed: ${response.status}`)

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const parts = buffer.split('\n\n')
        buffer = parts.pop() ?? ''

        for (const part of parts) {
          if (!part.startsWith('data: ')) continue
          try {
            const event = JSON.parse(part.slice(6))

            if (event.type === 'tool') {
              setActiveTools(prev => {
                const idx = prev.findIndex(t => t.name === event.name)
                if (idx >= 0) {
                  const next = [...prev]
                  next[idx] = { name: event.name, status: event.status, count: event.count }
                  return next
                }
                return [...prev, { name: event.name, status: event.status, count: event.count }]
              })
            } else if (event.type === 'token') {
              setMessages(prev => {
                const msgs = [...prev]
                const last = msgs[msgs.length - 1]
                msgs[msgs.length - 1] = { ...last, content: last.content + event.text }
                return msgs
              })
            } else if (event.type === 'done') {
              setMessages(prev => {
                const msgs = [...prev]
                msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], sources: event.sources ?? [] }
                return msgs
              })
              setActiveTools([])
            } else if (event.type === 'error') {
              setMessages(prev => {
                const msgs = [...prev]
                msgs[msgs.length - 1] = {
                  ...msgs[msgs.length - 1],
                  content: `Error: ${event.message}`,
                }
                return msgs
              })
            }
          } catch { }
        }
      }
    } catch (err: any) {
      setMessages(prev => {
        const msgs = [...prev]
        msgs[msgs.length - 1] = {
          ...msgs[msgs.length - 1],
          content: 'Something went wrong. Please try again.',
        }
        return msgs
      })
    } finally {
      setLoading(false)
      setActiveTools([])
    }
  }

  return (
    <div className="flex flex-col h-full bg-zinc-50">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 pb-20">
            <div className="bg-blue-50 p-5 rounded-full">
              <Bot className="h-10 w-10 text-blue-500" />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-zinc-700">What would you like to know?</p>
              <p className="text-sm text-zinc-400 mt-1">
                Ask anything. I'll search your documents or the web automatically.
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => {
          const isLastAssistant = msg.role === 'assistant' && i === messages.length - 1 && loading

          return (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
              )}

              <div className="max-w-[75%] space-y-2">
                {isLastAssistant && msg.content === '' ? (
                  <ToolIndicator tools={activeTools} />
                ) : (
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-sm'
                        : 'bg-white border border-zinc-200 text-zinc-800 rounded-tl-sm shadow-sm'
                    }`}
                  >
                    {msg.content}
                    {isLastAssistant && (
                      <span className="inline-block w-0.5 h-4 bg-zinc-400 animate-pulse ml-0.5 align-middle" />
                    )}
                  </div>
                )}

                {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                  <SourceCitations sources={msg.sources} />
                )}
              </div>

              {msg.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-300 flex items-center justify-center mt-1">
                  <User className="h-4 w-4 text-zinc-600" />
                </div>
              )}
            </div>
          )
        })}

        <div ref={bottomRef} />
      </div>

      <div className="border-t bg-white px-4 py-4 flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-3xl mx-auto">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask anything about your documents..."
            disabled={loading}
            className="flex-1"
            autoFocus
          />
          <Button type="submit" disabled={loading || !input.trim()} size="icon">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  )
}

function ToolIndicator({ tools }: { tools: ToolEvent[] }) {
  if (tools.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1">
        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
    )
  }

  return (
    <div className="space-y-1.5">
      {tools.map((t, i) => (
        <div
          key={i}
          className="flex items-center gap-2 text-xs text-zinc-500 bg-zinc-100 border border-zinc-200 rounded-lg px-3 py-2"
        >
          {t.name === 'search_documents' ? (
            <Search className="h-3 w-3 text-blue-500" />
          ) : (
            <Globe className="h-3 w-3 text-green-500" />
          )}
          <span>
            {t.status === 'running'
              ? `Searching ${t.name === 'search_documents' ? 'documents' : 'web'}...`
              : t.name === 'search_documents'
              ? `Found ${t.count ?? 0} source${t.count !== 1 ? 's' : ''}`
              : 'Web results retrieved'}
          </span>
          {t.status === 'running' && <Loader2 className="h-3 w-3 animate-spin ml-auto" />}
        </div>
      ))}
    </div>
  )
}

function SourceCitations({ sources }: { sources: Source[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="text-xs pl-1">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-600 transition-colors"
      >
        <FileText className="h-3 w-3" />
        <span>
          {sources.length} source{sources.length > 1 ? 's' : ''}
        </span>
        {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>

      {open && (
        <div className="mt-2 space-y-2">
          {sources.map((src, i) => (
            <div key={i} className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-zinc-700 flex items-center gap-1.5 truncate">
                  <FileText className="h-3 w-3 text-blue-500 flex-shrink-0" />
                  <span className="truncate">{src.document_name}</span>
                </span>
                <span className="flex-shrink-0 text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded-full font-medium">
                  {src.similarity}% match
                </span>
              </div>
              <p className="text-zinc-500 leading-relaxed line-clamp-3">{src.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
