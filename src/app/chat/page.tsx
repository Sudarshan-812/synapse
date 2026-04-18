import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { MessageSquare } from "lucide-react"

export default async function ChatIndexPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const cookieStore = await cookies()
  const activeId = cookieStore.get("cortex_active_workspace")?.value

  const { data: workspaces } = await supabase
    .from("workspaces")
    .select("id")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })

  if (!workspaces || workspaces.length === 0) redirect("/dashboard")

  const workspace = workspaces.find(w => w.id === activeId) ?? workspaces[0]

  const { data: latest } = await supabase
    .from("chat_sessions")
    .select("id")
    .eq("workspace_id", workspace.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (latest) redirect(`/chat/${latest.id}`)

  return (
    <div
      className="flex flex-col items-center justify-center h-full"
      style={{ background: 'var(--cx-paper)' }}
    >
      <div className="flex flex-col items-center gap-4 text-center px-6">
        <div
          className="size-14 rounded-2xl flex items-center justify-center border"
          style={{ background: 'var(--cx-accent-wash)', borderColor: 'var(--cx-accent-line)' }}
        >
          <MessageSquare size={22} style={{ color: 'var(--cx-accent)' }} />
        </div>
        <div>
          <p className="text-[14px] font-semibold" style={{ color: 'var(--cx-ink)' }}>No chats yet</p>
          <p className="cx-rule-label mt-1 max-w-[200px] leading-relaxed">
            Click <span style={{ color: 'var(--cx-ink-2)', fontWeight: 600 }}>New Chat</span> in the sidebar to begin.
          </p>
        </div>
      </div>
    </div>
  )
}
