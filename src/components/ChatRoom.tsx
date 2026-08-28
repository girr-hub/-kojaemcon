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
    await sb.from('chat_messages').insert({ room_id: roomId, user_id: currentUserId, body })
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const formatTime = (ts: string) => new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', background: '#F5F5F5' }}>

      {/* 메시지 목록 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {msgs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#9A9A9A', fontSize: 14 }}>
            No messages yet. Say hello!
          </div>
        )}
        {msgs.map(m => {
          const mine = m.user_id === currentUserId
          const name = m.profiles?.display_name || 'Guest'
          const avatar = m.profiles?.avatar_url

          return (
            <div key={m.id} style={{ display: 'flex', flexDirection: mine ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 8 }}>
              {/* 아바타 */}
              {!mine && (
                <div style={{ flexShrink: 0 }}>
                  {avatar ? (
                    <img src={avatar} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} alt="" />
                  ) : (
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E9C000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#1A1A1A' }}>
                      {name[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
              )}

              <div style={{ maxWidth: '70%', display: 'flex', flexDirection: 'column', alignItems: mine ? 'flex-end' : 'flex-start', gap: 3 }}>
                {!mine && (
                  <span style={{ fontSize: 11, color: '#9A9A9A', fontFamily: 'PretendardVariable, Pretendard, sans-serif', marginLeft: 4 }}>{name}</span>
                )}
                <div style={{
                  background: mine ? '#1A1A1A' : '#FFFFFF',
                  color: mine ? '#FFFFFF' : '#1A1A1A',
                  borderRadius: mine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  padding: '10px 14px',
                  fontSize: 14,
                  fontFamily: 'PretendardVariable, Pretendard, sans-serif',
                  lineHeight: 1.5,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                }}>
                  {m.body}
                </div>
                <span style={{ fontSize: 10, color: '#BBB', marginLeft: mine ? 0 : 4, marginRight: mine ? 4 : 0 }}>
                  {formatTime(m.created_at)}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={endRef} />
      </div>

      {/* 입력창 */}
      <div style={{ background: '#FFFFFF', borderTop: '1px solid #F0F0F0', padding: '10px 16px', paddingBottom: 'calc(10px + env(safe-area-inset-bottom))', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Message..."
          rows={1}
          style={{
            flex: 1, padding: '10px 14px', borderRadius: 20, border: '1.5px solid #F0F0F0',
            fontSize: 14, fontFamily: 'PretendardVariable, Pretendard, sans-serif',
            resize: 'none', outline: 'none', background: '#F7F7F7',
            lineHeight: 1.5, maxHeight: 100, overflowY: 'auto',
          }}
        />
        <button onClick={send} disabled={!text.trim()}
          style={{
            width: 40, height: 40, borderRadius: '50%', border: 'none',
            background: text.trim() ? '#1A1A1A' : '#F0F0F0',
            color: text.trim() ? '#E9C000' : '#9A9A9A',
            cursor: text.trim() ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'all 0.15s',
          }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
