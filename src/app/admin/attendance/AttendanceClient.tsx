'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function AttendanceClient({ events }: { events: any[] }) {
  const [eventId, setEventId] = useState('')
  const [attendees, setAttendees] = useState<any[]>([])
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  const loadAttendees = async (eid: string) => {
    if (!eid) return
    setLoading(true)
    const sb = supabase()
    const { data: orders } = await sb.from('orders')
      .select('user_id, profiles(display_name, avatar_url, nationality)')
      .eq('event_id', eid)
      .in('status', ['paid', 'free_confirmed'])
    const { data: existing } = await sb.from('attendances').select('user_id').eq('event_id', eid)
    setChecked(new Set(existing?.map((a: any) => a.user_id) ?? []))
    setAttendees(orders ?? [])
    setLoading(false)
  }

  const toggleAttendance = async (userId: string) => {
    if (!eventId) return
    const sb = supabase()
    if (checked.has(userId)) {
      await sb.from('attendances').delete().eq('event_id', eventId).eq('user_id', userId)
      setChecked(prev => { const n = new Set(prev); n.delete(userId); return n })
    } else {
      await sb.from('attendances').upsert({ event_id: eventId, user_id: userId }, { onConflict: 'event_id,user_id' })
      setChecked(prev => new Set([...prev, userId]))
    }
  }

  const filtered = attendees.filter(a => {
    if (!search) return true
    return (a.profiles?.display_name ?? '').toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div>
      <h1 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 28, letterSpacing: '-0.04em', color: '#0A0A0A', marginBottom: 24 }}>Attendance Check</h1>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
        <select className="input-base" style={{ maxWidth: 360 }} value={eventId}
          onChange={e => { setEventId(e.target.value); loadAttendees(e.target.value) }}>
          <option value="">Select event</option>
          {events.map((e: any) => (
            <option key={e.id} value={e.id}>{e.title} — {new Date(e.starts_at).toLocaleDateString()}</option>
          ))}
        </select>
        {attendees.length > 0 && (
          <span style={{ fontSize: 13, fontWeight: 700, color: '#15803d' }}>
            ✅ {checked.size} / {attendees.length} checked in
          </span>
        )}
      </div>

      {attendees.length > 0 && (
        <input className="input-base" placeholder="Search by name..." style={{ maxWidth: 300, marginBottom: 16 }}
          value={search} onChange={e => setSearch(e.target.value)} />
      )}

      {loading ? (
        <p style={{ color: '#9A9A9A', fontSize: 14 }}>Loading...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((a: any) => {
            const uid = a.user_id
            const isChecked = checked.has(uid)
            return (
              <div key={uid} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', borderRadius: 12,
                background: isChecked ? '#f0fdf4' : '#F8F8F6',
                border: `1.5px solid ${isChecked ? '#86efac' : '#E8E8E4'}`,
                transition: 'all 0.15s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', background: '#E8E8E4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#9A9A9A', flexShrink: 0 }}>
                    {a.profiles?.avatar_url
                      ? <img src={a.profiles.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                      : (a.profiles?.display_name?.[0] ?? '?').toUpperCase()
                    }
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 14, color: '#0A0A0A' }}>{a.profiles?.display_name || 'Unknown'}</p>
                    <p style={{ fontSize: 11, color: '#9A9A9A' }}>{a.profiles?.nationality}</p>
                  </div>
                </div>
                <button onClick={() => toggleAttendance(uid)}
                  style={{ padding: '8px 18px', borderRadius: 100, fontSize: 13, fontWeight: 700, cursor: 'pointer', minWidth: 110,
                    background: isChecked ? '#15803d' : '#0A0A0A', color: '#fff', border: 'none', transition: 'all 0.15s' }}>
                  {isChecked ? '✅ Present' : 'Check In'}
                </button>
              </div>
            )
          })}
          {filtered.length === 0 && attendees.length > 0 && <p style={{ fontSize: 13, color: '#9A9A9A' }}>No results</p>}
          {attendees.length === 0 && eventId && !loading && <p style={{ fontSize: 13, color: '#9A9A9A' }}>No registered attendees</p>}
        </div>
      )}
    </div>
  )
}
