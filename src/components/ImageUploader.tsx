'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function ImageUploader({
  value, onChange, max = 5,
}: { value: string[]; onChange: (urls: string[]) => void; max?: number }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const resize = (file: File): Promise<Blob> => new Promise((res, rej) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ratio = Math.min(1600 / img.width, 1)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(b => b ? res(b) : rej('blob fail'), 'image/webp', 0.86)
    }
    img.onerror = rej
    img.src = URL.createObjectURL(file)
  })

  const upload = async (files: FileList) => {
    setError('')
    if (value.length + files.length > max) {
      setError(`최대 ${max}장까지 업로드할 수 있어요`); return
    }
    setBusy(true)
    const sb = supabase()

    // 로그인 확인
    const { data: { user } } = await sb.auth.getUser()
    if (!user) {
      setError('로그인이 필요해요'); setBusy(false); return
    }

    const uploaded: string[] = []
    for (const file of Array.from(files)) {
      if (file.size > 10 * 1024 * 1024) {
        setError(`${file.name}이 너무 커요 (최대 10MB)`); continue
      }

      try {
        const blob = await resize(file)
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`

        const { data, error: uploadError } = await sb.storage
          .from('event-images')
          .upload(path, blob, {
            contentType: 'image/webp',
            cacheControl: '31536000',
            upsert: false,
          })

        if (uploadError) {
          console.error('Upload error:', uploadError)
          setError(`업로드 실패: ${uploadError.message}`)
          continue
        }

        const { data: { publicUrl } } = sb.storage
          .from('event-images')
          .getPublicUrl(data.path)

        uploaded.push(publicUrl)
      } catch (e) {
        console.error(e)
        setError('이미지 처리 중 오류가 발생했어요')
      }
    }

    onChange([...value, ...uploaded])
    setBusy(false)
  }

  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i))
  const setMain = (i: number) => {
    const next = [...value]; const [m] = next.splice(i, 1); next.unshift(m)
    onChange(next)
  }

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {value.map((url, i) => (
          <div key={url} className="relative aspect-square bg-surface group">
            <img src={url} className="w-full h-full object-cover"/>
            {i === 0 && (
              <span className="absolute top-1 left-1 bg-primary text-bg px-2 py-0.5 text-[10px] sub-en font-bold">MAIN</span>
            )}
            <div className="absolute inset-0 bg-bg/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition">
              {i !== 0 && (
                <button type="button" onClick={() => setMain(i)}
                        className="text-xs text-primary sub-en uppercase bg-bg/80 px-2 py-1">
                  Set main
                </button>
              )}
              <button type="button" onClick={() => remove(i)}
                      className="text-xs text-red-400 sub-en uppercase bg-bg/80 px-2 py-1">
                Remove
              </button>
            </div>
          </div>
        ))}

        {value.length < max && (
          <label className={`aspect-square border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition text-ink/60
            ${busy ? 'border-primary/50 opacity-50 cursor-not-allowed' : 'border-ink/20 hover:border-primary hover:text-primary'}`}>
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              disabled={busy}
              onChange={e => e.target.files && upload(e.target.files)}
            />
            {busy ? (
              <>
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2"/>
                <span className="sub-en text-xs">Uploading...</span>
              </>
            ) : (
              <>
                <span className="text-3xl mb-1">+</span>
                <span className="sub-en text-xs uppercase">Add photo</span>
              </>
            )}
          </label>
        )}
      </div>

      {error && (
        <p className="text-red-400 sub-en text-xs mt-2">{error}</p>
      )}

      <p className="sub-en text-xs text-ink/40 mt-2">
        JPG · PNG · WEBP · 최대 {max}장 · 장당 10MB · 자동으로 WebP로 변환돼요
      </p>
    </div>
  )
}
