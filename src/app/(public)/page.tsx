'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import EventFeedCard from '@/components/EventFeedCard'
import SponsorBanner from '@/components/SponsorBanner'

const CATEGORIES = [
  { label: '전체', value: 'all' },
  { label: 'Party', value: 'party' },
  { label: 'Tour', value: 'tour' },
  { label: 'Meetup', value: 'meetup' },
  { label: 'Language', value: 'language' },
  { label: 'Social', value: 'social' },
  { label: 'Culture', value: 'culture' },
  { label: 'Sports', value: 'sports' },
]

export default function HomePage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState('all')

  useEffect(() => {
    Promise.all([
      fetch('/api/events-list').then(r => r.json()),
      fetch('/api/experience-list').then(r => r.json()),
    ]).then(([evts, exps]) => {
      const expMapped = (Array.isArray(exps) ? exps : []).map((e: any) => ({
        ...e,
        slug: null,
        experience_id: e.id,
        is_free: true,
        price_krw: 0,
        starts_at: e.starts_at || null,
        venue_name: e.location,
        cover_image_url: e.images?.[0] || null,
        status: e.status,
        category: 'Experience',
        capacity: e.capacity,
        remaining: e.capacity,
        isExperience: true,
      }))
      const now = Date.now()
      const all = [...(Array.isArray(evts) ? evts : []), ...expMapped]
        .sort((a: any, b: any) => {
          const aTour = a.category === 'tour' || a.category === '투어'
          const bTour = b.category === 'tour' || b.category === '투어'
          if (aTour && !bTour) return -1
          if (!aTour && bTour) return 1
          const aActive = a.status === 'published'
          const bActive = b.status === 'published'
          if (aActive && !bActive) return -1
          if (!aActive && bActive) return 1
          const aDate = a.starts_at ? new Date(a.starts_at).getTime() : Infinity
          const bDate = b.starts_at ? new Date(b.starts_at).getTime() : Infinity
          const aFuture = aDate >= now
          const bFuture = bDate >= now
          if (aFuture && bFuture) return aDate - bDate
          if (!aFuture && !bFuture) return bDate - aDate
          return aFuture ? -1 : 1
        })
      setEvents(all)
      setLoading(false)
    })
  }, [])

  const filtered = cat === 'all'
    ? events
    : events.filter(e => e.category?.toLowerCase() === cat)

  // 마감 임박 (7일 이내)
  const closing = events.filter(e => {
    if (!e.starts_at || e.status === 'closed') return false
    const diff = Math.ceil((new Date(e.starts_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return diff >= 0 && diff <= 7
  }).slice(0, 5)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* ── 상단 헤더 영역 ── */}
      <div style={{
        background: 'rgba(248,248,248,0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ padding: '12px 16px 0' }}>
          {/* 타이틀 행 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <p style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 16, color: 'var(--text)', letterSpacing: '-0.04em' }}>
              Korea Events
            </p>
            <Link href="/events" style={{ fontSize: 12, color: 'var(--text-4)', fontWeight: 600, textDecoration: 'none', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
              See all
            </Link>
          </div>

          {/* 카테고리 필터 */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 12, scrollbarWidth: 'none' }}>
            {CATEGORIES.map(c => (
              <button key={c.value} onClick={() => setCat(c.value)} style={{
                flexShrink: 0,
                padding: '6px 14px', borderRadius: 100,
                border: `1.5px solid ${cat === c.value ? '#111' : 'var(--border-dk)'}`,
                background: cat === c.value ? '#111' : '#fff',
                color: cat === c.value ? '#fff' : 'var(--text-4)',
                fontSize: 12, fontWeight: 700,
                fontFamily: 'PretendardVariable, Pretendard, sans-serif',
                letterSpacing: '-0.02em',
                cursor: 'pointer',
                transition: 'all 0.12s',
                whiteSpace: 'nowrap' as const,
              }}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 스폰서 배너 ── */}
      <SponsorBanner position="home" />


      {/* ── 이번 주 추천 (2열 그리드) ── */}
      <div style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px 10px' }}>
          <span style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 15, color: 'var(--text)', letterSpacing: '-0.04em' }}>
            이번 주 추천
          </span>
          <Link href="/events" style={{ fontSize: 12, color: 'var(--text-4)', textDecoration: 'none', fontWeight: 600 }}>더보기</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '0 14px' }}>
          {loading ? (
            [0, 1, 2, 3].map(i => (
              <div key={i} style={{ background: '#EFEFEF', borderRadius: 14, aspectRatio: '3/4', animation: 'pulse 1.5s ease infinite' }} />
            ))
          ) : (
            filtered.slice(0, 4).map(e => {
              const date = e.starts_at ? new Date(e.starts_at) : null
              const dateStr = date ? date.toLocaleString('en-US', { month: 'short', day: 'numeric', weekday: 'short', timeZone: 'UTC' }) : ''
              const prices = [e.solo_option1_price, e.returning_option1_price, e.friends_option1_price, e.price_solo, e.price_returning, e.price_with_friends, e.price_krw].filter((p: any) => p && p > 0)
              const minPrice = prices.length > 0 ? Math.min(...prices) : 0
              return (
                <Link key={e.id} href={e.isExperience ? `/experience/${e.experience_id}` : `/events/${e.slug}`}
                  style={{ textDecoration: 'none', display: 'block', background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div style={{ position: 'relative', aspectRatio: '3/2', background: 'linear-gradient(145deg, #2A2830, #3D3A4A)', overflow: 'hidden' }}>
                    {e.cover_image_url
                      ? <img src={e.cover_image_url} alt={e.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : null
                    }
                    {/* 좌상단: 제공언어 + 잔여석 */}
                    <div style={{ position: 'absolute', top: 6, left: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {e.language && (
                        <span style={{ fontSize: 9, fontWeight: 800, background: 'rgba(0,0,0,0.62)', color: '#fff', padding: '2px 6px', borderRadius: 4, fontFamily: 'PretendardVariable, Pretendard, sans-serif', letterSpacing: '0.03em' }}>
                          🌐 {e.language}
                        </span>
                      )}
                      {e.status !== 'closed' && e.capacity > 0 && e.remaining > 0 && (
                        <span style={{ fontSize: 9, fontWeight: 800, background: e.remaining <= 5 ? 'rgba(220,38,38,0.82)' : 'rgba(0,0,0,0.62)', color: '#fff', padding: '2px 6px', borderRadius: 4, fontFamily: 'PretendardVariable, Pretendard, sans-serif', letterSpacing: '0.03em' }}>
                          {e.remaining <= 5 ? `⚡ ${e.remaining} left` : `${e.remaining} seats`}
                        </span>
                      )}
                    </div>
                    {e.status === 'closed' && (
                      <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(255,255,255,0.9)', padding: '2px 7px', borderRadius: 5, fontSize: 9, fontWeight: 700, color: '#666' }}>CLOSED</div>
                    )}
                  </div>
                  <div style={{ padding: '10px 10px 12px' }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-5)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3 }}>{e.category || 'Event'}</div>
                    <div style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 700, fontSize: 12, color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1.35, marginBottom: 4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any, minHeight: 32 }}>
                      {e.title}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-4)', marginBottom: 7 }}>{dateStr}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.04em', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
                        {e.is_free ? 'Free' : `₩${Number(minPrice).toLocaleString()}~`}
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 800, background: 'var(--gold)', color: '#111', padding: '4px 10px', borderRadius: 7 }}>참가</span>
                    </div>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </div>

      {/* ── 곧 마감 (가로 스크롤) ── */}
      {closing.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px 10px' }}>
            <span style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 15, color: 'var(--text)', letterSpacing: '-0.04em' }}>
              곧 마감
            </span>
            <Link href="/events" style={{ fontSize: 12, color: 'var(--text-4)', textDecoration: 'none', fontWeight: 600 }}>더보기</Link>
          </div>
          <div style={{ overflowX: 'auto', scrollbarWidth: 'none', paddingLeft: 14 }}>
            <div style={{ display: 'flex', gap: 10, width: 'max-content', paddingRight: 14, paddingBottom: 4 }}>
              {closing.map(e => {
                const date = e.starts_at ? new Date(e.starts_at) : null
                const dateStr = date ? date.toLocaleString('en-US', { month: 'short', day: 'numeric', weekday: 'short', timeZone: 'UTC' }) : ''
                const diff = date ? Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null
                const prices = [e.price_krw, e.price_solo, e.solo_option1_price].filter((p: any) => p && p > 0)
                const minPrice = prices.length > 0 ? Math.min(...prices) : 0
                return (
                  <Link key={e.id} href={e.isExperience ? `/experience/${e.experience_id}` : `/events/${e.slug}`}
                    style={{ textDecoration: 'none', width: 158, background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)', flexShrink: 0 }}>
                    <div style={{ height: 96, background: 'linear-gradient(145deg, #2A2830, #3D3A4A)', overflow: 'hidden', position: 'relative' }}>
                      {e.cover_image_url && <img src={e.cover_image_url} alt={e.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      {/* 좌상단: 제공언어 + 잔여석 */}
                      <div style={{ position: 'absolute', top: 5, left: 5, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {e.language && (
                          <span style={{ fontSize: 8, fontWeight: 800, background: 'rgba(0,0,0,0.62)', color: '#fff', padding: '2px 5px', borderRadius: 4, fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
                            🌐 {e.language}
                          </span>
                        )}
                        {e.status !== 'closed' && e.capacity > 0 && e.remaining > 0 && (
                          <span style={{ fontSize: 8, fontWeight: 800, background: e.remaining <= 5 ? 'rgba(220,38,38,0.82)' : 'rgba(0,0,0,0.62)', color: '#fff', padding: '2px 5px', borderRadius: 4, fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
                            {e.remaining <= 5 ? `⚡ ${e.remaining} left` : `${e.remaining} seats`}
                          </span>
                        )}
                      </div>
                      {/* 우상단: D-day */}
                      {diff !== null && (
                        <div style={{ position: 'absolute', top: 5, right: 5, background: 'var(--gold)', padding: '2px 7px', borderRadius: 5, fontSize: 9, fontWeight: 800, color: '#111' }}>
                          {diff === 0 ? 'D-Day' : `D-${diff}`}
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '10px 10px 12px' }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-5)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3 }}>{e.category || 'Event'}</div>
                      <div style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 700, fontSize: 12, color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1.35, marginBottom: 4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any, minHeight: 32 }}>
                        {e.title}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-4)', marginBottom: 2 }}>{dateStr}</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.04em', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
                        {e.is_free ? 'Free' : `₩${Number(minPrice).toLocaleString()}~`}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── 전체 이벤트 피드 ── */}
      <div style={{ marginTop: 16 }}>
        <div style={{ padding: '0 14px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 15, color: 'var(--text)', letterSpacing: '-0.04em' }}>
            전체 이벤트
          </span>
          <Link href="/events" style={{ fontSize: 12, color: 'var(--text-4)', textDecoration: 'none', fontWeight: 600 }}>필터</Link>
        </div>
        <div style={{ background: '#fff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          {loading ? (
            <div style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--text-5)', fontSize: 13 }}>Loading...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '48px 16px', textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: 'var(--text-4)' }}>No events yet</p>
            </div>
          ) : (
            <div>{filtered.slice(0, 8).map(e => <EventFeedCard key={e.id} event={e} />)}</div>
          )}
        </div>
      </div>

      {/* ── Host 배너 ── */}
      <div style={{ padding: '16px 14px 24px' }}>
        <div style={{ border: '1.5px solid var(--border-dk)', borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff' }}>
          <div>
            <p style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 14, color: 'var(--text)', marginBottom: 2, letterSpacing: '-0.03em' }}>이벤트 개설하기</p>
            <p style={{ fontSize: 12, color: 'var(--text-4)', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>외국인 커뮤니티에 알려보세요</p>
          </div>
          <Link href="/host/new" style={{ background: '#111', color: '#fff', fontSize: 13, fontWeight: 700, padding: '9px 16px', borderRadius: 10, textDecoration: 'none', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
            시작하기
          </Link>
        </div>
      </div>

    </div>
  )
}
