import { supabaseServer, supabaseAdmin } from '@/lib/supabase/server'
import { sanitizeHtml } from '@/lib/sanitize'
import Link from 'next/link'
import BuyButton from '@/components/BuyButton'
import ImageSlider from '@/components/ImageSlider'
import EventMap from '@/components/EventMap'

export default async function EventDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const sb = await supabaseServer()
  const { data: e } = await sb.from('events').select('*').eq('slug', slug).single()
  if (!e) return <div className="p-12 text-center">Not found</div>
  let stats: any = null
  try { const r = await sb.from('event_stats').select('*').eq('event_id', e.id).maybeSingle(); stats = r.data } catch {}

  // remaining 직접 계산 (paid + free_confirmed 주문 수)
  const { count: soldCount } = await sb.from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', e.id)
    .in('status', ['paid', 'free_confirmed'])
  const remaining = Math.max(0, (e.capacity ?? 0) - (soldCount ?? 0))
  const admin = supabaseAdmin()
  const { data: attendees } = await admin
    .from('orders')
    .select('user_id, profiles(display_name, nationality, avatar_url)')
    .eq('event_id', e.id)
    .in('status', ['paid','free_confirmed'])

  return (
    <article style={{ background: "#ffffff", color: "#12161A" }}>
      {/* Hero image */}
      <div className="relative overflow-hidden" style={{ height: "60vh", background: "#F5F5F0" }}>
        {e.cover_image_url && (
          <img src={e.cover_image_url} className="w-full h-full object-cover opacity-70"/>
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #ffffff, rgba(255,255,255,0.4), transparent)" }}/>
        <div className="absolute bottom-0 left-0 right-0 max-w-6xl mx-auto px-6 pb-12">
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E9C000" }}>{e.category}</div>
          <h1 style={{ fontFamily: "PretendardVariable, Pretendard, sans-serif", fontWeight: 900, fontSize: "clamp(22px,5vw,40px)", letterSpacing: "-0.04em", color: "#12161A", marginTop: 8, lineHeight: 1.05 }}>{e.title}</h1>
          <p style={{ fontSize: 14, color: "#6B6B6B", marginTop: 8 }}>{e.summary}</p>
        </div>
      </div>

      <div style={{ padding: "16px 16px 80px", display: "flex", flexDirection: "column", gap: 24 }}>
        <div className="lg:col-span-2 space-y-8">
          {/* gallery */}
          {/* 어드민 상세 이미지 슬라이더 */}
          {(() => {
            const all = [...(e.detail_images ?? []), ...(e.images ?? [])].filter(Boolean)
            return all.length > 0 ? <ImageSlider images={all} /> : null
          })()}

          <div className="proseert max-w-none"
               dangerouslySetInnerHTML={{ __html: sanitizeHtml(e.description_html || '') }}/>

          {e.source === 'official' && e.detail_page_html && (
            <Link href={`/events/${e.slug}/detail`}
                  >
              View KOJAEMCON Presents Full Page →
            </Link>
          )}

          {/* 구글맵 */}
          <EventMap
            lat={e.venue_lat}
            lng={e.venue_lng}
            venueName={e.venue_name}
            venueAddress={e.venue_address}
          />

          {/* attendees */}
          <section>
            <h3 style={{ fontFamily:'PretendardVariable,Pretendard,sans-serif', fontWeight:800, fontSize:18, color:'#1A1A1A', marginBottom:12, letterSpacing:'-0.03em' }}>
              Who&apos;s coming ({(attendees ?? []).length})
            </h3>
            {(attendees ?? []).length === 0 ? (
              <p style={{ fontSize:13, color:'#9A9A9A' }}>No one yet — be the first!</p>
            ) : (
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {(attendees ?? []).map((a:any) => {
                  const name = a?.profiles?.display_name || 'Guest'
                  const nat = a?.profiles?.nationality || ''
                  const avatar = a?.profiles?.avatar_url || null
                  return (
                    <div key={a?.user_id || name} style={{ background:'#F7F7F7', padding:'6px 12px', borderRadius:100, fontSize:13, display:'flex', alignItems:'center', gap:6, border:'1px solid #EBEBEB' }}>
                      {avatar ? (
                        <img src={avatar} style={{ width:22, height:22, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} alt="" onError={e=>{(e.target as HTMLImageElement).style.display='none'}} />
                      ) : (
                        <div style={{ width:22, height:22, borderRadius:'50%', background:'#E9C000', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, flexShrink:0 }}>
                          {name[0]?.toUpperCase()||'?'}
                        </div>
                      )}
                      <span>{name}{nat ? ` · ${nat}` : ''}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* Refund policy - default on every event page */}
          <section style={{ background: '#FFFFFF', border: '1px solid #F0F0F0', borderRadius: 14, padding: 16 }}>
            <h3 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 15, letterSpacing: '-0.02em', color: '#0A0A0A', marginBottom: 12 }}>
              Refund Policy
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#3A3A3A' }}>
                <span>7+ days before event</span><span style={{ fontWeight: 700, color: '#15803d' }}>100% refund</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#3A3A3A' }}>
                <span>3-6 days before event</span><span style={{ fontWeight: 700, color: '#92400e' }}>50% refund</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#3A3A3A' }}>
                <span>0-2 days before / no-show</span><span style={{ fontWeight: 700, color: '#dc2626' }}>No refund</span>
              </div>
            </div>
            <Link href="/refund-policy" style={{ fontSize: 12, color: '#6B6B6B', textDecoration: 'underline' }}>
              View full refund policy →
            </Link>
          </section>
        </div>

        {/* sidebar */}
        <aside className="space-y-4">
          <div style={{ background:'#F7F7F7', padding:16, borderRadius:14, position:'sticky', top:80 }}>
            <div >When</div>
            <div className="text-lg mt-1">{new Date(e.starts_at).toLocaleString('en-US')}</div>
            <div >Where</div>
            <div className="text-lg mt-1">{e.venue_name}</div>
            <div >{e.venue_address}</div>

            <div className="my-6 border-t border-ink/10"/>

            <div className="flex justify-between items-baseline">
              <span >Price</span>
              <span style={{ fontFamily:"PretendardVariable,Pretendard,sans-serif", fontWeight:900, fontSize:22, letterSpacing:"-0.04em" }}>
                {e.is_free ? 'FREE' : `₩${e.price_krw.toLocaleString()}`}
              </span>
            </div>
            <div >
              <span >Remaining</span>
              <span>{remaining} / {e.capacity} spots left</span>
            </div>

            <div className="mt-4">
              <BuyButton event={e} remaining={remaining}/>
            </div>
          </div>
        </aside>
      </div>
    </article>
  )
}
 