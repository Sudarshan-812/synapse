/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { createClient } from "@/utils/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function getAnswer(query: string, workspaceId: string) {
  const supabase = await createClient();

  // 1. Embed the User's Query — same model/dim as ingestion (gemini-embedding-001 → slice 768)
  const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
  const result = await embeddingModel.embedContent(query);
  const queryEmbedding = result.embedding.values.slice(0, 768);

  // 2. Search for Similar Chunks (Vector Search)
  // This calls the postgres function we created earlier
  const { data: chunks, error } = await supabase.rpc('match_documents', {
    query_embedding: queryEmbedding,
    match_threshold: 0.5, // Similarity threshold (0-1)
    match_count: 5,       // Top 5 most relevant chunks
    filter_workspace_id: workspaceId
  });

  if (error) {
    console.error("Vector Search Error:", error);
    return { error: "Failed to search knowledge base." };
  }

  // 3. Construct the Context Window
  // Combine the top 5 chunks into one big string
  const contextText = chunks?.map((chunk: any) => chunk.content).join("\n\n") || "";

  if (!contextText) {
    return { answer: "I couldn't find any relevant information in your documents." };
  }

  // 4. Generate Answer with Gemini
  const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
  
  const prompt = `
    You are a helpful AI assistant for a specific workspace.
    Use the following pieces of context to answer the user's question.
    If the answer is not in the context, say "I don't have that information in the uploaded documents."
    
    Context:
    ${contextText}
    
    Question: ${query}
    
    Answer:
  `;

  const chatResult = await model.generateContent(prompt);
  const response = chatResult.response;
  const text = response.text();

  return { answer: text, context: chunks };
}