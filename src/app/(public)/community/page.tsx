'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

const CATEGORIES = ['All', 'General', 'Events', 'Tips', 'Language', 'Housing', 'Work', 'Food', 'Question']

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [cat, setCat] = useState('All')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', category: 'General' })
  const [posting, setPosting] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase().auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  useEffect(() => { loadPosts() }, [cat])

  const loadPosts = async () => {
    setLoading(true)
    const sb = supabase()
    let q = sb.from('posts')
      .select('*, profiles(display_name, avatar_url, nationality), post_comments(count), post_likes(count)')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(50)
    if (cat !== 'All') q = q.eq('category', cat)
    const { data } = await q
    setPosts(data ?? [])
    setLoading(false)
  }

  const submitPost = async () => {
    if (!form.title.trim() || !form.content.trim()) { alert('Fill in title and content'); return }
    if (!user) { alert('Please log in first'); return }
    setPosting(true)
    const { error } = await supabase().from('posts').insert({ author_id: user.id, ...form })
    setPosting(false)
    if (!error) { setForm({ title: '', content: '', category: 'General' }); setShowForm(false); loadPosts() }
    else alert('Error: ' + error.message)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '100px 24px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="eyebrow">Community</div>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 'clamp(36px,6vw,52px)', letterSpacing: '-0.055em', color: '#0A0A0A', lineHeight: 0.9 }}>Board</h1>
            <p style={{ fontSize: 14, color: '#6B6B6B', marginTop: 8 }}>Share tips, ask questions, connect.</p>
          </div>
          <button onClick={() => { if (!user) { alert('Please log in'); return } setShowForm(!showForm) }}
            className="btn-primary" style={{ padding: '10px 22px' }}>
            {showForm ? '✕ Cancel' : '+ Write'}
          </button>
        </div>

        {showForm && (
          <div style={{ background: '#F8F8F6', border: '1.5px solid #E8E8E4', borderRadius: 16, padding: 24, marginBottom: 28 }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
              {CATEGORIES.filter(c => c !== 'All').map(c => (
                <button key={c} type="button" onClick={() => setForm(f => ({ ...f, category: c }))}
                  style={{ padding: '5px 12px', borderRadius: 100, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                    background: form.category === c ? '#0A0A0A' : '#fff', color: form.category === c ? '#fff' : '#6B6B6B',
                    border: form.category === c ? '1.5px solid #0A0A0A' : '1.5px solid #E8E8E4' }}>
                  {c}
                </button>
              ))}
            </div>
            <input className="input-base" placeholder="Title *" style={{ marginBottom: 10 }}
              value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            <textarea className="input-base" rows={5} style={{ resize: 'none', marginBottom: 14 }}
              placeholder="What's on your mind?" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />
            <button onClick={submitPost} disabled={posting} className="btn-primary" style={{ padding: '10px 24px' }}>
              {posting ? 'Posting...' : 'Post'}
            </button>
          </div>
        )}

        <div style={{ display: 'flex', gap: 6, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{ padding: '7px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0,
                background: cat === c ? '#0A0A0A' : '#F8F8F6', color: cat === c ? '#fff' : '#6B6B6B',
                border: cat === c ? '1.5px solid #0A0A0A' : '1.5px solid #E8E8E4' }}>
              {c}
            </button>
          ))}
        </div>

        {loading ? <p style={{ color: '#9A9A9A', fontSize: 14 }}>Loading...</p> : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>💬</p>
            <p style={{ fontSize: 14, color: '#9A9A9A' }}>No posts yet. Be the first!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {posts.map(post => (
              <Link key={post.id} href={`/community/${post.id}`} style={{ textDecoration: 'none', display: 'block', padding: '20px 0', borderBottom: '1px solid #F8F8F6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  {post.is_pinned && <span style={{ fontSize: 10, fontWeight: 700, color: '#D4B33A' }}>📌 PINNED</span>}
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#9A9A9A', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{post.category}</span>
                </div>
                <h3 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 16, color: '#0A0A0A', marginBottom: 6, letterSpacing: '-0.01em' }}>{post.title}</h3>
                <p style={{ fontSize: 13, color: '#6B6B6B', lineHeight: 1.6, marginBottom: 10,
                  overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                  {post.content}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12, color: '#9A9A9A' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {post.profiles?.avatar_url
                      ? <img src={post.profiles.avatar_url} style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover' }} alt="" />
                      : <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#E8E8E4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700 }}>{(post.profiles?.display_name?.[0] ?? '?').toUpperCase()}</div>
                    }
                    <span>{post.profiles?.display_name ?? 'Unknown'}</span>
                  </div>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  <span>❤️ {post.likes || 0}</span>
                  <span>💬 {post.post_comments?.[0]?.count ?? 0}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
