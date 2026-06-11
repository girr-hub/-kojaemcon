'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function VideoUploader({
  value, onChange,
}: { value: string | null; onChange: (url: string | null) => void }) {
  const [busy, setBusy] = useState(false)

  const upload = async (file: File) => {
    if (file.size > 200 * 1024 * 1024) { alert('Max 200MB'); return }
    setBusy(true)
    const sb = supabase()
    const path = `${crypto.randomUUID()}.${file.name.split('.').pop()}`
    const { error } = await sb.storage.from('event-videos').upload(path, file, {
      contentType: file.type, cacheControl: '31536000',
    })
    if (error) { alert(error.message); setBusy(false); return }
    const { data } = sb.storage.from('event-videos').getPublicUrl(path)
    onChange(data.publicUrl)
    setBusy(false)
  }

  return (
    <div className="space-y-2">
      {value && (
        <div className="relative aspect-video bg-surface">
          <video src={value} controls className="w-full h-full object-contain"/>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 bg-bg/80 text-red-400 px-3 py-1 sub-en text-xs uppercase"
          >
            Remove
          </button>
        </div>
      )}
      {!value && (
        <label className="flex items-center justify-center border-2 border-dashed border-ink/20 aspect-video cursor-pointer hover:border-primary text-ink/40 sub-en uppercase text-sm tracking-wider">
          <input
            type="file"
            accept="video/*"
            hidden
            disabled={busy}
            onChange={e => e.target.files?.[0] && upload(e.target.files[0])}
          />
          {busy ? 'Uploading…' : '+ Upload video'}
        </label>
      )}
      <p className="sub-en text-xs text-ink/40">MP4/MOV · max 200MB · official events only</p>
    </div>
  )
}
