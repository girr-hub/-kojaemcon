'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const CAT_LABELS: Record<string, string> = {
  notice: '📢 Notice',
  newsletter: '📮 Newsletter',
  update: '🔔 Update',
}

export default function MagazinePage() {
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/magazine-list').then(r => r.json()).then(d => { if (Array.isArray(d)) setPosts(d) })
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{
        background: 'rgba(248,248,248,0.94)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        padding: '14px 16px',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <h1 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 20, letterSpacing: '-0.05em', color: 'var(--text)' }}>Magazine</h1>
      </div>
      <div style={{ background: '#FFFFFF', marginTop: 8 }}>
        {posts.length > 0 ? (
          <div>
            {posts.map(post => (
              <Link key={post.id} href={`/magazine/${post.slug}`} style={{ textDecoration: 'none', display: 'block', borderBottom: '1px solid #F5F5F5' }}>
                <article style={{ padding: '16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#7A6100', background: '#FFFBEA', padding: '2px 8px', borderRadius: 6 }}>
                        {CAT_LABELS[post.category] || post.category}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text-4)' }}>
                        {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <h2 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 15, color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1.35, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {post.title}
                    </h2>
                    {post.summary && (
                      <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                        {post.summary}
                      </p>
                    )}
                  </div>
                  {post.cover_image_url && (
                    <img src={post.cover_image_url} alt={post.title} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
                  )}
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '64px 24px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📮</div>
            <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Nothing here yet</p>
            <p style={{ fontSize: 14, color: 'var(--text-4)' }}>Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}
