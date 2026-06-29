import { supabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MyPageClient from './MyPageClient'

export default async function MyPage() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await sb.from('profiles').select('*').eq('id', user.id).single()

  const { data: tickets } = await sb.from('orders')
    .select('*, events(*)')
    .eq('user_id', user.id)
    .in('status', ['paid', 'free_confirmed'])
    .order('created_at', { ascending: false })

  const { data: hosted } = await sb.from('events')
    .select('*').eq('host_id', user.id).order('created_at', { ascending: false })

  return (
    <MyPageClient
      user={user}
      tickets={tickets ?? []}
      hosted={hosted ?? []}
      profile={profile}
    />
  )
}
