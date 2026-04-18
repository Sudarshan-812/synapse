import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ChatSidebar } from "@/components/chat-sidebar"

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: workspaces } = await supabase
    .from("workspaces")
    .select("id, name")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })

  if (!workspaces || workspaces.length === 0) redirect("/dashboard")

  const cookieStore = await cookies()
  const activeId = cookieStore.get("cortex_active_workspace")?.value
  const workspace = workspaces.find(w => w.id === activeId) ?? workspaces[0]

  const { data: sessions } = await supabase
    .from("chat_sessions")
    .select("id, title, updated_at")
    .eq("workspace_id", workspace.id)
    .order("updated_at", { ascending: false })

  return (
    <div
      className="flex h-screen overflow-hidden font-sans"
      style={{ background: 'var(--cx-paper)', color: 'var(--cx-ink)' }}
    >
      <ChatSidebar
        sessions={sessions ?? []}
        workspaceId={workspace.id}
        workspaceName={workspace.name}
        workspaces={workspaces}
      />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  )
}
