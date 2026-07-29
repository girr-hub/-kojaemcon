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
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

const STATUS_COLORS: Record<string, string> = {
  paid: '#dcfce7', free_confirmed: '#dbeafe',
  pending: '#fef9c3', cancelled: '#fee2e2', failed: '#fce7f3',
}
const STATUS_TEXT: Record<string, string> = {
  paid: '#15803d', free_confirmed: '#1d4ed8',
  pending: '#854d0e', cancelled: '#dc2626', failed: '#9d174d',
}

export default function AdminOrdersClient({ orders, events }: { orders: any[]; events: any[] }) {
  const [view, setView] = useState<'byEvent' | 'all'>('byEvent')
  const [selectedEvent, setSelectedEvent] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredOrders = useMemo(() => {
    let o = orders
    if (selectedEvent !== 'all') o = o.filter(x => x.events?.id === selectedEvent)
    if (statusFilter !== 'all') o = o.filter(x => x.status === statusFilter)
    return o
  }, [orders, selectedEvent, statusFilter])

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
      이벤트: o.events?.title || '',
      이름: o.profiles?.display_name || '',
      실명: o.profiles?.real_name || '',
      이메일: o.profiles?.email || '',
      금액: o.amount_krw,
      수량: o.quantity,
      상태: o.status,
      날짜: new Date(o.created_at).toLocaleDateString('ko-KR'),
    }))
    exportToCSV(rows, 'kogemcon_orders_' + new Date().toISOString().slice(0,10) + '.csv')
  }

  const exportEventStats = () => {
    exportToCSV(eventStats.map((e: any) => ({
      이벤트: e.title, 총참가자: e.total, 유료: e.paid, 무료: e.free, 취소: e.cancelled, 매출: e.revenue,
    })), 'kogemcon_event_stats_' + new Date().toISOString().slice(0,10) + '.csv')
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 28, letterSpacing: '-0.04em' }}>Orders</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={exportEventStats} style={{ padding: '8px 16px', borderRadius: 8, border: '1.5px solid #E8E8E4', background: '#F8F8F6', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            📊 이벤트 통계 CSV
          </button>
          <button onClick={exportOrders} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#0A0A0A', color: '#E9C000', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            📥 주문 CSV 추출
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#F8F8F6', padding: 4, borderRadius: 10, width: 'fit-content' }}>
        {[{id:'byEvent',label:'이벤트별 현황'},{id:'all',label:'전체 주문'}].map(t => (
          <button key={t.id} onClick={() => setView(t.id as any)}
            style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none',
              background: view === t.id ? '#0A0A0A' : 'transparent', color: view === t.id ? '#fff' : '#6B6B6B' }}>
            {t.label}
          </button>
        ))}
      </div>

      {view === 'byEvent' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {eventStats.map((ev: any) => (
            <div key={ev.id} style={{ background: '#fff', border: '1.5px solid #E8E8E4', borderRadius: 14, padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <h3 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 15, color: '#0A0A0A' }}>{ev.title}</h3>
                <button onClick={() => { setSelectedEvent(ev.id); setView('all') }}
                  style={{ padding: '5px 12px', borderRadius: 6, border: '1.5px solid #E8E8E4', background: '#F8F8F6', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  주문 보기 →
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                {[
                  { label: '총 참가', value: ev.total, color: '#0A0A0A' },
                  { label: '유료 결제', value: ev.paid, color: '#15803d' },
                  { label: '무료 참가', value: ev.free, color: '#1d4ed8' },
                  { label: '취소', value: ev.cancelled, color: '#dc2626' },
                  { label: '총 매출', value: '₩' + ev.revenue.toLocaleString(), color: '#92400e' },
                ].map(s => (
                  <div key={s.label} style={{ background: '#F8F8F6', borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: s.color, fontFamily: 'Inter' }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: '#9A9A9A', marginTop: 2, fontWeight: 600 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            <select value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid #E8E8E4', fontSize: 13, background: '#fff' }}>
              <option value="all">전체 이벤트</option>
              {events.map((e: any) => <option key={e.id} value={e.id}>{e.title}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid #E8E8E4', fontSize: 13, background: '#fff' }}>
              <option value="all">전체 상태</option>
              {['paid','free_confirmed','pending','cancelled','failed'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <span style={{ fontSize: 13, color: '#9A9A9A', alignSelf: 'center' }}>{filteredOrders.length}건</span>
          </div>
          <div style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F8F8F6' }}>
                  {['이벤트','이름','실명','이메일','금액','수량','상태','날짜'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#9A9A9A', letterSpacing: '0.06em', borderBottom: '1.5px solid #E8E8E4' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.events?.title}</td>
                    <td style={{ padding: '10px 12px' }}>{o.profiles?.display_name}</td>
                    <td style={{ padding: '10px 12px', color: '#6B6B6B' }}>{o.profiles?.real_name || '-'}</td>
                    <td style={{ padding: '10px 12px', color: '#6B6B6B', fontSize: 12 }}>{o.profiles?.email}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 700 }}>{o.amount_krw === 0 ? 'FREE' : '₩' + o.amount_krw?.toLocaleString()}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>{o.quantity}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: STATUS_COLORS[o.status] || '#F8F8F6', color: STATUS_TEXT[o.status] || '#6B6B6B' }}>
                        {o.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', color: '#9A9A9A', fontSize: 12 }}>{new Date(o.created_at).toLocaleDateString('ko-KR')}</td>
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
