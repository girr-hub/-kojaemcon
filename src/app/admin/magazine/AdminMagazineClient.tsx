'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

const CATS = [
  { id: 'notice', label: '📢 공지사항' },
  { id: 'newsletter', label: '📮 뉴스레터' },
  { id: 'update', label: '🔔 업데이트' },
]

export default function AdminMagazineClient({ posts: initial }: { posts: any[] }) {
  const [posts, setPosts] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: '', slug: '', category: 'notice', summary: '', content_html: '', cover_image_url: '', is_published: false })

  const openNew = () => {
    setEditing(null)
    setForm({ title: '', slug: '', category: 'notice', summary: '', content_html: '', cover_image_url: '', is_published: false })
    setShowForm(true)
  }

  const openEdit = (post: any) => {
    setEditing(post)
    setForm({ title: post.title, slug: post.slug, category: post.category, summary: post.summary || '', content_html: post.content_html || '', cover_image_url: post.cover_image_url || '', is_published: post.is_published })
    setShowForm(true)
  }

  const autoSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9가-힣]/g, '-').replace(/-+/g, '-').slice(0, 60)

  const save = async () => {
    if (!form.title) { alert('제목을 입력해주세요'); return }
    setSaving(true)
    const sb = supabase()
    const payload = {
      ...form,
      slug: form.slug || autoSlug(form.title),
      published_at: form.is_published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }

    if (editing) {
      const { error } = await sb.from('magazine_posts').update(payload).eq('id', editing.id)
      if (!error) setPosts(prev => prev.map(p => p.id === editing.id ? { ...p, ...payload } : p))
      else alert('저장 실패: ' + error.message)
    } else {
      const { data, error } = await sb.from('magazine_posts').insert(payload).select().single()
      if (!error && data) setPosts(prev => [data, ...prev])
      else alert('저장 실패: ' + (error?.message || ''))
    }
    setSaving(false)
    setShowForm(false)
  }

  const togglePublish = async (post: any) => {
    const sb = supabase()
    const updated = { is_published: !post.is_published, published_at: !post.is_published ? new Date().toISOString() : null }
    await sb.from('magazine_posts').update(updated).eq('id', post.id)
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, ...updated } : p))
  }

  const deletePost = async (id: string) => {
    if (!confirm('삭제하시겠어요?')) return
    const sb = supabase()
    await sb.from('magazine_posts').delete().eq('id', id)
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 28, letterSpacing: '-0.04em', color: '#0A0A0A' }}>Magazine</h1>
        <button onClick={openNew} className="btn-primary" style={{ padding: '10px 20px' }}>+ 새 글 작성</button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background: '#F8F8F6', border: '1.5px solid #E8E8E4', borderRadius: 16, padding: 28, marginBottom: 28 }}>
          <h2 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 18, color: '#0A0A0A', marginBottom: 20 }}>
            {editing ? '글 수정' : '새 글 작성'}
          </h2>

          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {CATS.map(c => (
              <button key={c.id} type="button" onClick={() => setForm(f => ({ ...f, category: c.id }))}
                style={{ padding: '6px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  background: form.category === c.id ? '#0A0A0A' : '#fff',
                  color: form.category === c.id ? '#fff' : '#6B6B6B',
                  border: form.category === c.id ? '1.5px solid #0A0A0A' : '1.5px solid #E8E8E4' }}>
                {c.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input className="input-base" placeholder="제목 *" value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: autoSlug(e.target.value) }))} />
            <input className="input-base" placeholder="슬러그 (자동생성)" value={form.slug}
              onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
            <input className="input-base" placeholder="커버 이미지 URL" value={form.cover_image_url}
              onChange={e => setForm(f => ({ ...f, cover_image_url: e.target.value }))} />
            <input className="input-base" placeholder="요약문 (목록에서 표시)" value={form.summary}
              onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} />
            <textarea className="input-base" rows={10} style={{ resize: 'vertical' }}
              placeholder="본문 (HTML 가능)" value={form.content_html}
              onChange={e => setForm(f => ({ ...f, content_html: e.target.value }))} />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.is_published}
                onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))} />
              즉시 게시
            </label>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button onClick={save} disabled={saving} className="btn-primary" style={{ padding: '11px 24px' }}>
              {saving ? '저장 중...' : '저장'}
            </button>
            <button onClick={() => setShowForm(false)} className="btn-outline" style={{ padding: '11px 20px' }}>취소</button>
          </div>
        </div>
      )}

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {posts.map(post => (
          <div key={post.id} style={{ background: '#fff', border: '1.5px solid #E8E8E4', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            {post.cover_image_url && (
              <img src={post.cover_image_url} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} alt="" />
            )}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9A9A9A' }}>{post.category}</span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100,
                  background: post.is_published ? '#dcfce7' : '#F8F8F6',
                  color: post.is_published ? '#15803d' : '#9A9A9A' }}>
                  {post.is_published ? '게시됨' : '초안'}
                </span>
              </div>
              <p style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 15, color: '#0A0A0A', marginBottom: 2 }}>{post.title}</p>
              <p style={{ fontSize: 11, color: '#9A9A9A' }}>{new Date(post.created_at).toLocaleDateString()}</p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button onClick={() => togglePublish(post)}
                style={{ padding: '7px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: '1.5px solid #E8E8E4', background: '#F8F8F6', color: '#0A0A0A' }}>
                {post.is_published ? '비공개' : '게시'}
              </button>
              <button onClick={() => openEdit(post)}
                style={{ padding: '7px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: '1.5px solid #0A0A0A', background: '#0A0A0A', color: '#fff' }}>
                수정
              </button>
              <button onClick={() => deletePost(post.id)}
                style={{ padding: '7px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: '1.5px solid #dc2626', background: '#fff', color: '#dc2626' }}>
                삭제
              </button>
            </div>
          </div>
        ))}
        {posts.length === 0 && <p style={{ fontSize: 14, color: '#9A9A9A', textAlign: 'center', padding: '40px 0' }}>아직 작성된 글이 없어요</p>}
      </div>
    </div>
  )
}
