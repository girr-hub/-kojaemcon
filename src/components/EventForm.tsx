'use client'
import { useState } from 'react'
import ImageUploader from './ImageUploader'
import VideoUploader from './VideoUploader'
import HtmlEditor from './HtmlEditor'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Mode = 'host' | 'admin'

export default function EventForm({ mode, initial }: { mode: Mode; initial?: any }) {
  const r = useRouter()
  const [f, setF] = useState({
    title: initial?.title ?? '',
    summary: initial?.summary ?? '',
    category: initial?.category ?? 'party',
    description_html: initial?.description_html ?? '',
    detail_page_html: initial?.detail_page_html ?? '',
    detail_video_url: initial?.detail_video_url ?? null,
    starts_at: initial?.starts_at?.slice(0, 16) ?? '',
    ends_at: initial?.ends_at?.slice(0, 16) ?? '',
    venue_name: initial?.venue_name ?? '',
    venue_address: initial?.venue_address ?? '',
    is_free: initial?.is_free ?? true,
    price_krw: initial?.price_krw ?? 0,
    capacity: initial?.capacity ?? 20,
    images: (initial?.images as string[]) ?? [],
    source: initial?.source ?? (mode === 'admin' ? 'official' : 'host'),
    status: initial?.status ?? 'draft',
  })

  const submit = async (publish: boolean) => {
    if (f.images.length === 0) { alert('At least 1 image required'); return }
    const sb = supabase()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) { alert('Login required'); return }

    const slug = (f.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'event')
                 + '-' + Date.now().toString(36)

    const payload: any = {
      ...f,
      slug: initial?.slug ?? slug,
      cover_image_url: f.images[0],
      host_id: user.id,
      status: publish ? 'published' : 'draft',
      price_krw: f.is_free ? 0 : Number(f.price_krw),
    }
    // host는 official 전용 필드 못 씀
    if (mode === 'host') { payload.source = 'host'; delete payload.detail_page_html; delete payload.detail_video_url }

    const q = initial
      ? sb.from('events').update(payload).eq('id', initial.id)
      : sb.from('events').insert(payload)
    const { error } = await q
    if (error) { alert(error.message); return }
    r.push(mode === 'admin' ? '/admin/events' : '/my')
  }

  const input = "w-full bg-surface border border-ink/10 text-ink px-4 py-3 outline-none focus:border-primary sub-en"
  const label = "sub-en uppercase text-xs text-ink/60 tracking-wider mb-2 block"

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <h1 className="headline-en text-5xl uppercase">{initial ? 'Edit' : 'New'} Event</h1>

      <div><label className={label}>Title</label>
        <input className={input} value={f.title} onChange={e=>setF({...f, title:e.target.value})}/></div>

      <div><label className={label}>Summary (1-2 lines)</label>
        <input className={input} value={f.summary} onChange={e=>setF({...f, summary:e.target.value})}/></div>

      <div><label className={label}>Category</label>
        <select className={input} value={f.category} onChange={e=>setF({...f, category:e.target.value})}>
          {['party','tour','language-exchange','workshop','food','culture','sports','other'].map(c=>
            <option key={c} value={c}>{c}</option>)}
        </select></div>

      <div><label className={label}>Images (max 5, first = main)</label>
        <ImageUploader value={f.images} onChange={imgs=>setF({...f, images:imgs})}/></div>

      <div><label className={label}>Description (HTML allowed)</label>
        <HtmlEditor value={f.description_html} onChange={h=>setF({...f, description_html:h})}/></div>

      {mode === 'admin' && (
        <>
          <div><label className={label}>Source</label>
            <select className={input} value={f.source} onChange={e=>setF({...f, source:e.target.value as any})}>
              <option value="official">KOJAEMCON PRESENTS</option>
              <option value="host">Host-launched</option>
            </select></div>

          {f.source === 'official' && (
            <>
              <div><label className={label}>Detail Page (full-width HTML)</label>
                <HtmlEditor value={f.detail_page_html} onChange={h=>setF({...f, detail_page_html:h})}/></div>
              <div><label className={label}>Detail Video</label>
                <VideoUploader value={f.detail_video_url} onChange={v=>setF({...f, detail_video_url:v})}/></div>
            </>
          )}
        </>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div><label className={label}>Starts at</label>
          <input className={input} type="datetime-local" value={f.starts_at} onChange={e=>setF({...f, starts_at:e.target.value})}/></div>
        <div><label className={label}>Ends at</label>
          <input className={input} type="datetime-local" value={f.ends_at} onChange={e=>setF({...f, ends_at:e.target.value})}/></div>
      </div>

      <div><label className={label}>Venue</label>
        <input className={input} placeholder="Venue name" value={f.venue_name} onChange={e=>setF({...f, venue_name:e.target.value})}/>
        <input className={input + ' mt-2'} placeholder="Address" value={f.venue_address} onChange={e=>setF({...f, venue_address:e.target.value})}/></div>

      <div className="grid grid-cols-3 gap-4 items-end">
        <label className="flex items-center gap-2 sub-en">
          <input type="checkbox" checked={f.is_free} onChange={e=>setF({...f, is_free:e.target.checked})}/>
          Free event
        </label>
        <div><label className={label}>Price (KRW)</label>
          <input className={input} type="number" disabled={f.is_free} value={f.price_krw}
                 onChange={e=>setF({...f, price_krw:Number(e.target.value)})}/></div>
        <div><label className={label}>Capacity</label>
          <input className={input} type="number" min={1} value={f.capacity}
                 onChange={e=>setF({...f, capacity:Number(e.target.value)})}/></div>
      </div>

      {/* 어드민 전용 상세 이미지 업로드 */}
      {mode === 'admin' && (
        <div style={{ borderTop: '1px solid #E8E8E4', paddingTop: 24, marginTop: 8 }}>
          <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9A9A9A', display: 'block', marginBottom: 12 }}>
            상세 페이지 이미지 (최대 4장 · 1125×4000px)
          </label>
          <div style={{ background: '#F8F8F6', border: '1.5px dashed #E8E8E4', borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: '#9A9A9A', marginBottom: 10, lineHeight: 1.6 }}>
              📐 규격: 가로 <strong>1125px</strong> × 세로 최대 <strong>4000px</strong><br/>
              🖼 썸네일: <strong>1029×1029px</strong> (가운데 378px 안에 텍스트)<br/>
              ⚠️ 이미지당 최대 5MB, JPG/PNG/WebP
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={async (e) => {
                const files = Array.from(e.target.files ?? [])
                if (!files.length) return
                const { createBrowserClient } = await import('@supabase/ssr')
                const sb = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
                const urls: string[] = []
                for (const file of files.slice(0, 4)) {
                  const path = `events/detail/${Date.now()}-${Math.random().toString(36).slice(2)}.${file.name.split('.').pop()}`
                  const { error } = await sb.storage.from('event-images').upload(path, file, { upsert: true })
                  if (!error) {
                    const { data: pub } = sb.storage.from('event-images').getPublicUrl(path)
                    urls.push(pub.publicUrl)
                  }
                }
                setF((prev: any) => ({ ...prev, detail_images: [...(prev.detail_images ?? []), ...urls].slice(0, 4) }))
                e.target.value = ''
              }}
              style={{ fontSize: 13 }}
            />
          </div>
          {f.detail_images?.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {f.detail_images.map((url: string, i: number) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img src={url} style={{ width: '100%', aspectRatio: '1125/2000', objectFit: 'cover', borderRadius: 8, border: '1px solid #E8E8E4' }} alt="" />
                  <button type="button"
                    onClick={() => setF((prev: any) => ({ ...prev, detail_images: prev.detail_images.filter((_: any, j: number) => j !== i) }))}
                    style={{ position: 'absolute', top: 4, right: 4, background: '#dc2626', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    ×
                  </button>
                  <div style={{ position: 'absolute', top: 4, left: 4, background: '#0A0A0A', color: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>
                    {i + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3 pt-6 border-t border-ink/10">
        <button onClick={()=>submit(false)} className="border border-ink/30 px-6 py-3 sub-en uppercase">
          Save draft
        </button>
        <button onClick={()=>submit(true)} className="bg-primary text-bg px-6 py-3 sub-en uppercase font-bold">
          {mode === 'admin' ? 'Publish' : 'Submit for review'}
        </button>
      </div>
    </div>
  )
}
