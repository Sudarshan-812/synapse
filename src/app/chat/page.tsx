import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Brain } from "lucide-react"

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
    <div className="flex flex-col items-center justify-center h-full bg-zinc-50 relative overflow-hidden">

      {/* Subtle radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_top,_#fdf4ff_0%,_transparent_70%)] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-5 text-center px-6">
        <div className="size-16 rounded-[1.25rem] bg-fuchsia-50 border border-fuchsia-100 flex items-center justify-center shadow-sm">
          <Brain className="size-8 text-fuchsia-500" />
        </div>
        <div>
          <p className="text-base font-bold text-zinc-900">No chats yet</p>
          <p className="text-sm text-zinc-400 mt-1.5 max-w-[220px] leading-relaxed">
            Click <span className="font-semibold text-zinc-700">New Chat</span> in the sidebar to get started.
          </p>
        </div>
      </div>
    </div>
  )
}
