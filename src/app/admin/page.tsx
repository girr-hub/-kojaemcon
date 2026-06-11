import { supabaseAdmin } from '@/lib/supabase/server'

export default async function AdminHome() {
  const sb = supabaseAdmin()
  const [{ count: users }, { count: events }, { count: pending }, { data: revenue }] = await Promise.all([
    sb.from('profiles').select('id', { count: 'exact', head: true }),
    sb.from('events').select('id', { count: 'exact', head: true }),
    sb.from('events').select('id', { count: 'exact', head: true }).eq('status','pending'),
    sb.from('orders').select('amount_krw').eq('status','paid'),
  ])
  const total = (revenue ?? []).reduce((s, r:any) => s + r.amount_krw, 0)

  const card = "bg-surface p-6"
  return (
    <div>
      <h1 className="headline-en text-5xl uppercase mb-8">Dashboard</h1>
      <div className="grid grid-cols-4 gap-4">
        <div className={card}>
          <div className="sub-en uppercase text-xs text-ink/50">Users</div>
          <div className="headline-en text-5xl text-primary mt-2">{users}</div>
        </div>
        <div className={card}>
          <div className="sub-en uppercase text-xs text-ink/50">Events</div>
          <div className="headline-en text-5xl text-primary mt-2">{events}</div>
        </div>
        <div className={card}>
          <div className="sub-en uppercase text-xs text-ink/50">Pending review</div>
          <div className="headline-en text-5xl text-primary mt-2">{pending}</div>
        </div>
        <div className={card}>
          <div className="sub-en uppercase text-xs text-ink/50">Gross revenue</div>
          <div className="headline-en text-3xl text-primary mt-2">₩{total.toLocaleString()}</div>
        </div>
      </div>
    </div>
  )
}
