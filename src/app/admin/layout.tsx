import Link from 'next/link'
import { supabaseServer, supabaseAdmin } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await sb.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  const admin = supabaseAdmin()
  const { count: openCs } = await admin.from('cs_tickets')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'open')

  const nav: [string, string, string, number?][] = [
    ['📊', 'Dashboard', '/admin'],
    ['🎪', 'Events', '/admin/events'],
    ['👥', 'Users', '/admin/users'],
    ['🧾', 'Orders', '/admin/orders'],
    ['💸', 'Payouts', '/admin/payouts'],
    ['📮', 'Magazine', '/admin/magazine'],
    ['🎫', 'CS Tickets', '/admin/cs', openCs ?? 0],
    ['✅', 'Attendance', '/admin/attendance'],
    ['🏔', 'Experience', '/admin/experience'],
    ['🌟', 'Talent', '/admin/talent'],
    ['🏳', 'Banners', '/admin/banners'],
    ['🤖', 'Bot Accounts', '/admin/fake-users'],
    ['⚙️', 'Site Settings', '/admin/site-settings'],
    ['📈', 'ERP / Analytics', '/admin/erp'],
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F8F8', maxWidth: '100vw', width: '100vw', marginLeft: 'calc(-50vw + 50%)', position: 'relative' }} data-admin="true">
      <aside style={{ width: 220, background: '#111', flexShrink: 0, display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        <div style={{ padding: '24px 20px 16px' }}>
          <div style={{ fontFamily: 'Righteous, sans-serif', fontSize: 18, color: '#F5C400', letterSpacing: '0.04em', marginBottom: 2 }}>KOGEMCON</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', fontWeight: 700, textTransform: 'uppercase' }}>Admin Panel</div>
        </div>
        <nav style={{ padding: '0 10px', flex: 1 }}>
          {nav.map(([icon, label, href, badge]) => (
            <Link key={href} href={href}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', borderRadius: 9, fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', marginBottom: 2, transition: 'all 0.12s', fontFamily: 'PretendardVariable, Pretendard, sans-serif', letterSpacing: '-0.01em' }}
              onMouseEnter={undefined}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{ fontSize: 15, width: 20, textAlign: 'center' }}>{icon}</span>
                <span>{label}</span>
              </span>
              {badge && Number(badge) > 0 && (
                <span style={{ background: '#ef4444', color: '#fff', borderRadius: 10, padding: '1px 7px', fontSize: 10, fontWeight: 800, minWidth: 18, textAlign: 'center' }}>
                  {badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '12px 20px 20px', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 8 }}>
          <Link href="/" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>← Back to site</Link>
        </div>
      </aside>
      <main style={{ flex: 1, padding: '32px', overflowX: 'auto' }}>{children}</main>
    </div>
  )
}
