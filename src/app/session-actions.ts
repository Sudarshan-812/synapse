'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!)

// ── Session CRUD ───────────────────────────────────────────────────────────────

export async function createChatSession(workspaceId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("chat_sessions")
    .insert({ workspace_id: workspaceId, title: "New Chat" })
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath("/chat")
  return { session: data }
}

export async function deleteChatSession(sessionId: string) {
  const supabase = await createClient()
  await supabase.from("chat_sessions").delete().eq("id", sessionId)
  revalidatePath("/chat")
}

// ── RAG + Persist ──────────────────────────────────────────────────────────────

export async function sendMessage(
  sessionId: string,
  workspaceId: string,
  query: string
) {
  const supabase = await createClient()

  // 1. Persist user message immediately
  await supabase.from("chat_messages").insert({
    session_id: sessionId,
    role: "user",
    content: query,
  })

  try {
    // 2. Embed the query
    const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" })
    const embedResult = await embeddingModel.embedContent(query)
    const queryEmbedding = embedResult.embedding.values.slice(0, 768)

    // 3. Vector search
    const { data: chunks, error: searchError } = await supabase.rpc("match_documents", {
      query_embedding: queryEmbedding,
      match_threshold: 0.5,
      match_count: 5,
      filter_workspace_id: workspaceId,
    })

    if (searchError) throw new Error(searchError.message)

    // 4. Enrich chunks with document names for citations
    let sources: any[] = []
    if (chunks && chunks.length > 0) {
      const chunkIds = chunks.map((c: any) => c.id)
      const { data: chunkDetails } = await supabase
        .from("document_chunks")
        .select("id, document_id, documents(name)")
        .in("id", chunkIds)

      sources = chunks.map((chunk: any) => {
        const detail = chunkDetails?.find((d: any) => d.id === chunk.id)
        return {
          chunk_id: chunk.id,
          document_id: detail?.document_id ?? null,
          document_name: (detail?.documents as any)?.name ?? "Unknown",
          content: chunk.content,
          similarity: Math.round(chunk.similarity * 100),
        }
      })
    }

    // 5. Build context window
    const contextText = sources.map((s) => s.content).join("\n\n")

    // 6. Generate answer
    let answer = "I couldn't find any relevant information in your uploaded documents."

    if (contextText) {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      const prompt = `You are a helpful AI assistant for Synapse, a document intelligence platform.
Answer the user's question using ONLY the context provided below.
If the answer is not in the context, say: "I don't have that information in the uploaded documents."
Be concise, clear, and accurate.

Context:
${contextText}

Question: ${query}

Answer:`

      const result = await model.generateContent(prompt)
      answer = result.response.text()
    }

    // 7. Persist assistant message with sources
    await supabase.from("chat_messages").insert({
      session_id: sessionId,
      role: "assistant",
      content: answer,
      sources,
    })

    // 8. Auto-title session from first user message
    const { count } = await supabase
      .from("chat_messages")
      .select("*", { count: "exact", head: true })
      .eq("session_id", sessionId)

    if (count !== null && count <= 2) {
      const title = query.length > 52 ? query.slice(0, 49) + "..." : query
      await supabase
        .from("chat_sessions")
        .update({ title })
        .eq("id", sessionId)
    } else {
      // Touch updated_at so it floats to top of sidebar
      await supabase
        .from("chat_sessions")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", sessionId)
    }

    revalidatePath(`/chat/${sessionId}`)
    return { answer, sources }
  } catch (err: any) {
    const errorMsg = `Error: ${err.message ?? "Something went wrong."}`
    await supabase.from("chat_messages").insert({
      session_id: sessionId,
      role: "assistant",
      content: errorMsg,
      sources: [],
    })
    return { error: errorMsg }
  }
}
