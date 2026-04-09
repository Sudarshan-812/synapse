import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function ReportLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const ownerEmail = process.env.REPORT_OWNER_EMAIL
  if (ownerEmail && user.email !== ownerEmail) redirect("/dashboard")

  return <>{children}</>
}
