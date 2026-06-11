'use client'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

type Msg = { id: string; user_id: string; body: string; created_at: string; profiles?: any }

export default function ChatRoom({ roomId, currentUserId }: { roomId: string; currentUserId: string }) {
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [text, setText] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  const sb = supabase()

  useEffect(() => {
    sb.from('chat_messages')
      .select('*, profiles(display_name, nationality, avatar_url)')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .limit(200)
      .then(({ data }) => setMsgs(data ?? []))

    const channel = sb.channel(`room:${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'chat_messages',
        filter: `room_id=eq.${roomId}`,
      }, async (payload) => {
        const { data: prof } = await sb.from('profiles')
          .select('display_name, nationality, avatar_url')
          .eq('id', payload.new.user_id).single()
        setMsgs(prev => [...prev, { ...(payload.new as Msg), profiles: prof }])
      })
      .subscribe()

    return () => { sb.removeChannel(channel) }
  }, [roomId])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  const send = async () => {
    const body = text.trim()
    if (!body) return
    setText('')
    const { error } = await sb.from('chat_messages').insert({ room_id: roomId, user_id: currentUserId, body })
    if (error) alert(error.message)
  }

  return (
    <div className="flex flex-col h-[80vh] bg-surface">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {msgs.map(m => {
          const mine = m.user_id === currentUserId
          return (
            <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] ${mine ? 'items-end' : 'items-start'} flex flex-col`}>
                {!mine && (
                  <div className="sub-en text-xs text-ink/50 mb-1">
                    {m.profiles?.display_name} · {m.profiles?.nationality}
                  </div>
                )}
                <div className={`px-4 py-2 ${mine ? 'bg-primary text-bg' : 'bg-bg text-ink'}`}>
                  {m.body}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={endRef}/>
      </div>
      <div className="flex border-t border-ink/10">
        <input value={text} onChange={e=>setText(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && send()}
               placeholder="Type a message..."
               className="flex-1 bg-bg text-ink px-4 py-3 outline-none sub-en"/>
        <button onClick={send} className="bg-primary text-bg px-6 sub-en uppercase font-bold">Send</button>
      </div>
    </div>
  )
}
