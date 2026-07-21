import { supabaseAdmin } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const CAT_LABELS: Record<string, string> = {
  notice: '📢 공지사항',
  newsletter: '📮 뉴스레터',
  update: '🔔 업데이트',
}

export default async function MagazinePostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const admin = supabaseAdmin()
  const { data: post } = await admin.from('magazine_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!post) notFound()

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Cover */}
      {post.cover_image_url && (
        <div style={{ width: '100%', maxHeight: 420, overflow: 'hidden' }}>
          <img src={post.cover_image_url} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', maxHeight: 420 }} />
        </div>
      )}

      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(32px,5vw,64px) 24px' }}>
        <Link href="/magazine" style={{ fontSize: 13, color: '#9A9A9A', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 28 }}>
          ← Magazine
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#E9C000', background: '#12161A', padding: '4px 10px', borderRadius: 100, fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
            {CAT_LABELS[post.category] || post.category}
          </span>
          <span style={{ fontSize: 12, color: '#9A9A9A', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
            {new Date(post.published_at || post.created_at).toLocaleDateString('ko-KR')}
          </span>
        </div>

        <h1 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, fontSize: 'clamp(24px,5vw,40px)', color: '#12161A', letterSpacing: '-0.04em', lineHeight: 1.15, marginBottom: 16 }}>
          {post.title}
        </h1>

        {post.summary && (
          <p style={{ fontSize: 16, color: '#6B6B6B', lineHeight: 1.7, marginBottom: 32, fontFamily: 'PretendardVariable, Pretendard, sans-serif', borderLeft: '3px solid #E9C000', paddingLeft: 16 }}>
            {post.summary}
          </p>
        )}

        <div style={{ height: 1, background: '#E8E8E4', marginBottom: 32 }} />

        {post.content_html ? (
          <div className="prose-content" dangerouslySetInnerHTML={{ __html: post.content_html }} />
        ) : (
          <p style={{ color: '#9A9A9A', fontSize: 14 }}>내용이 없어요</p>
        )}

        <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #E8E8E4', textAlign: 'center' }}>
          <Link href="/magazine" style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A', textDecoration: 'underline', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
            ← 매거진으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
