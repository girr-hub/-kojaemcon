import { supabaseServer, supabaseAdmin } from '@/lib/supabase/server'
import ChatRoom from '@/components/ChatRoom'
import { redirect } from 'next/navigation'

export default async function ChatPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/login')

  const admin = supabaseAdmin()

  const { data: order } = await admin.from('orders')
    .select('id, status')
    .eq('event_id', eventId)
    .eq('user_id', user.id)
    .in('status', ['paid', 'free_confirmed'])
    .maybeSingle()

  if (!order) return (
    <div className="min-h-screen bg-bg flex items-center justify-center text-center px-6">
      <div>
        <p className="text-5xl mb-4">ticket</p>
        <h2 className="headline-en text-3xl uppercase mb-3">Ticket Required</h2>
        <p className="sub-en text-ink/50 mb-6">You need a ticket to access this chat.</p>
        <a href="/events" className="bg-primary text-bg px-6 py-3 sub-en uppercase font-bold">Browse Events</a>
      </div>
    </div>
  )

  let { data: room } = await admin.from('chat_rooms').select('id').eq('event_id', eventId).maybeSingle()
  if (!room) {
    const { data: newRoom } = await admin.from('chat_rooms').insert({ event_id: eventId }).select('id').single()
    room = newRoom
  }
  if (!room) return <div className="p-12">Chat room error.</div>

  await admin.from('chat_members').upsert({ room_id: room.id, user_id: user.id }, { onConflict: 'room_id,user_id' })

  const { data: event } = await admin.from('events').select('title').eq('id', eventId).single()

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="headline-en text-4xl uppercase mb-4">{event?.title} Chat</h1>
      <ChatRoom roomId={room.id} currentUserId={user.id}/>
    </div>
  )
}
