import { supabaseAdmin } from '@/lib/supabase/server'
import Link from 'next/link'

const CAT_LABELS: Record<string, string> = {
  notice: '📢 공지사항',
  newsletter: '📮 뉴스레터',
  update: '🔔 업데이트',
}

export default async function MagazinePage() {
  const admin = supabaseAdmin()
  const { data: posts } = await admin.from('magazine_posts')
    .select('id, title, slug, category, summary, cover_image_url, published_at, created_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Header */}
      <div style={{ background: '#12161A', padding: 'clamp(48px,8vw,80px) 24px clamp(32px,5vw,56px)', textAlign: 'center' }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E9C000', marginBottom: 12 }}>KOGEMCON</p>
        <h1 style={{ fontFamily: 'Righteous, sans-serif', fontSize: 'clamp(32px,6vw,56px)', color: '#FFFFFF', letterSpacing: '0.02em', marginBottom: 10 }}>
          MAGAZINE
        </h1>
        <p style={{ fontSize: 14, color: '#888' }}>공지사항 · 뉴스레터 · 업데이트</p>
        <div style={{ height: 3, background: '#E9C000', marginTop: 24, maxWidth: 60, margin: '24px auto 0' }} />
      </div>

      {/* Posts */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 'clamp(32px,5vw,64px) 24px' }}>
        {posts && posts.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {posts.map((post, i) => (
              <Link key={post.id} href={`/magazine/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                <article style={{
                  display: 'grid',
                  gridTemplateColumns: post.cover_image_url ? '1fr 120px' : '1fr',
                  gap: 20, padding: '24px 0',
                  borderBottom: '1px solid #F0F0EC',
                  alignItems: 'center',
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#E9C000', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
                        {CAT_LABELS[post.category] || post.category}
                      </span>
                      <span style={{ fontSize: 10, color: '#C4C4C0', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
                        {new Date(post.published_at || post.created_at).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    <h2 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 'clamp(16px,3vw,20px)', color: '#12161A', letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: 8 }}>
                      {post.title}
                    </h2>
                    {post.summary && (
                      <p style={{ fontSize: 13, color: '#6B6B6B', lineHeight: 1.65, fontFamily: 'PretendardVariable, Pretendard, sans-serif',
                        overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                        {post.summary}
                      </p>
                    )}
                  </div>
                  {post.cover_image_url && (
                    <img src={post.cover_image_url} alt={post.title}
                      style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
                  )}
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <p style={{ fontSize: 40, marginBottom: 16 }}>📮</p>
            <p style={{ fontSize: 15, color: '#9A9A9A' }}>아직 게시된 글이 없어요</p>
          </div>
        )}
      </div>
    </div>
  )
}
