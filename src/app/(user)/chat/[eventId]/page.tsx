import { supabaseServer } from '@/lib/supabase/server'
import ChatRoom from '@/components/ChatRoom'
import { redirect } from 'next/navigation'

export default async function ChatPage({ params }: { params: { eventId: string }}) {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/login')

  const { data: room } = await sb.from('chat_rooms').select('id').eq('event_id', params.eventId).single()
  if (!room) return <div className="p-12">Chat opens after your ticket is confirmed.</div>

  // 멤버십 체크 (RLS도 막지만 UX용)
  const { data: member } = await sb.from('chat_members')
    .select('user_id').eq('room_id', room.id).eq('user_id', user.id).maybeSingle()
  if (!member) return <div className="p-12">Members only. Buy a ticket first.</div>

  const { data: event } = await sb.from('events').select('title').eq('id', params.eventId).single()

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="headline-en text-4xl uppercase mb-4">{event?.title} · Chat</h1>
      <ChatRoom roomId={room.id} currentUserId={user.id}/>
    </div>
  )
}
