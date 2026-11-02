'use client'
import { useState, useMemo } from 'react'

function exportToCSV(data: any[], filename: string) {
  if (!data.length) return
  const headers = Object.keys(data[0])
  const rows = data.map(row => headers.map(h => {
    const v = row[h]
    if (v === null || v === undefined) return ''
    const s = String(v).replace(/"/g, '""')
    return s.includes(',') || s.includes('\n') ? '"' + s + '"' : s
  }).join(','))
  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

const STATUS_BG: Record<string, string> = {
  paid: '#dcfce7', free_confirmed: '#dbeafe',
  pending: '#fef9c3', cancelled: '#fee2e2', failed: '#fce7f3',
}
const STATUS_FG: Record<string, string> = {
  paid: '#15803d', free_confirmed: '#1d4ed8',
  pending: '#854d0e', cancelled: '#dc2626', failed: '#9d174d',
}

export default function AdminOrdersClient({ orders, events }: { orders: any[]; events: any[] }) {
  const [view, setView] = useState<'byEvent' | 'all'>('byEvent')
  const [selectedEvent, setSelectedEvent] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  const filteredOrders = useMemo(() => {
    let o = orders
    if (selectedEvent !== 'all') o = o.filter(x => x.events?.id === selectedEvent)
    if (statusFilter !== 'all') o = o.filter(x => x.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      o = o.filter(x =>
        x.profiles?.display_name?.toLowerCase().includes(q) ||
        x.profiles?.real_name?.toLowerCase().includes(q) ||
        x.profiles?.email?.toLowerCase().includes(q) ||
        x.events?.title?.toLowerCase().includes(q)
      )
    }
    return o
  }, [orders, selectedEvent, statusFilter, search])

  const eventStats = useMemo(() => {
    const map: Record<string, any> = {}
    orders.forEach(o => {
      const eid = o.events?.id
      const title = o.events?.title || 'Unknown'
      if (!eid) return
      if (!map[eid]) map[eid] = { id: eid, title, total: 0, paid: 0, free: 0, cancelled: 0, revenue: 0 }
      map[eid].total++
      if (o.status === 'paid') { map[eid].paid++; map[eid].revenue += o.amount_krw || 0 }
      else if (o.status === 'free_confirmed') map[eid].free++
      else if (o.status === 'cancelled') map[eid].cancelled++
    })
    return Object.values(map).sort((a: any, b: any) => b.total - a.total)
  }, [orders])

  const exportOrders = () => {
    const rows = filteredOrders.map(o => ({
      Event: o.events?.title || '',
      'Display Name': o.profiles?.display_name || '',
      'Real Name': o.profiles?.real_name || '',
      Email: o.profiles?.email || '',
      Phone: o.profiles?.phone || '',
      Nationality: o.profiles?.nationality || '',
      Gender: o.profiles?.gender || '',
      Age: o.profiles?.birth_date ? new Date().getFullYear() - new Date(o.profiles.birth_date).getFullYear() : '',
      Amount: o.amount_krw,
      Quantity: o.quantity,
      Status: o.status,
      Date: new Date(o.created_at).toLocaleDateString('en-US'),
    }))
    exportToCSV(rows, 'kogemcon_orders_' + new Date().toISOString().slice(0, 10) + '.csv')
  }

  const exportEventStats = () => {
    exportToCSV(eventStats.map((e: any) => ({
      Event: e.title, Total: e.total, Paid: e.paid, Free: e.free, Cancelled: e.cancelled, Revenue: e.revenue,
    })), 'kogemcon_event_stats_' + new Date().toISOString().slice(0, 10) + '.csv')
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, fontSize: 26, color: '#111', letterSpacing: '-0.04em' }}>Orders</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={exportEventStats} style={{ padding: '8px 16px', borderRadius: 8, border: '1.5px solid #E8E8E4', background: '#F8F8F6', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
            📊 Event Stats CSV
          </button>
          <button onClick={exportOrders} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#111', color: '#F5C400', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
            📥 Export Orders
          </button>
        </div>
      </div>

      {/* View toggle */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#F4F4F4', padding: 4, borderRadius: 10, width: 'fit-content' }}>
        {[{ id: 'byEvent', label: 'By Event' }, { id: 'all', label: 'All Orders' }].map(t => (
          <button key={t.id} onClick={() => setView(t.id as any)}
            style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none',
              background: view === t.id ? '#111' : 'transparent', color: view === t.id ? '#fff' : '#888',
              fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
            {t.label}
          </button>
        ))}
      </div>

      {view === 'byEvent' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {eventStats.map((ev: any) => (
            <div key={ev.id} style={{ background: '#fff', border: '1px solid #E8E8E4', borderRadius: 14, padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                <h3 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 15, color: '#111' }}>{ev.title}</h3>
                <button onClick={() => { setSelectedEvent(ev.id); setView('all') }}
                  style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #E8E8E4', background: '#F8F8F6', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
                  View orders →
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                {[
                  { label: 'Total', value: ev.total, color: '#111' },
                  { label: 'Paid', value: ev.paid, color: '#15803d' },
                  { label: 'Free', value: ev.free, color: '#1d4ed8' },
                  { label: 'Cancelled', value: ev.cancelled, color: '#dc2626' },
                  { label: 'Revenue', value: '₩' + ev.revenue.toLocaleString(), color: '#92400e' },
                ].map(s => (
                  <div key={s.label} style={{ background: '#F8F8F8', borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: s.color, fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: '#aaa', marginTop: 2, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name, email, event..."
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #E8E8E4', fontSize: 13, background: '#fff', minWidth: 220, fontFamily: 'PretendardVariable, Pretendard, sans-serif', outline: 'none' }}
            />
            <select value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #E8E8E4', fontSize: 13, background: '#fff', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
              <option value="all">All events</option>
              {events.map((e: any) => <option key={e.id} value={e.id}>{e.title}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #E8E8E4', fontSize: 13, background: '#fff', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
              <option value="all">All statuses</option>
              {['paid', 'free_confirmed', 'pending', 'cancelled', 'failed'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <span style={{ fontSize: 13, color: '#aaa', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>{filteredOrders.length} orders</span>
            {(selectedEvent !== 'all' || statusFilter !== 'all' || search) && (
              <button onClick={() => { setSelectedEvent('all'); setStatusFilter('all'); setSearch('') }}
                style={{ fontSize: 12, color: '#888', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                Clear filters
              </button>
            )}
          </div>

          {/* Table */}
          <div style={{ overflow: 'auto', borderRadius: 12, border: '1px solid #E8E8E4' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F8F8F8' }}>
                  {['Event', 'Name', 'Real Name', 'Email', 'Phone', 'Nationality', 'Gender', 'Age', 'Amount', 'Qty', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#aaa', letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid #E8E8E4', whiteSpace: 'nowrap', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid #F5F5F5' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#FAFAFA')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}>
                    <td style={{ padding: '10px 12px', fontWeight: 600, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>{o.events?.title}</td>
                    <td style={{ padding: '10px 12px', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>{o.profiles?.display_name}</td>
                    <td style={{ padding: '10px 12px', color: '#666' }}>{o.profiles?.real_name || '—'}</td>
                    <td style={{ padding: '10px 12px', color: '#666', fontSize: 12 }}>{o.profiles?.email}</td>
                    <td style={{ padding: '10px 12px', color: '#666', fontSize: 12 }}>{o.profiles?.phone || '—'}</td>
                    <td style={{ padding: '10px 12px', color: '#666', fontSize: 12 }}>{o.profiles?.nationality || '—'}</td>
                    <td style={{ padding: '10px 12px', color: '#666', fontSize: 12 }}>{o.profiles?.gender || '—'}</td>
                    <td style={{ padding: '10px 12px', color: '#666', fontSize: 12 }}>{o.profiles?.birth_date ? new Date().getFullYear() - new Date(o.profiles.birth_date).getFullYear() : '—'}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 700, whiteSpace: 'nowrap' }}>{o.amount_krw === 0 ? 'FREE' : '₩' + o.amount_krw?.toLocaleString()}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>{o.quantity}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: STATUS_BG[o.status] || '#F8F8F6', color: STATUS_FG[o.status] || '#666', whiteSpace: 'nowrap' }}>
                        {o.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', color: '#aaa', fontSize: 12, whiteSpace: 'nowrap' }}>{new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
