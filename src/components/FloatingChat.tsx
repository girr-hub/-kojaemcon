'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function FloatingChat() {
  const pathname = usePathname()
  const [rooms, setRooms] = useState<any[]>([])
  const [unread, setUnread] = useState<Record<string, number>>({})
  const [showMenu, setShowMenu] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const sb = supabase()
    sb.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      setUser(user)

      // 참여한 이벤트의 채팅방 가져오기
      const { data: orders } = await sb
        .from('orders')
        .select('event_id, events(id, title, slug)')
        .eq('user_id', user.id)
        .in('status', ['paid', 'free_confirmed'])

      if (!orders?.length) return

      const eventIds = orders.map((o: any) => o.event_id)

      // 미래 이벤트만 (ends_at이 없거나 미래인 것)
      const now = new Date().toISOString()
      const { data: chatRooms } = await sb
        .from('chat_rooms')
        .select('id, event_id, events(title, ends_at, starts_at)')
        .in('event_id', eventIds)

      const activeRooms = (chatRooms ?? []).filter((r: any) => {
        const event = r.events as any
        if (!event) return false
        const endsAt = event.ends_at || event.starts_at
        if (!endsAt) return true
        return new Date(endsAt) > new Date()
      })
      setRooms(activeRooms)

      // 읽지 않은 메시지 수 계산
      const unreadMap: Record<string, number> = {}
      for (const room of activeRooms) {
        const { data: member } = await sb
          .from('chat_members')
          .select('last_read_at')
          .eq('room_id', room.id)
          .eq('user_id', user.id)
          .maybeSingle()

        const lastRead = member?.last_read_at || '2000-01-01'
        const { count } = await sb
          .from('chat_messages')
          .select('*', { count: 'exact', head: true })
          .eq('room_id', room.id)
          .gt('created_at', lastRead)
          .neq('user_id', user.id)

        if (count && count > 0) unreadMap[room.id] = count
      }
      setUnread(unreadMap)

      // 실시간 업데이트
      const channel = sb.channel('chat-notifications')
      for (const room of activeRooms) {
        channel.on('postgres_changes', {
          event: 'INSERT', schema: 'public', table: 'chat_messages',
          filter: `room_id=eq.${room.id}`,
        }, (payload) => {
          if (payload.new.user_id !== user.id) {
            setUnread(prev => ({ ...prev, [room.id]: (prev[room.id] || 0) + 1 }))
          }
        })
      }
      channel.subscribe()
    })
  }, [])

  if (pathname.startsWith('/admin') || pathname.startsWith('/chat') || !user || rooms.length === 0) return null

  const totalUnread = Object.values(unread).reduce((a, b) => a + b, 0)

  return (
    <div style={{ position: 'fixed', right: 0, top: 'calc(50% + 48px)', zIndex: 8000 }}>
      {/* 채팅 버튼 */}
      <button onClick={() => setShowMenu(prev => !prev)}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#1A1A1A', color: '#fff', borderRadius: '12px 0 0 12px', padding: '10px 8px', border: 'none', cursor: 'pointer', position: 'relative', boxShadow: '-2px 0 12px rgba(0,0,0,0.15)', gap: 3 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M21 15C21 16.1 20.1 17 19 17H7L3 21V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5V15Z"/>
        </svg>
        <span style={{ fontSize: 10, fontWeight: 800, fontFamily: 'PretendardVariable, Pretendard, sans-serif', writingMode: 'vertical-rl' as any }}>Chat</span>
        {totalUnread > 0 && (
          <div style={{ position: 'absolute', top: -6, left: -6, background: '#DC2626', color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>
            {totalUnread > 9 ? '9+' : totalUnread}
          </div>
        )}
      </button>

      {/* 채팅방 목록 */}
      {showMenu && (
        <>
          <div onClick={() => setShowMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: -1 }} />
          <div style={{ position: 'absolute', right: '100%', bottom: 0, background: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', border: '1px solid #F0F0F0', overflow: 'hidden', minWidth: 200, marginRight: 8 }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid #F0F0F0' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#9A9A9A', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>MY CHATS</p>
            </div>
            {rooms.map(room => (
              <Link key={room.id} href={`/chat/${room.event_id}`} onClick={() => { setShowMenu(false); setUnread(prev => ({ ...prev, [room.id]: 0 })) }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', textDecoration: 'none', borderBottom: '1px solid #F5F5F5' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', fontFamily: 'PretendardVariable, Pretendard, sans-serif', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {(room.events as any)?.title || 'Chat'}
                </span>
                {unread[room.id] > 0 && (
                  <span style={{ background: '#DC2626', color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, flexShrink: 0, marginLeft: 8 }}>
                    {unread[room.id] > 9 ? '9+' : unread[room.id]}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
