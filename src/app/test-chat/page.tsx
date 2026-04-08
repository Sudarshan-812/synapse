import { redirect } from "next/navigation"

// Replaced by the proper /chat page
export default function TestPage() {
  redirect("/chat")
}
