import { supabaseAdmin } from '@/lib/supabase/server'
import Link from 'next/link'

const CAT_LABELS: Record<string, string> = {
  notice: '📢 Notice',
  newsletter: '📮 Newsletter',
  update: '🔔 Update',
}

export default async function MagazinePage() {
  const admin = supabaseAdmin()
  const { data: posts } = await admin.from('magazine_posts')
    .select('id, title, slug, category, summary, cover_image_url, published_at, created_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  return (
    <div style={{ minHeight: '100vh', background: '#F7F7F7' }}>

      {/* 헤더 */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #F0F0F0', padding: '16px 16px 0' }}>
        <h1 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, fontSize: 20, letterSpacing: '-0.04em', color: '#1A1A1A', marginBottom: 4 }}>Magazine</h1>
        <p style={{ fontSize: 13, color: '#9A9A9A', marginBottom: 16 }}>Notices · Newsletters · Updates</p>
      </div>

      {/* 포스트 리스트 */}
      <div style={{ background: '#FFFFFF', marginTop: 8 }}>
        {posts && posts.length > 0 ? (
          <div>
            {posts.map(post => (
              <Link key={post.id} href={`/magazine/${post.slug}`} style={{ textDecoration: 'none', display: 'block', borderBottom: '1px solid #F5F5F5' }}>
                <article style={{ padding: '16px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#7A6100', background: '#FFFBEA', padding: '2px 8px', borderRadius: 6 }}>
                        {CAT_LABELS[post.category] || post.category}
                      </span>
                      <span style={{ fontSize: 11, color: '#9A9A9A' }}>
                        {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <h2 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 15, color: '#1A1A1A', letterSpacing: '-0.03em', lineHeight: 1.35, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {post.title}
                    </h2>
                    {post.summary && (
                      <p style={{ fontSize: 13, color: '#6B6B6B', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                        {post.summary}
                      </p>
                    )}
                  </div>
                  {post.cover_image_url && (
                    <img src={post.cover_image_url} alt={post.title}
                      style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
                  )}
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '64px 24px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📮</div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 6 }}>Nothing here yet</p>
            <p style={{ fontSize: 14, color: '#9A9A9A' }}>Check back soon for news and updates!</p>
          </div>
        )}
      </div>
    </div>
  )
}
