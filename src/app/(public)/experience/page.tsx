import { supabaseAdmin } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function ExperiencePage() {
  const admin = supabaseAdmin()
  const { data: events } = await admin.from('experience_events')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  return (
    <div style={{ background: '#F5F5F5', minHeight: '100vh' }}>
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #F0F0F0', padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, fontSize: 20, color: '#1A1A1A', letterSpacing: '-0.04em' }}>
              Experience
            </h1>
            <p style={{ fontSize: 13, color: '#999', marginTop: 2 }}>Experiences for foreigners in Korea</p>
          </div>
          <Link href="/experience/new"
            style={{ background: '#1A1A1A', color: '#E9C000', fontSize: 13, fontWeight: 700, padding: '8px 14px', borderRadius: 8, textDecoration: 'none', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
            + Host
          </Link>
        </div>
      </div>

      <div style={{ background: '#FFFFFF', marginTop: 8 }}>
        {!events || events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 24px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🌟</div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 6 }}>No experiences yet</p>
            <p style={{ fontSize: 14, color: '#999' }}>Be the first to host an experience!</p>
          </div>
        ) : (
          <div>
            {events.map((e: any) => (
              <Link key={e.id} href={`/experience/${e.id}`} style={{ textDecoration: 'none', display: 'block', borderBottom: '1px solid #F2F2F2' }}>
                <div style={{ padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  {e.images?.[0] ? (
                    <img src={e.images[0]} alt={e.title} style={{ width: 96, height: 96, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 96, height: 96, borderRadius: 8, background: '#F0F0F0', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🌟</div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 700, fontSize: 15, color: '#1A1A1A', marginBottom: 4, letterSpacing: '-0.02em' }}>{e.title}</h3>
                    <p style={{ fontSize: 13, color: '#999', marginBottom: 6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>{e.description}</p>
                    <p style={{ fontSize: 12, color: '#999' }}>📍 {e.location}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
