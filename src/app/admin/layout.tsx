import Link from 'next/link'
import { supabaseServer, supabaseAdmin } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await sb.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  // 미답변 CS 티켓 수
  const admin = supabaseAdmin()
  const { count: openCs } = await admin.from('cs_tickets')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'open')

  const nav = [
    ['Dashboard', '/admin'],
    ['Events', '/admin/events'],
    ['Users', '/admin/users'],
    ['Orders', '/admin/orders'],
    ['Payouts', '/admin/payouts'],
    ['Magazine', '/admin/magazine'],
    ['CS Tickets', '/admin/cs', openCs],
    ['Attendance', '/admin/attendance'],
    ['Site settings', '/admin/site-settings'],
    ['ERP Dashboard', '/admin/erp'],
    ['공계정 관리', '/admin/fake-users'],
    ['스폰서 배너', '/admin/banners'],
  ]

  return (
    <div className="flex min-h-screen bg-bg" data-admin="true" style={{ maxWidth: '100vw', width: '100vw', marginLeft: 'calc(-50vw + 50%)', position: 'relative' }}>
      <aside className="w-64 bg-surface p-6 sub-en" style={{ borderRight: '1px solid #E8E8E4', flexShrink: 0 }}>
        <div className="headline-kr text-primary text-3xl mb-1">ㅋㅈㅋ</div>
        <div className="text-xs uppercase tracking-widest text-ink/50 mb-8">Admin</div>
        <nav className="space-y-1">
          {nav.map(([l, h, badge]) => (
            <Link key={h} href={h} className="block uppercase text-sm hover:text-primary py-1.5"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{l}</span>
              {badge && Number(badge) > 0 && (
                <span style={{ background: '#E55', color: '#fff', borderRadius: 10, padding: '1px 7px', fontSize: 11, fontWeight: 700, minWidth: 18, textAlign: 'center' }}>
                  {badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
