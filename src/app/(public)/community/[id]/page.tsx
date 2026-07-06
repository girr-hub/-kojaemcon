'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const postId = params?.id as string

  const [post, setPost] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    supabase().auth.getUser().then(({ data }) => setUser(data.user))
    loadPost()
    loadComments()
  }, [postId])

  useEffect(() => { if (user && postId) checkLiked() }, [user, postId])

  const loadPost = async () => {
    setLoading(true)
    const { data } = await supabase().from('posts').select('*, profiles(display_name, avatar_url, nationality)').eq('id', postId).single()
    setPost(data)
    setLoading(false)
  }

  const loadComments = async () => {
    const { data } = await supabase().from('post_comments')
      .select('*, profiles(display_name, avatar_url, nationality)')
      .eq('post_id', postId).order('created_at', { ascending: true })
    setComments(data ?? [])
  }

  const checkLiked = async () => {
    const { data } = await supabase().from('post_likes').select('post_id').eq('post_id', postId).eq('user_id', user.id).maybeSingle()
    setLiked(!!data)
  }

  const toggleLike = async () => {
    if (!user) { alert('Please log in'); return }
    const sb = supabase()
    if (liked) {
      await sb.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id)
      await sb.from('posts').update({ likes: Math.max(0, (post.likes || 1) - 1) }).eq('id', postId)
      setPost((p: any) => ({ ...p, likes: Math.max(0, (p.likes || 1) - 1) }))
      setLiked(false)
    } else {
      await sb.from('post_likes').insert({ post_id: postId, user_id: user.id })
      await sb.from('posts').update({ likes: (post.likes || 0) + 1 }).eq('id', postId)
      setPost((p: any) => ({ ...p, likes: (p.likes || 0) + 1 }))
      setLiked(true)
    }
  }

  const submitComment = async () => {
    if (!newComment.trim() || !user) return
    setPosting(true)
    const { error } = await supabase().from('post_comments').insert({ post_id: postId, author_id: user.id, content: newComment })
    setPosting(false)
    if (!error) { setNewComment(''); loadComments() }
  }

  const deleteComment = async (id: string) => {
    if (!confirm('Delete this comment?')) return
    await supabase().from('post_comments').delete().eq('id', id)
    setComments(prev => prev.filter(c => c.id !== id))
  }

  const deletePost = async () => {
    if (!confirm('Delete this post?')) return
    await supabase().from('posts').delete().eq('id', postId)
    router.push('/community')
  }

  if (loading) return <div style={{ padding: '120px 24px', textAlign: 'center', color: '#9A9A9A' }}>Loading...</div>
  if (!post) return <div style={{ padding: '120px 24px', textAlign: 'center' }}>Post not found</div>

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '100px 24px 80px' }}>
        <Link href="/community" style={{ fontSize: 13, color: '#9A9A9A', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 32 }}>← Back to Board</Link>

        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#9A9A9A', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{post.category}</span>
          </div>
          <h1 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 'clamp(24px,4vw,36px)', letterSpacing: '-0.04em', color: '#0A0A0A', marginBottom: 16, lineHeight: 1.1 }}>{post.title}</h1>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {post.profiles?.avatar_url
                ? <img src={post.profiles.avatar_url} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} alt="" />
                : <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F8F8F6', border: '1.5px solid #E8E8E4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#9A9A9A', fontSize: 14 }}>{(post.profiles?.display_name?.[0] ?? '?').toUpperCase()}</div>
              }
              <div>
                <p style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 13, color: '#0A0A0A' }}>{post.profiles?.display_name ?? 'Unknown'}</p>
                <p style={{ fontSize: 11, color: '#9A9A9A' }}>{post.profiles?.nationality} · {new Date(post.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            {user?.id === post.author_id && (
              <button onClick={deletePost} style={{ fontSize: 12, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Delete post</button>
            )}
          </div>

          <div style={{ fontSize: 15, color: '#3A3A3A', lineHeight: 1.8, whiteSpace: 'pre-wrap', marginBottom: 28 }}>{post.content}</div>

          <button onClick={toggleLike} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            background: liked ? '#fee2e2' : '#F8F8F6', color: liked ? '#dc2626' : '#6B6B6B',
            border: liked ? '1.5px solid #fca5a5' : '1.5px solid #E8E8E4', transition: 'all 0.15s',
          }}>
            {liked ? '❤️' : '🤍'} {post.likes || 0} {post.likes === 1 ? 'like' : 'likes'}
          </button>
        </div>

        <div style={{ height: 1, background: '#E8E8E4', marginBottom: 32 }} />

        <div>
          <h2 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 18, color: '#0A0A0A', marginBottom: 24 }}>Comments ({comments.length})</h2>

          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 32 }}>
            {comments.map(c => (
              <div key={c.id} style={{ padding: '16px 0', borderBottom: '1px solid #F8F8F6' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  {c.profiles?.avatar_url
                    ? <img src={c.profiles.avatar_url} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, marginTop: 2 }} alt="" />
                    : <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F8F8F6', border: '1.5px solid #E8E8E4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#9A9A9A', fontSize: 12, flexShrink: 0, marginTop: 2 }}>{(c.profiles?.display_name?.[0] ?? '?').toUpperCase()}</div>
                  }
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap', gap: 6 }}>
                      <div>
                        <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 13, color: '#0A0A0A' }}>{c.profiles?.display_name ?? 'Unknown'}</span>
                        {c.profiles?.nationality && <span style={{ fontSize: 11, color: '#9A9A9A', marginLeft: 6 }}>· {c.profiles.nationality}</span>}
                        <span style={{ fontSize: 11, color: '#C4C4C0', marginLeft: 8 }}>{new Date(c.created_at).toLocaleDateString()}</span>
                      </div>
                      {user?.id === c.author_id && (
                        <button onClick={() => deleteComment(c.id)} style={{ fontSize: 11, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Delete</button>
                      )}
                    </div>
                    <p style={{ fontSize: 14, color: '#3A3A3A', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{c.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {comments.length === 0 && <p style={{ fontSize: 13, color: '#C4C4C0', padding: '16px 0' }}>No comments yet. Be the first!</p>}
          </div>

          {user ? (
            <div style={{ background: '#F8F8F6', border: '1.5px solid #E8E8E4', borderRadius: 14, padding: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#0A0A0A', marginBottom: 10 }}>Leave a comment</p>
              <textarea className="input-base" rows={4} style={{ resize: 'none', marginBottom: 12 }}
                placeholder="Write your comment..." value={newComment} onChange={e => setNewComment(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) submitComment() }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#C4C4C0' }}>⌘+Enter to submit</span>
                <button onClick={submitComment} disabled={posting || !newComment.trim()} className="btn-primary" style={{ padding: '9px 20px', fontSize: 13 }}>
                  {posting ? 'Posting...' : 'Post comment'}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ background: '#F8F8F6', border: '1.5px solid #E8E8E4', borderRadius: 14, padding: 20, textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: '#6B6B6B', marginBottom: 12 }}>Log in to leave a comment</p>
              <Link href="/login" className="btn-primary" style={{ textDecoration: 'none', padding: '9px 20px', fontSize: 13 }}>Log in →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
