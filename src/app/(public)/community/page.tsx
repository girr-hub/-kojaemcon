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
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* 블러 헤더 */}
      <div style={{
        background: 'rgba(248,248,248,0.94)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ padding: '14px 16px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 20, letterSpacing: '-0.05em', color: 'var(--text)', marginBottom: 10 }}>
            Community
          </h1>
          <button onClick={() => { if (!user) { window.location.href = '/login'; return } setShowForm(!showForm) }}
            style={{ padding: '7px 14px', borderRadius: 10, background: 'var(--gold)', color: '#111', border: 'none', fontWeight: 800, fontSize: 12, cursor: 'pointer', fontFamily: 'PretendardVariable, Pretendard, sans-serif', marginBottom: 10 }}>
            {showForm ? '✕ Cancel' : '✏️ Write'}
          </button>
        </div>

        {/* 카테고리 탭 */}
        <div style={{ display: 'flex', overflowX: 'auto', scrollbarWidth: 'none', borderTop: '1px solid var(--border)' }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{ padding: '11px 16px', fontSize: 12, fontWeight: cat === c ? 800 : 500, cursor: 'pointer', flexShrink: 0,
                background: 'none', color: cat === c ? 'var(--text)' : 'var(--text-4)', border: 'none',
                borderBottom: `2px solid ${cat === c ? 'var(--gold)' : 'transparent'}`,
                fontFamily: 'PretendardVariable, Pretendard, sans-serif', transition: 'all 0.12s', letterSpacing: '-0.01em' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* 글 작성 폼 */}
      {showForm && (
        <div style={{ background: '#FFFFFF', borderBottom: '8px solid var(--bg)', padding: '16px' }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
            {CATEGORIES.filter(c => c !== 'All').map(c => (
              <button key={c} type="button" onClick={() => setForm(f => ({ ...f, category: c }))}
                style={{ padding: '5px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  background: form.category === c ? '#111' : '#F4F4F4', color: form.category === c ? '#fff' : 'var(--text-3)',
                  border: 'none', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
                {c}
              </button>
            ))}
          </div>
          <input className="input-base" placeholder="Title *" style={{ marginBottom: 10 }}
            value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <textarea className="input-base" rows={5} style={{ resize: 'none', marginBottom: 14 }}
            placeholder="What's on your mind?" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />
          <button onClick={submitPost} disabled={posting}
            style={{ padding: '11px 24px', borderRadius: 10, background: 'var(--gold)', color: '#111', border: 'none', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
            {posting ? 'Posting...' : 'Post'}
          </button>
        </div>
      )}

      <div style={{ paddingBottom: 100 }}>
        {loading ? (
          <div style={{ padding: '32px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1,2,3].map(i => <div key={i} style={{ height: 80, background: '#F0F0F0', borderRadius: 12 }} />)}
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>💬</p>
            <p style={{ fontSize: 14, color: 'var(--text-4)', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>No posts yet. Be the first!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {posts.map(post => (
              <Link key={post.id} href={`/community/${post.id}`} style={{ textDecoration: 'none', display: 'block', background: '#FFFFFF', borderBottom: '1px solid var(--border)', padding: '16px' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#FAFAFA')}
                onMouseLeave={e => (e.currentTarget.style.background = '#FFFFFF')}
              >
                {post.is_pinned && (
                  <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--gold-dark, #D4A900)', display: 'block', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>📌 Pinned</span>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 4, letterSpacing: '-0.03em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {post.title}
                    </h3>
                    <p style={{ fontSize: 13, color: 'var(--text-4)', lineHeight: 1.55, marginBottom: 10, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                      {post.content}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-5)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        {post.profiles?.avatar_url
                          ? <img src={post.profiles.avatar_url} style={{ width: 18, height: 18, borderRadius: '50%', objectFit: 'cover' }} alt="" />
                          : <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 800, color: '#111' }}>{(post.profiles?.display_name?.[0] ?? '?').toUpperCase()}</div>
                        }
                        <span style={{ fontWeight: 600, color: 'var(--text-3)' }}>{post.profiles?.display_name ?? 'Unknown'}</span>
                      </div>
                      <span>·</span>
                      <span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      <span>·</span>
                      <span>❤️ {post.likes || 0}</span>
                      <span>💬 {post.post_comments?.[0]?.count ?? 0}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-5)', background: '#F4F4F4', padding: '3px 8px', borderRadius: 6, flexShrink: 0, letterSpacing: '0.04em', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
                    {post.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
