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
    if (!form.title.trim() || !form.content.trim()) { console.error('Fill in title and content'); return }
    if (!user) { window.location.href = '/login'; return }
    setPosting(true)
    const { error } = await supabase().from('posts').insert({ author_id: user.id, ...form })
    setPosting(false)
    if (!error) { setForm({ title: '', content: '', category: 'General' }); setShowForm(false); loadPosts() }
    else alert('Error: ' + error.message)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F7F7' }}>
      {/* 상단 */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #F0F0F0' }}>
        <div style={{ padding: '16px 16px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, fontSize: 20, letterSpacing: '-0.04em', color: '#1A1A1A' }}>Community</h1>
            <p style={{ fontSize: 13, color: '#9A9A9A', marginTop: 2 }}>Share tips, ask questions, connect.</p>
          </div>
          <button onClick={() => { if (!user) { window.location.href = '/login'; return } setShowForm(!showForm) }}
            style={{ padding: '8px 16px', borderRadius: 10, background: '#E9C000', color: '#1A1A1A', border: 'none', fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
            {showForm ? '✕ Cancel' : '✏️ Write'}
          </button>
        </div>

        {showForm && (
          <div style={{ background: '#FFFFFF', borderBottom: '8px solid #F7F7F7', padding: '16px 16px 20px' }}>
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
            <button onClick={submitPost} disabled={posting}
              style={{ padding: '11px 24px', borderRadius: 10, background: '#E9C000', color: '#1A1A1A', border: 'none', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
              {posting ? 'Posting...' : 'Post'}
            </button>
          </div>
        )}

        {/* 카테고리 탭 */}
        <div style={{ display: 'flex', gap: 0, overflowX: 'auto', scrollbarWidth: 'none', borderTop: '1px solid #F0F0F0' }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{ padding: '12px 16px', fontSize: 13, fontWeight: cat === c ? 800 : 500, cursor: 'pointer', flexShrink: 0,
                background: 'none', color: cat === c ? '#1A1A1A' : '#9A9A9A', border: 'none',
                borderBottom: cat === c ? '2px solid #E9C000' : '2px solid transparent',
                fontFamily: 'PretendardVariable, Pretendard, sans-serif', transition: 'all 0.15s' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 0 100px' }}>

        {loading ? <p style={{ color: '#9A9A9A', fontSize: 14 }}>Loading...</p> : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>💬</p>
            <p style={{ fontSize: 14, color: '#9A9A9A' }}>No posts yet. Be the first!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {posts.map(post => (
              <Link key={post.id} href={`/community/${post.id}`} style={{ textDecoration: 'none', display: 'block', background: '#FFFFFF', borderBottom: '1px solid #F5F5F5', padding: '16px 16px' }}>
                {post.is_pinned && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#E9C000', display: 'block', marginBottom: 4 }}>📌 Pinned</span>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 700, fontSize: 15, color: '#1A1A1A', marginBottom: 4, letterSpacing: '-0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</h3>
                    <p style={{ fontSize: 13, color: '#6B6B6B', lineHeight: 1.5, marginBottom: 10, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                      {post.content}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#9A9A9A' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        {post.profiles?.avatar_url
                          ? <img src={post.profiles.avatar_url} style={{ width: 18, height: 18, borderRadius: '50%', objectFit: 'cover' }} alt="" />
                          : <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#E9C000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 800, color: '#1A1A1A' }}>{(post.profiles?.display_name?.[0] ?? '?').toUpperCase()}</div>
                        }
                        <span style={{ fontWeight: 600, color: '#6B6B6B' }}>{post.profiles?.display_name ?? 'Unknown'}</span>
                      </div>
                      <span>·</span>
                      <span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      <span>·</span>
                      <span>❤️ {post.likes || 0}</span>
                      <span>💬 {post.post_comments?.[0]?.count ?? 0}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#9A9A9A', background: '#F7F7F7', padding: '3px 8px', borderRadius: 6, flexShrink: 0, letterSpacing: '0.05em' }}>{post.category}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
