'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import pdf from "pdf-parse";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function uploadDocument(formData: FormData) {
  const supabase = await createClient();
  
  // 1. Validate Inputs
  const file = formData.get('file') as File;
  const workspaceId = formData.get('workspaceId') as string;

  if (!file || !workspaceId) return { error: "Missing file or workspace ID" };

  // 2. Upload to Supabase Storage (The "Physical" Copy)
  const filePath = `${workspaceId}/${Date.now()}_${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from('synapse-uploads')
    .upload(filePath, file);

  if (uploadError) return { error: "Failed to upload file to storage" };

  // 3. Create Database Record (The "Metadata" Copy)
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

  if (dbError) return { error: "Failed to save document metadata" };

  // === AI PIPELINE START ===
  try {
    console.log("Starting AI Ingestion...");

    // 4. Extract Text from PDF
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdf(buffer);
    const rawText = data.text;

    // 5. Chunk the Text
    // We use 1000 chars with 200 overlap to maintain context across boundaries
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splitDocs = await splitter.createDocuments([rawText]);

    console.log(`Split into ${splitDocs.length} chunks. Generating embeddings...`);

    // 6. Generate Embeddings & Save
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    
    // Process in batches (optional but safer for large files)
    const chunksData = [];
    
    for (const chunk of splitDocs) {
      // Clean the text (remove newlines that confuse embeddings)
      const cleanContent = chunk.pageContent.replace(/\n/g, " ");
      
      const result = await model.embedContent(cleanContent);
      const embedding = result.embedding.values;

      chunksData.push({
        document_id: docData.id,
        content: cleanContent,
        embedding: embedding 
      });
    }

    // 7. Batch Insert into Supabase
    const { error: vectorError } = await supabase
      .from('document_chunks')
      .insert(chunksData);

    if (vectorError) throw vectorError;

    console.log("AI Ingestion Complete.");

  } catch (err) {
    console.error("AI Ingestion Failed:", err);
    // Optional: Delete the document row if AI fails so we don't have "zombie" files
    return { error: "File uploaded, but AI indexing failed." };
  }
  // === AI PIPELINE END ===

  revalidatePath('/');
  return { success: true };
}