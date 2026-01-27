'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadDocument(formData: FormData) {
  const supabase = await createClient();
  const file = formData.get('file') as File;
  const workspaceId = formData.get('workspaceId') as string;

  if (!file || !workspaceId) {
    return { error: "Missing file or workspace ID" };
  }

  // 1. Upload file to Supabase Storage
  // We use a timestamp to prevent name collisions
  const filePath = `${workspaceId}/${Date.now()}_${file.name}`;
  
  const { error: uploadError } = await supabase.storage
    .from('synapse-uploads') // Ensure this matches your bucket name
    .upload(filePath, file);

  if (uploadError) {
    console.error("Storage Error:", uploadError);
    return { error: "Failed to upload file to storage" };
  }

  // 2. Create Record in Database
  const { error: dbError } = await supabase
    .from('documents')
    .insert({
      workspace_id: workspaceId,
      name: file.name,
      storage_path: filePath,
      file_type: file.type,
      size_bytes: file.size
    });

  if (dbError) {
    console.error("DB Error:", dbError);
    return { error: "Failed to save document metadata" };
  }

  // 3. Refresh the UI
  revalidatePath('/');
  return { success: true };
}