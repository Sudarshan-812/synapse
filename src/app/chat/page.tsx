import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { ChatInterface } from "@/components/chat-interface"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Brain } from "lucide-react"

export default async function ChatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("*")
    .eq("owner_id", user.id)
    .single()

  if (!workspace) redirect("/")

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="border-b px-6 py-4 flex items-center gap-4 flex-shrink-0 bg-white">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          <div>
            <h1 className="font-semibold text-sm">Synapse AI</h1>
            <p className="text-xs text-zinc-500">{workspace.name}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <ChatInterface workspaceId={workspace.id} />
      </div>
    </div>
  )
}
