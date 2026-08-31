'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function NewExperiencePage() {
  const router = useRouter()
  const [form, setForm] = useState({ title: '', description: '', location: '', capacity: 10, available_dates: '', starts_at: '' })
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (images.length + files.length > 10) { alert('최대 10장까지 업로드 가능해요'); return }
    setUploading(true)
    const sb = supabase()
    const urls: string[] = []
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `experience_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
      await sb.storage.from('event-images').upload(path, file, { upsert: true })
      const { data } = sb.storage.from('event-images').getPublicUrl(path)
      urls.push(data.publicUrl)
    }
    setImages(prev => [...prev, ...urls])
    setUploading(false)
  }

  const submit = async () => {
    if (!form.title) { alert('제목을 입력해주세요'); return }
    setSaving(true)
    const dates = form.available_dates.split(',').map(d => d.trim()).filter(Boolean)
    const res = await fetch('/api/experience', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'create', ...form, images, available_dates: dates, starts_at: form.starts_at || null })
    }).then(r => r.json())
    setSaving(false)
    if (res.ok) router.push('/experience')
    else alert(res.error)
  }

  const inputStyle: any = { width: '100%', padding: '11px 12px', borderRadius: 10, border: '1.5px solid #E8E8E8', fontSize: 14, fontFamily: 'PretendardVariable, Pretendard, sans-serif', outline: 'none', boxSizing: 'border-box' }
  const labelStyle: any = { fontSize: 12, fontWeight: 700, color: '#6B6B6B', display: 'block', marginBottom: 6 }

  return (
    <div style={{ background: '#F5F5F5', minHeight: '100vh', paddingBottom: 100 }}>
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #F0F0F0', padding: '14px 16px' }}>
        <h1 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, fontSize: 20, color: '#1A1A1A', letterSpacing: '-0.04em' }}>체험단 모집 등록</h1>
        <p style={{ fontSize: 13, color: '#999', marginTop: 2 }}>외국인 체험단을 모집해보세요</p>
      </div>

      <div style={{ background: '#FFFFFF', marginTop: 8, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* 이미지 업로드 */}
        <div>
          <label style={labelStyle}>사진 ({images.length}/10)</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
            {images.map((url, i) => (
              <div key={i} style={{ position: 'relative', width: 80, height: 80 }}>
                <img src={url} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} alt="" />
                <button onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                  style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: '#DC2626', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>
            ))}
            {images.length < 10 && (
              <label style={{ width: 80, height: 80, borderRadius: 8, border: '1.5px dashed #D0D0D0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 24, color: '#9A9A9A' }}>+</span>
                <span style={{ fontSize: 10, color: '#9A9A9A' }}>{uploading ? '...' : '사진추가'}</span>
                <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleImages} disabled={uploading} />
              </label>
            )}
          </div>
        </div>

        <div>
          <label style={labelStyle}>제목 *</label>
          <input style={inputStyle} value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="체험단 모집 제목" />
        </div>

        <div>
          <label style={labelStyle}>설명</label>
          <textarea style={{...inputStyle, resize: 'none'}} rows={5} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="체험 내용, 혜택, 조건 등을 자세히 작성해주세요" />
        </div>

        <div>
          <label style={labelStyle}>장소</label>
          <input style={inputStyle} value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="서울 강남구 / 전국 어디서나 등" />
        </div>

        <div>
          <label style={labelStyle}>체험 가능 날짜 (쉼표로 구분)</label>
          <input style={inputStyle} value={form.available_dates} onChange={e => setForm({...form, available_dates: e.target.value})} placeholder="예: 9월 15일, 9월 22일, 주말 협의 가능" />
        </div>

        <div>
          <label style={labelStyle}>체험 시작일</label>
          <input style={inputStyle} type="datetime-local" value={form.starts_at} onChange={e => setForm({...form, starts_at: e.target.value})} />
        </div>
        <div>
          <label style={labelStyle}>모집 인원</label>
          <input style={inputStyle} type="number" min="1" value={form.capacity} onChange={e => setForm({...form, capacity: Number(e.target.value)})} />
        </div>

        <button onClick={submit} disabled={saving || uploading}
          style={{ width: '100%', padding: '14px', borderRadius: 12, background: '#1A1A1A', color: '#E9C000', border: 'none', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'PretendardVariable, Pretendard, sans-serif', opacity: (saving || uploading) ? 0.6 : 1 }}>
          {saving ? '등록 중...' : '체험단 모집 등록'}
        </button>
      </div>
    </div>
  )
}
