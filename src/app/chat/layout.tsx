import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { ChatSidebar } from "@/components/chat-sidebar"

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("id, name")
    .eq("owner_id", user.id)
    .single()

  if (!workspace) redirect("/")

  const { data: sessions } = await supabase
    .from("chat_sessions")
    .select("id, title, updated_at")
    .eq("workspace_id", workspace.id)
    .order("updated_at", { ascending: false })

  return (
    <div className="flex h-screen overflow-hidden">
      <ChatSidebar
        sessions={sessions ?? []}
        workspaceId={workspace.id}
        workspaceName={workspace.name}
      />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  )
}
