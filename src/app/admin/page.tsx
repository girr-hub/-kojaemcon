import { supabaseAdmin } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminHome() {
  const sb = supabaseAdmin()
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [
    { count: totalUsers },
    { count: newUsersWeek },
    { count: totalEvents },
    { count: pendingEvents },
    { count: openCs },
    { data: allOrders },
    { data: todayOrders },
    { data: recentOrders },
  ] = await Promise.all([
    sb.from('profiles').select('id', { count: 'exact', head: true }),
    sb.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', weekStart),
    sb.from('events').select('id', { count: 'exact', head: true }),
    sb.from('events').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    sb.from('cs_tickets').select('id', { count: 'exact', head: true }).eq('status', 'open'),
    sb.from('orders').select('amount_krw, created_at, status'),
    sb.from('orders').select('amount_krw, status').gte('created_at', todayStart).eq('status', 'paid'),
    sb.from('orders')
      .select('id, amount_krw, status, created_at, profiles(display_name, avatar_url), events(title)')
      .order('created_at', { ascending: false })
      .limit(8),
  ])

  const paidOrders = (allOrders ?? []).filter((o: any) => o.status === 'paid')
  const monthOrders = paidOrders.filter((o: any) => o.created_at >= monthStart)
  const grossRevenue = paidOrders.reduce((s: number, o: any) => s + (o.amount_krw || 0), 0)
  const monthRevenue = monthOrders.reduce((s: number, o: any) => s + (o.amount_krw || 0), 0)
  const todayRevenue = (todayOrders ?? []).reduce((s: number, o: any) => s + (o.amount_krw || 0), 0)

  const kpis = [
    { label: 'Total Users', value: totalUsers?.toLocaleString() ?? '—', sub: `+${newUsersWeek} this week`, icon: '👥', href: '/admin/users' },
    { label: 'Gross Revenue', value: '₩' + grossRevenue.toLocaleString(), sub: '₩' + monthRevenue.toLocaleString() + ' this month', icon: '💰', href: '/admin/orders' },
    { label: "Today's Revenue", value: '₩' + todayRevenue.toLocaleString(), sub: `${todayOrders?.length ?? 0} paid orders today`, icon: '📈', href: '/admin/orders' },
    { label: 'Live Events', value: totalEvents?.toLocaleString() ?? '—', sub: pendingEvents ? `${pendingEvents} awaiting review` : 'All reviewed', icon: '🎪', href: '/admin/events', alert: (pendingEvents ?? 0) > 0 },
    { label: 'Open CS Tickets', value: openCs?.toLocaleString() ?? '0', sub: (openCs ?? 0) > 0 ? 'Needs attention' : 'All clear', icon: '🎫', href: '/admin/cs', alert: (openCs ?? 0) > 0 },
  ]

  const STATUS_COLOR: Record<string, string> = {
    paid: '#16a34a', free_confirmed: '#2563eb', pending: '#d97706', cancelled: '#dc2626', failed: '#9333ea',
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, fontSize: 26, color: '#111', letterSpacing: '-0.04em', marginBottom: 4 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: '#888' }}>
          {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 28 }}>
        {kpis.map(k => (
          <Link key={k.label} href={k.href} style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', border: k.alert ? '2px solid #fca5a5' : '1px solid #E8E8E4', cursor: 'pointer', transition: 'box-shadow 0.15s' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 22 }}>{k.icon}</span>
                {k.alert && <span style={{ fontSize: 10, background: '#fef2f2', color: '#dc2626', padding: '2px 8px', borderRadius: 20, fontWeight: 800 }}>!</span>}
              </div>
              <div style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, fontSize: 22, color: '#111', letterSpacing: '-0.04em', marginBottom: 4 }}>{k.value}</div>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{k.label}</div>
              <div style={{ fontSize: 11, color: k.alert ? '#dc2626' : '#aaa' }}>{k.sub}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8E8E4', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid #F4F4F4' }}>
          <h2 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 16, color: '#111', letterSpacing: '-0.03em' }}>Recent Orders</h2>
          <Link href="/admin/orders" style={{ fontSize: 12, color: '#888', textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
        </div>
        <div>
          {(recentOrders ?? []).map((o: any) => (
            <div key={o.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid #F8F8F8', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                {o.profiles?.avatar_url
                  ? <img src={o.profiles.avatar_url} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} alt="" />
                  : <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F5C400', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#111', flexShrink: 0 }}>
                      {(o.profiles?.display_name || '?')[0].toUpperCase()}
                    </div>
                }
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 700, fontSize: 13, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {o.profiles?.display_name || 'Unknown'}
                  </p>
                  <p style={{ fontSize: 11, color: '#aaa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {o.events?.title || '—'}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>
                  {o.amount_krw ? '₩' + Number(o.amount_krw).toLocaleString() : 'Free'}
                </span>
                <span style={{ fontSize: 10, fontWeight: 800, color: STATUS_COLOR[o.status] || '#888', background: STATUS_COLOR[o.status] ? STATUS_COLOR[o.status] + '18' : '#F4F4F4', padding: '3px 8px', borderRadius: 20 }}>
                  {o.status}
                </span>
                <span style={{ fontSize: 11, color: '#ccc' }}>
                  {new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
