import { supabaseServer } from '@/lib/supabase/server'
import { sanitizeHtml } from '@/lib/sanitize'
import Link from 'next/link'
import BuyButton from '@/components/BuyButton'
import EventMap from '@/components/EventMap'

export default async function EventDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const sb = await supabaseServer()
  const { data: e } = await sb.from('events').select('*').eq('slug', slug).single()
  if (!e) return <div className="p-12 text-center">Not found</div>
  const { data: stats } = await sb.from('event_stats').select('*').eq('event_id', e.id).maybeSingle().catch(() => ({ data: null })) as any
  const { data: attendees } = await sb
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
          <h1 style={{ fontFamily: "PretendardVariable, Pretendard, sans-serif", fontWeight: 900, fontSize: "clamp(28px,6vw,72px)", letterSpacing: "-0.04em", color: "#12161A", marginTop: 8, lineHeight: 1.05 }}>{e.title}</h1>
          <p style={{ fontSize: 16, color: "#6B6B6B", marginTop: 12 }}>{e.summary}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* gallery */}
          {e.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {e.images.slice(1).map((u:string)=>(
                <img key={u} src={u} className="aspect-square object-cover"/>
              ))}
            </div>
          )}

          <div className="prose prose-invert max-w-none"
               dangerouslySetInnerHTML={{ __html: sanitizeHtml(e.description_html || '') }}/>

          {e.source === 'official' && e.detail_page_html && (
            <Link href={`/events/${e.slug}/detail`}
                  className="block border border-primary text-primary px-6 py-4 text-center sub-en uppercase hover:bg-primary hover:text-bg transition">
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
            <h3 className="headline-en text-3xl uppercase mb-4">Who's coming ({attendees?.length ?? 0})</h3>
            <div className="flex flex-wrap gap-2">
              {attendees?.map((a:any)=>(
                <div key={a.user_id} className="bg-surface px-3 py-2 sub-en text-sm flex items-center gap-2">
                  {a.profiles?.avatar_url && <img src={a.profiles.avatar_url} className="w-6 h-6 rounded-full"/>}
                  {a.profiles?.display_name} · {a.profiles?.nationality}
                </div>
              ))}
            </div>
          </section>

          {/* Refund policy - default on every event page */}
          <section style={{ background: '#F8F8F6', border: '1.5px solid #E8E8E4', borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em', color: '#0A0A0A', marginBottom: 12 }}>
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
          <div className="bg-surface p-6 sticky top-6">
            <div className="sub-en uppercase text-xs text-ink/50">When</div>
            <div className="text-lg mt-1">{new Date(e.starts_at).toLocaleString('en-US')}</div>
            <div className="sub-en uppercase text-xs text-ink/50 mt-4">Where</div>
            <div className="text-lg mt-1">{e.venue_name}</div>
            <div className="text-sm text-ink/60">{e.venue_address}</div>

            <div className="my-6 border-t border-ink/10"/>

            <div className="flex justify-between items-baseline">
              <span className="sub-en uppercase text-xs text-ink/50">Price</span>
              <span className="headline-en text-3xl text-primary">
                {e.is_free ? 'FREE' : `₩${e.price_krw.toLocaleString()}`}
              </span>
            </div>
            <div className="mt-2 flex justify-between sub-en text-sm">
              <span className="text-ink/50">Remaining</span>
              <span>{stats?.remaining ?? e.capacity} / {e.capacity}</span>
            </div>

            <div className="mt-4">
              <BuyButton event={e} remaining={stats?.remaining ?? e.capacity}/>
            </div>
          </div>
        </aside>
      </div>
    </article>
  )
}
