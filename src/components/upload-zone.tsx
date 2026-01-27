'use client'

import { useState } from 'react'
import { UploadCloud, Loader2 } from 'lucide-react'
import { uploadDocument } from '@/app/actions'
import { Button } from '@/components/ui/button'

export function UploadZone({ workspaceId }: { workspaceId: string }) {
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert("For now, please upload PDFs only.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('workspaceId', workspaceId);

    const result = await uploadDocument(formData);

    if (result?.error) {
      alert(result.error);
    }

    setIsUploading(false);
    // Reset the input
    e.target.value = ''; 
  }

  return (
    <div className="mt-8">
      <div className="border-2 border-dashed border-zinc-200 rounded-lg p-10 flex flex-col items-center justify-center bg-zinc-50/50 hover:bg-zinc-50 transition-colors relative">
        <input 
          type="file" 
          accept=".pdf"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        
        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
          {isUploading ? (
             <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          ) : (
             <UploadCloud className="h-8 w-8 text-blue-500" />
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-zinc-900">
          {isUploading ? "Uploading & Indexing..." : "Upload a Document"}
        </h3>
        <p className="text-sm text-zinc-500 mt-1 mb-4 text-center max-w-sm">
          Drag and drop your PDF here, or click to browse. <br/>
          (Max 10MB, PDF only)
        </p>

        <Button disabled={isUploading} variant="outline">
          {isUploading ? "Processing..." : "Select PDF"}
        </Button>
      </div>
    </div>
  )
}