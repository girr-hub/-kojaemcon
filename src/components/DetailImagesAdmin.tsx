'use client'
import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'

const MAX_IMAGES = 4

const SPECS = [
  { label: '전체 규격', value: '가로 1125px × 세로 최대 4000px' },
  { label: '썸네일', value: '1029 × 1029px' },
  { label: '텍스트 영역', value: '가운데 378px 이내' },
  { label: '자동 표시', value: '출발 시각 + 이벤트 제목 (하단)' },
]

export default function DetailImagesAdmin({ eventId, eventSlug, initialImages }: {
  eventId: string
  eventSlug: string
  initialImages?: string[]
}) {
  const [images, setImages] = useState<string[]>(initialImages ?? [])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    const remaining = MAX_IMAGES - images.length
    const toUpload = files.slice(0, remaining)

    setUploading(true)
    const sb = supabase()
    const newUrls: string[] = []

    for (const file of toUpload) {
      const ext = file.name.split('.').pop()
      const path = `events/${eventId}/detail/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await sb.storage.from('event-images').upload(path, file, { upsert: true })
      if (!error) {
        const { data: pub } = sb.storage.from('event-images').getPublicUrl(path)
        newUrls.push(pub.publicUrl)
      }
    }

    setImages(prev => [...prev, ...newUrls].slice(0, MAX_IMAGES))
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx))
  }

  const moveImage = (from: number, to: number) => {
    const arr = [...images]
    const [item] = arr.splice(from, 1)
    arr.splice(to, 0, item)
    setImages(arr)
  }

  const save = async () => {
    setSaving(true)
    const sb = supabase()
    const { error } = await sb.from('events').update({ detail_images: images }).eq('id', eventId)
    setSaving(false)
    if (!error) { setSaved(true); setTimeout(() => setSaved(false), 2500) }
    else alert('Save failed: ' + error.message)
  }

  return (
    <div style={{ background: '#fff', border: '1.5px solid #E8E8E4', borderRadius: 16, padding: 24, marginTop: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h3 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 16, color: '#0A0A0A', marginBottom: 4 }}>
            상세 페이지 이미지
          </h3>
          <p style={{ fontSize: 12, color: '#9A9A9A' }}>최대 4장 · KOGEMCON 공식 이벤트 전용</p>
        </div>
        <span style={{ background: '#E9C000', color: '#0A0A0A', fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 100, letterSpacing: '0.08em' }}>
          ADMIN ONLY
        </span>
      </div>

      {/* 규격 안내 */}
      <div style={{ background: '#F8F8F6', border: '1px solid #E8E8E4', borderRadius: 12, padding: 16, marginBottom: 20 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#0A0A0A', marginBottom: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>이미지 규격 안내</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' }}>
          {SPECS.map(s => (
            <div key={s.label}>
              <span style={{ fontSize: 10, color: '#9A9A9A', fontWeight: 600 }}>{s.label}: </span>
              <span style={{ fontSize: 11, color: '#3A3A3A', fontWeight: 700 }}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* 썸네일 규격 시각화 */}
        <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: 120, height: 120, background: '#E8E8E4', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #C4C4C0' }}>
            {/* 가운데 텍스트 영역 표시 */}
            <div style={{
              position: 'absolute',
              left: '50%', top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '44%', height: '100%',
              border: '1.5px dashed #E9C000',
              borderRadius: 4,
            }} />
            <div style={{ position: 'absolute', bottom: 8, left: 0, right: 0, textAlign: 'center' }}>
              <div style={{ fontSize: 7, color: '#6B6B6B', lineHeight: 1.4 }}>시간 + 제목</div>
            </div>
            <span style={{ fontSize: 8, color: '#9A9A9A', textAlign: 'center', lineHeight: 1.3, zIndex: 1 }}>
              1029×1029<br/>썸네일
            </span>
          </div>
        </div>
      </div>

      {/* 이미지 그리드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 16 }}>
        {images.map((url, i) => (
          <div key={url} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: '1.5px solid #E8E8E4' }}>
            <img src={url} alt={`detail-${i}`} style={{ width: '100%', aspectRatio: '1125/2000', objectFit: 'cover', display: 'block' }} />
            {/* 순서 배지 */}
            <div style={{ position: 'absolute', top: 6, left: 6, background: '#0A0A0A', color: '#fff', borderRadius: 100, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>
              {i + 1}
            </div>
            {/* 삭제 버튼 */}
            <button onClick={() => removeImage(i)} style={{ position: 'absolute', top: 6, right: 6, background: '#dc2626', color: '#fff', border: 'none', borderRadius: 100, width: 20, height: 20, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>×</button>
            {/* 순서 이동 */}
            <div style={{ position: 'absolute', bottom: 6, right: 6, display: 'flex', gap: 4 }}>
              {i > 0 && <button onClick={() => moveImage(i, i - 1)} style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: 100, width: 20, height: 20, cursor: 'pointer', fontSize: 10 }}>←</button>}
              {i < images.length - 1 && <button onClick={() => moveImage(i, i + 1)} style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: 100, width: 20, height: 20, cursor: 'pointer', fontSize: 10 }}>→</button>}
            </div>
          </div>
        ))}

        {/* 업로드 슬롯 */}
        {images.length < MAX_IMAGES && (
          <button onClick={() => inputRef.current?.click()} disabled={uploading}
            style={{
              borderRadius: 10, border: '2px dashed #E8E8E4', background: '#F8F8F6',
              aspectRatio: '1125/2000', cursor: 'pointer', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 8, color: '#9A9A9A',
            }}>
            <span style={{ fontSize: 28 }}>{uploading ? '⏳' : '+'}</span>
            <span style={{ fontSize: 11, fontFamily: 'Inter', fontWeight: 600 }}>
              {uploading ? '업로드 중...' : `이미지 추가 (${images.length}/${MAX_IMAGES})`}
            </span>
          </button>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleUpload} style={{ display: 'none' }} />

      {/* 저장 */}
      <button onClick={save} disabled={saving || images.length === 0}
        style={{
          width: '100%', background: '#0A0A0A', color: '#E9C000',
          border: 'none', borderRadius: 100, padding: '13px',
          fontFamily: 'Inter', fontWeight: 700, fontSize: 14, cursor: 'pointer',
          opacity: (saving || images.length === 0) ? 0.5 : 1,
        }}>
        {saving ? '저장 중...' : saved ? '✓ 저장 완료!' : `상세 이미지 저장 (${images.length}장)`}
      </button>
    </div>
  )
}
