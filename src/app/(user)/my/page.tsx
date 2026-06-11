import { supabaseServer } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function My() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/login')

  const { data: tickets } = await sb.from('orders')
    .select('*, events(*)')
    .eq('user_id', user.id)
    .in('status', ['paid','free_confirmed'])
    .order('created_at', { ascending: false })

  const { data: hosted } = await sb.from('events')
    .select('*').eq('host_id', user.id).order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      <section>
        <h2 className="headline-en text-5xl uppercase mb-6">My tickets</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {tickets?.length === 0 && (
            <p className="text-ink/40 sub-en">No tickets yet. <Link href="/events" className="text-primary underline">Explore events →</Link></p>
          )}
          {tickets?.map((t: any) => (
            <div key={t.id} className="bg-surface p-4 flex gap-4">
              {t.events?.cover_image_url && <img src={t.events.cover_image_url} className="w-32 h-32 object-cover"/>}
              <div className="flex-1">
                <div className="sub-en text-xs text-primary uppercase">{t.events?.category}</div>
                <h3 className="headline-en text-2xl">{t.events?.title}</h3>
                <div className="text-sm text-ink/60">{new Date(t.events?.starts_at).toLocaleString()}</div>
                <div className="mt-2 flex gap-2">
                  <Link href={`/events/${t.events?.slug}`} className="sub-en text-xs underline">View</Link>
                  <Link href={`/chat/${t.events?.id}`} className="sub-en text-xs text-primary underline">Chat →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-end mb-6">
          <h2 className="headline-en text-5xl uppercase">My events (host)</h2>
          <Link href="/host/new" className="bg-primary text-bg px-4 py-2 sub-en uppercase">+ New</Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hosted?.map((e:any)=>(
            <div key={e.id} className="bg-surface">
              {e.cover_image_url && <img src={e.cover_image_url} className="w-full aspect-video object-cover"/>}
              <div className="p-3">
                <div className="text-xs sub-en uppercase text-ink/50">{e.status}</div>
                <h3 className="headline-en text-xl">{e.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
