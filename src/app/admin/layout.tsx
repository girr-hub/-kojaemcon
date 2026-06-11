import { supabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await sb.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  const nav = [
    ['Dashboard','/admin'],
    ['Events','/admin/events'],
    ['Users','/admin/users'],
    ['Orders','/admin/orders'],
    ['Payouts','/admin/payouts'],
    ['Site settings','/admin/site-settings'],
  ]

  return (
    <div className="flex min-h-screen bg-bg">
      <aside className="w-64 bg-surface p-6 sub-en">
        <div className="headline-kr text-primary text-3xl mb-1">ㅋㅈㅋ</div>
        <div className="text-xs uppercase tracking-widest text-ink/50 mb-8">Admin</div>
        <nav className="space-y-2">
          {nav.map(([l,h])=>(
            <Link key={h} href={h} className="block uppercase text-sm hover:text-primary">{l}</Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
