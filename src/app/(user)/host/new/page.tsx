import { supabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EventForm from '@/components/EventForm'
import Link from 'next/link'

export default async function NewHostEvent() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', paddingBottom: 100 }}>
      {/* 헤더 */}
      <div style={{ position: 'sticky', top: 52, zIndex: 100, background: '#FFFFFF', borderBottom: '1px solid #F0F0F0', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '50%', background: '#F7F7F7', textDecoration: 'none', fontSize: 16 }}>←</Link>
        <h1 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 17, color: '#1A1A1A', letterSpacing: '-0.03em' }}>Host an Event</h1>
      </div>

      {/* 안내 배너 */}
      <div style={{ margin: '16px 16px 0', background: '#FFFBEA', borderRadius: 14, padding: '14px 16px', border: '1px solid #F5E87C' }}>
        <p style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontSize: 13, color: '#7A6100', lineHeight: 1.6 }}>
          💡 Fill in the details below and our team will review your event within 24 hours.
        </p>
      </div>

      {/* 폼 */}
      <div style={{ padding: '20px 16px' }}>
        <EventForm mode="host" />
      </div>
    </div>
  )
}
