'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import PDFParser from "pdf2json";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function uploadDocument(formData: FormData) {
  const supabase = await createClient();
  
  const file = formData.get('file') as File;
  const workspaceId = formData.get('workspaceId') as string;

  if (!file || !workspaceId) return { error: "Missing file or workspace ID" };

  // 1. Upload to Supabase Storage
  const filePath = `${workspaceId}/${Date.now()}_${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from('synapse-uploads')
    .upload(filePath, file);

  if (uploadError) return { error: `Storage Error: ${uploadError.message}` };

  // 2. Create Database Record
  const { data: docData, error: dbError } = await supabase
    .from('documents')
    .insert({
      workspace_id: workspaceId,
      name: file.name,
      storage_path: filePath,
      file_type: file.type,
      size_bytes: file.size
    })
    .select()
    .single();

  if (dbError) return { error: `Database Error: ${dbError.message}` };

  // === AI PIPELINE START ===
  try {
    console.log("1. Starting AI Ingestion...");

    // 3. Extract Text using pdf2json
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log("2. Parsing PDF...");
    const parser = new PDFParser(undefined, true); 

    const rawText = await new Promise<string>((resolve, reject) => {
      parser.on("pdfParser_dataError", (errData: any) => reject(new Error(`PDF Parse Error: ${errData.parserError}`)));
      parser.on("pdfParser_dataReady", () => {
        resolve((parser as any).getRawTextContent());
      });
      parser.parseBuffer(buffer);
    });

    if (!rawText || rawText.trim() === "") {
      throw new Error("Parsed PDF text is empty.");
    }

    console.log("3. Chunking Text...");
    // 4. Chunk the Text
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splitDocs = await splitter.createDocuments([rawText]);

    console.log(`4. Split into ${splitDocs.length} chunks. Generating embeddings...`);

    // 5. Generate Embeddings & Save
    // gemini-embedding-001 returns 3072-dim; slice to 768 (Matryoshka truncation)
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    const chunksData = [];

    for (let i = 0; i < splitDocs.length; i++) {
      const chunk = splitDocs[i];
      const cleanContent = chunk.pageContent.replace(/\n/g, " ");

      const result = await model.embedContent(cleanContent);
      const embedding = result.embedding.values.slice(0, 768);

      chunksData.push({
        document_id: docData.id,
        content: cleanContent,
        embedding
      });
    }

    console.log("5. Saving to Supabase Vector Database...");
    // 6. Batch Insert
    const { error: vectorError } = await supabase
      .from('document_chunks')
      .insert(chunksData);

    if (vectorError) throw new Error(`Supabase Vector Error: ${vectorError.message}`);

    console.log("✅ AI Ingestion Complete.");

  } catch (err: any) {
    console.error("AI Ingestion Failed:", err);
    return { error: `AI Error: ${err.message || String(err)}` };
  }

  revalidatePath('/');
  return { success: true };
}