'use client'
import { useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase/client'

const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  open:        { bg: '#fee2e2', text: '#dc2626' },
  in_progress: { bg: '#fef9c3', text: '#a16207' },
  resolved:    { bg: '#dcfce7', text: '#15803d' },
  closed:      { bg: '#f3f4f6', text: '#6b7280' },
}

export default function AdminCSClient({ tickets }: { tickets: any[] }) {
  const [list, setList] = useState(tickets)
  const [selected, setSelected] = useState<any>(null)
  const [reply, setReply] = useState('')
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved' | 'closed'>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let l = list
    if (filter !== 'all') l = l.filter(t => t.status === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      l = l.filter(t => t.subject?.toLowerCase().includes(q) || t.name?.toLowerCase().includes(q) || t.email?.toLowerCase().includes(q))
    }
    return l
  }, [list, filter, search])

  const counts = useMemo(() => ({
    open: list.filter(t => t.status === 'open').length,
    in_progress: list.filter(t => t.status === 'in_progress').length,
    resolved: list.filter(t => t.status === 'resolved').length,
  }), [list])

  const submitReply = async () => {
    if (!reply.trim() || !selected) return
    setSaving(true)
    const sb = supabase()
    await sb.from('cs_tickets').update({ admin_reply: reply, status: 'resolved', replied_at: new Date().toISOString() }).eq('id', selected.id)
    fetch('/api/admin/cs-reply', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticket_id: selected.id, reply })
    }).catch(console.error)
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, fontSize: 26, color: '#111', letterSpacing: '-0.04em' }}>CS Tickets</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          {counts.open > 0 && <span style={{ fontSize: 12, background: '#fee2e2', color: '#dc2626', padding: '4px 10px', borderRadius: 20, fontWeight: 700 }}>{counts.open} open</span>}
          {counts.in_progress > 0 && <span style={{ fontSize: 12, background: '#fef9c3', color: '#a16207', padding: '4px 10px', borderRadius: 20, fontWeight: 700 }}>{counts.in_progress} in progress</span>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 16, minHeight: '72vh' }}>

        {/* Left: ticket list */}
        <div style={{ background: '#fff', border: '1px solid #E8E8E4', borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '12px 14px', borderBottom: '1px solid #F4F4F4' }}>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search tickets..."
              style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #E8E8E4', fontSize: 12, outline: 'none', boxSizing: 'border-box', marginBottom: 8, fontFamily: 'PretendardVariable, Pretendard, sans-serif' }} />
            <div style={{ display: 'flex', gap: 4, overflowX: 'auto', scrollbarWidth: 'none' }}>
              {(['all', 'open', 'in_progress', 'resolved', 'closed'] as const).map(s => (
                <button key={s} onClick={() => setFilter(s)}
                  style={{ padding: '4px 9px', borderRadius: 20, fontSize: 10, fontWeight: 700, cursor: 'pointer', border: 'none', whiteSpace: 'nowrap',
                    background: filter === s ? '#111' : '#F4F4F4', color: filter === s ? '#fff' : '#888', fontFamily: 'PretendardVariable, Pretendard, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {s === 'all' ? `All (${list.length})` : s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filtered.map(t => (
              <div key={t.id} onClick={() => setSelected(t)}
                style={{ padding: '12px 14px', borderBottom: '1px solid #F8F8F8', cursor: 'pointer', background: selected?.id === t.id ? '#FAFAFA' : 'transparent', borderLeft: selected?.id === t.id ? '3px solid #F5C400' : '3px solid transparent', transition: 'all 0.1s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>{t.subject}</span>
                  <span style={{ fontSize: 9, fontWeight: 800, color: STATUS_COLOR[t.status]?.text || '#888', textTransform: 'uppercase', flexShrink: 0 }}>{t.status.replace('_', ' ')}</span>
                </div>
                <div style={{ fontSize: 11, color: '#aaa' }}>{t.name} · {t.category}</div>
                <div style={{ fontSize: 10, color: '#ccc', marginTop: 1 }}>{new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
              </div>
            ))}
            {filtered.length === 0 && <p style={{ padding: 20, fontSize: 13, color: '#aaa', textAlign: 'center' }}>No tickets</p>}
          </div>
        </div>

        {/* Right: ticket detail */}
        {selected ? (
          <div style={{ background: '#fff', border: '1px solid #E8E8E4', borderRadius: 14, padding: 24, overflowY: 'auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#aaa' }}>{selected.category}</span>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 20, background: STATUS_COLOR[selected.status]?.bg, color: STATUS_COLOR[selected.status]?.text }}>
                    {selected.status.replace('_', ' ')}
                  </span>
                </div>
                <h2 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 18, color: '#111', marginBottom: 4 }}>{selected.subject}</h2>
                <p style={{ fontSize: 12, color: '#aaa' }}>{selected.name} · {selected.email} · {new Date(selected.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
              </div>
              {/* Status buttons */}
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {(['open', 'in_progress', 'resolved', 'closed'] as const).map(s => (
                  <button key={s} onClick={() => updateStatus(selected.id, s)}
                    style={{ padding: '5px 11px', borderRadius: 20, fontSize: 10, fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'PretendardVariable, Pretendard, sans-serif',
                      background: selected.status === s ? '#111' : '#F4F4F4',
                      color: selected.status === s ? '#fff' : '#888', border: 'none' }}>
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div style={{ background: '#F8F8F8', borderRadius: 12, padding: '16px 18px', marginBottom: 16 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#aaa', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Message</p>
              <p style={{ fontSize: 14, color: '#333', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{selected.message}</p>
            </div>

            {/* Existing reply */}
            {selected.admin_reply && (
              <div style={{ background: '#111', borderRadius: 12, padding: '16px 18px', marginBottom: 16 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#F5C400', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Reply sent</p>
                <p style={{ fontSize: 14, color: '#fff', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{selected.admin_reply}</p>
                {selected.replied_at && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 8 }}>{new Date(selected.replied_at).toLocaleString()}</p>}
              </div>
            )}

            {/* Reply form */}
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#aaa', display: 'block', marginBottom: 8 }}>
                {selected.admin_reply ? 'Update reply' : 'Send reply'}
              </label>
              <textarea rows={5} value={reply} onChange={e => setReply(e.target.value)}
                placeholder="Type your reply... (will be emailed to the user)"
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #E8E8E4', fontSize: 14, fontFamily: 'PretendardVariable, Pretendard, sans-serif', outline: 'none', resize: 'none', boxSizing: 'border-box', marginBottom: 10, lineHeight: 1.6, color: '#111' }} />
              <button onClick={submitReply} disabled={saving || !reply.trim()}
                style={{ padding: '11px 22px', borderRadius: 10, background: reply.trim() ? '#111' : '#E8E8E8', color: reply.trim() ? '#F5C400' : '#aaa', border: 'none', fontWeight: 800, fontSize: 13, cursor: reply.trim() ? 'pointer' : 'not-allowed', fontFamily: 'PretendardVariable, Pretendard, sans-serif', transition: 'all 0.12s' }}>
                {saving ? 'Sending...' : 'Send reply & mark resolved'}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA', borderRadius: 14, border: '1px solid #E8E8E4', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 36 }}>🎫</span>
            <p style={{ fontSize: 14, color: '#aaa', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>Select a ticket to view</p>
          </div>
        )}
      </div>
    </div>
  )
}
