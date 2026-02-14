'use client'
import { getAnswer } from "@/app/chat-actions";
import { useState } from "react";

export default function TestPage() {
  const [answer, setAnswer] = useState("");
  
  // HARDCODE YOUR WORKSPACE ID HERE FOR TESTING
  // Get this from your Supabase 'workspaces' table
  const WORKSPACE_ID = "PASTE_YOUR_WORKSPACE_ID_HERE"; 

  async function handleTest() {
    const result = await getAnswer("What is this document about?", WORKSPACE_ID);
    if (result.answer) setAnswer(result.answer);
  }

  return (
    <div className="p-10">
      <button onClick={handleTest} className="bg-blue-500 text-white p-2 rounded">
        Test AI Brain
      </button>
      <div className="mt-4 p-4 border rounded">
        {answer || "No answer yet"}
      </div>
    </div>
  );
}