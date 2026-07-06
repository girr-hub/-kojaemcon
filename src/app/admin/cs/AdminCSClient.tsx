'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

const STATUS_COLORS: Record<string, string> = {
  open: '#dc2626', in_progress: '#D4B33A', resolved: '#15803d', closed: '#6B6B6B',
}

export default function AdminCSClient({ tickets }: { tickets: any[] }) {
  const [list, setList] = useState(tickets)
  const [selected, setSelected] = useState<any>(null)
  const [reply, setReply] = useState('')
  const [saving, setSaving] = useState(false)

  const submitReply = async () => {
    if (!reply.trim() || !selected) return
    setSaving(true)
    const sb = supabase()
    await sb.from('cs_tickets').update({ admin_reply: reply, status: 'resolved', replied_at: new Date().toISOString() }).eq('id', selected.id)
    setSaving(false)
    setList(prev => prev.map(t => t.id === selected.id ? { ...t, admin_reply: reply, status: 'resolved' } : t))
    setSelected((p: any) => ({ ...p, admin_reply: reply, status: 'resolved' }))
    setReply('')
  }

  const updateStatus = async (id: string, status: string) => {
    const sb = supabase()
    await sb.from('cs_tickets').update({ status }).eq('id', id)
    setList(prev => prev.map(t => t.id === id ? { ...t, status } : t))
    if (selected?.id === id) setSelected((p: any) => ({ ...p, status }))
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 28, color: '#0A0A0A', letterSpacing: '-0.04em', marginBottom: 24 }}>CS Tickets</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, minHeight: '70vh' }}>
        <div style={{ background: '#F8F8F6', border: '1.5px solid #E8E8E4', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #E8E8E4', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 800, fontSize: 13, color: '#0A0A0A' }}>Tickets</span>
            <span style={{ fontSize: 12, color: '#9A9A9A' }}>{list.filter(t => t.status === 'open').length} open</span>
          </div>
          <div style={{ overflowY: 'auto', maxHeight: '70vh' }}>
            {list.map(t => (
              <div key={t.id} onClick={() => setSelected(t)} style={{ padding: '14px 20px', borderBottom: '1px solid #E8E8E4', cursor: 'pointer', background: selected?.id === t.id ? '#fff' : 'transparent' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#0A0A0A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>{t.subject}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: STATUS_COLORS[t.status] || '#999', textTransform: 'uppercase', flexShrink: 0 }}>{t.status}</span>
                </div>
                <div style={{ fontSize: 11, color: '#9A9A9A' }}>{t.name} · {t.category}</div>
                <div style={{ fontSize: 11, color: '#C4C4C0' }}>{new Date(t.created_at).toLocaleDateString()}</div>
              </div>
            ))}
            {list.length === 0 && <p style={{ padding: 20, fontSize: 13, color: '#9A9A9A' }}>No tickets yet</p>}
          </div>
        </div>

        {selected ? (
          <div style={{ background: '#fff', border: '1.5px solid #E8E8E4', borderRadius: 14, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#9A9A9A', marginBottom: 4 }}>{selected.category}</p>
                <h2 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 20, color: '#0A0A0A' }}>{selected.subject}</h2>
                <p style={{ fontSize: 12, color: '#9A9A9A', marginTop: 4 }}>{selected.name} · {selected.email} · {new Date(selected.created_at).toLocaleString()}</p>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['open', 'in_progress', 'resolved', 'closed'].map(s => (
                  <button key={s} onClick={() => updateStatus(selected.id, s)}
                    style={{ padding: '5px 10px', borderRadius: 100, fontSize: 10, fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase',
                      background: selected.status === s ? '#0A0A0A' : '#F8F8F6', color: selected.status === s ? '#fff' : '#9A9A9A', border: '1.5px solid #E8E8E4' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ background: '#F8F8F6', borderRadius: 12, padding: 20, marginBottom: 24 }}>
              <p style={{ fontSize: 14, color: '#3A3A3A', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>{selected.message}</p>
            </div>
            {selected.admin_reply && (
              <div style={{ background: '#0A0A0A', borderRadius: 12, padding: 20, marginBottom: 24 }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#D4B33A', marginBottom: 8 }}>Your reply</p>
                <p style={{ fontSize: 14, color: '#fff', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>{selected.admin_reply}</p>
              </div>
            )}
            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#9A9A9A', display: 'block', marginBottom: 8 }}>Reply</label>
            <textarea className="input-base" rows={5} style={{ resize: 'none', marginBottom: 12 }} placeholder="Type your reply..." value={reply} onChange={e => setReply(e.target.value)} />
            <button onClick={submitReply} disabled={saving || !reply.trim()} className="btn-primary" style={{ padding: '12px 24px' }}>
              {saving ? 'Sending...' : 'Send reply & mark resolved'}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C4C4C0', fontSize: 14, background: '#F8F8F6', borderRadius: 14, border: '1.5px solid #E8E8E4' }}>
            Select a ticket to view details
          </div>
        )}
      </div>
    </div>
  )
}
