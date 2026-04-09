'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"
import { extractText, isSupportedFile } from "@/lib/parsers"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!)

export async function uploadDocument(formData: FormData) {
  const supabase = await createClient()

  const file = formData.get("file") as File
  const workspaceId = formData.get("workspaceId") as string

  if (!file || !workspaceId) return { error: "Missing file or workspace ID" }
  if (!isSupportedFile(file)) return { error: "Unsupported file type. Use PDF, DOCX, TXT, MD, or CSV." }

  const safeName = file.name
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
  const filePath = `${workspaceId}/${Date.now()}_${safeName}`
  const { error: uploadError } = await supabase.storage
    .from("synapse-uploads")
    .upload(filePath, file)

  if (uploadError) return { error: `Storage error: ${uploadError.message}` }

  const { data: docData, error: dbError } = await supabase
    .from("documents")
    .insert({
      workspace_id: workspaceId,
      name: file.name,
      storage_path: filePath,
      file_type: file.type,
      size_bytes: file.size,
    })
    .select()
    .single()

  if (dbError) return { error: `Database error: ${dbError.message}` }

  try {
    const rawText = await extractText(file)

    if (!rawText?.trim()) throw new Error("Extracted text is empty.")

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    })
    const splitDocs = await splitter.createDocuments([rawText])

    const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" })
    const chunksData = []

    for (const chunk of splitDocs) {
      const content = chunk.pageContent.replace(/\n/g, " ")
      const result = await embeddingModel.embedContent(content)
      const embedding = result.embedding.values.slice(0, 768)
      chunksData.push({ document_id: docData.id, content, embedding })
    }

    const { error: vectorError } = await supabase.from("document_chunks").insert(chunksData)
    if (vectorError) throw new Error(`Vector DB error: ${vectorError.message}`)
  } catch (err: any) {
    return { error: `Processing error: ${err.message ?? String(err)}` }
  }

  revalidatePath("/")
  return { success: true }
}
