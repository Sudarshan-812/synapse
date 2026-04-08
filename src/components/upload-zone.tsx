'use client'

import { useState } from 'react'
import { UploadCloud, Loader2, CheckCircle } from 'lucide-react'
import { uploadDocument } from '@/app/actions'
import { Button } from '@/components/ui/button'

const ACCEPTED = ".pdf,.docx,.doc,.txt,.md,.csv"
const ACCEPTED_LABEL = "PDF, DOCX, TXT, MD, CSV"

export function UploadZone({ workspaceId }: { workspaceId: string }) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setStatus('uploading')
    setErrorMsg('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('workspaceId', workspaceId)

    const result = await uploadDocument(formData)

    if (result?.error) {
      setErrorMsg(result.error)
      setStatus('error')
    } else {
      setStatus('done')
      setTimeout(() => setStatus('idle'), 3000)
    }

    e.target.value = ''
  }

  const uploading = status === 'uploading'

  return (
    <div className="border-2 border-dashed border-zinc-200 rounded-xl p-10 flex flex-col items-center justify-center bg-zinc-50/50 hover:bg-zinc-50 transition-colors relative">
      <input
        type="file"
        accept={ACCEPTED}
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        disabled={uploading}
      />

      <div className="bg-white p-4 rounded-full shadow-sm mb-4">
        {uploading ? (
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        ) : status === 'done' ? (
          <CheckCircle className="h-8 w-8 text-green-500" />
        ) : (
          <UploadCloud className="h-8 w-8 text-blue-500" />
        )}
      </div>

      <h3 className="text-lg font-semibold text-zinc-900">
        {uploading
          ? 'Uploading & indexing...'
          : status === 'done'
          ? 'Indexed successfully!'
          : 'Upload a Document'}
      </h3>

      <p className="text-sm text-zinc-500 mt-1 mb-4 text-center max-w-sm">
        {status === 'error'
          ? errorMsg
          : `Drag and drop or click to browse. Supports ${ACCEPTED_LABEL}.`}
      </p>

      {status === 'error' && (
        <p className="text-xs text-red-500 mb-3">{errorMsg}</p>
      )}

      <Button disabled={uploading} variant="outline" className="relative z-10">
        {uploading ? 'Processing...' : 'Select File'}
      </Button>
    </div>
  )
}
