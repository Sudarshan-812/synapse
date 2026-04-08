import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Bot } from "lucide-react"

export default async function ChatIndexPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("id")
    .eq("owner_id", user.id)
    .single()

  if (!workspace) redirect("/")

  // Auto-redirect to the most recent session if one exists
  const { data: latest } = await supabase
    .from("chat_sessions")
    .select("id")
    .eq("workspace_id", workspace.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (latest) redirect(`/chat/${latest.id}`)

  // No sessions yet → empty state
  return (
    <div className="flex flex-col items-center justify-center h-full bg-zinc-50 gap-4">
      <div className="bg-blue-50 p-5 rounded-full">
        <Bot className="h-10 w-10 text-blue-500" />
      </div>
      <div className="text-center">
        <p className="text-base font-semibold text-zinc-700">No chats yet</p>
        <p className="text-sm text-zinc-400 mt-1">
          Click <span className="font-medium text-zinc-600">New Chat</span> in the sidebar to get started.
        </p>
      </div>
    </div>
  )
}
