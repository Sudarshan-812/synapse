/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { createClient } from "@/utils/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function getAnswer(query: string, workspaceId: string) {
  const supabase = await createClient();

  const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
  const result = await embeddingModel.embedContent(query);
  const queryEmbedding = result.embedding.values.slice(0, 768);

  const { data: chunks, error } = await supabase.rpc('match_documents', {
    query_embedding: queryEmbedding,
    match_threshold: 0.5,
    match_count: 5,
    filter_workspace_id: workspaceId,
  });

  if (error) return { error: "Failed to search knowledge base." };

  const contextText = chunks?.map((chunk: any) => chunk.content).join("\n\n") || "";

  if (!contextText) {
    return { answer: "I couldn't find any relevant information in your documents." };
  }

  const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

  const prompt = `You are a helpful AI assistant. Use the context below to answer the question.
If the answer is not in the context, say "I don't have that information in the uploaded documents."

Context:
${contextText}

Question: ${query}

Answer:`;

  const chatResult = await model.generateContent(prompt);
  const text = chatResult.response.text();

  return { answer: text, context: chunks };
}
