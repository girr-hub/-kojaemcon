'use client'
import { useState } from 'react'

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{ background: '#fff', border: '1.5px solid #2a2a2a', borderRadius: 14, padding: 20 }}>
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>{label}</p>
      <p style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 32, letterSpacing: '-0.03em', color: '#0A0A0A' }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>{sub}</p>}
    </div>
  )
}

function BreakdownBar({ title, data }: { title: string; data: Record<string, number> }) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1])
  const total = entries.reduce((s, [, v]) => s + v, 0) || 1
  return (
    <div style={{ background: '#1a1a1a', border: '1.5px solid #2a2a2a', borderRadius: 14, padding: 24 }}>
      <p style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 14, color: '#fff', marginBottom: 16 }}>{title}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {entries.slice(0, 10).map(([key, val]) => (
          <div key={key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#ccc', marginBottom: 4 }}>
              <span>{key}</span>
              <span style={{ fontWeight: 700, color: '#D4B33A' }}>{val} ({Math.round(val / total * 100)}%)</span>
            </div>
            <div style={{ height: 6, background: '#2a2a2a', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(val / total) * 100}%`, background: '#D4B33A', borderRadius: 3 }} />
            </div>
          </div>
        ))}
        {entries.length === 0 && <p style={{ fontSize: 12, color: '#666' }}>No data yet</p>}
      </div>
    </div>
  )
}

// 방문자 추세 차트
function VisitChart({ data }: { data: { date: string; count: number }[] }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const max = Math.max(...data.map(d => d.count), 1)

  // 7일 이동평균 (추세선)
  const movingAvg = data.map((_, i) => {
    const window = data.slice(Math.max(0, i - 3), i + 4)
    return Math.round(window.reduce((s, d) => s + d.count, 0) / window.length)
  })

  const chartH = 140
  const chartW = 100 // %

  return (
    <div style={{ background: '#1a1a1a', border: '1.5px solid #2a2a2a', borderRadius: 14, padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <p style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 14, color: '#fff' }}>Daily Visitors — Last 30 Days</p>
        <div style={{ display: 'flex', gap: 12, fontSize: 10, color: '#888' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 12, height: 3, background: '#D4B33A', display: 'inline-block', borderRadius: 2 }} />
            Daily
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 12, height: 2, background: '#ff6b6b', display: 'inline-block', borderRadius: 2, borderTop: '2px dashed #ff6b6b' }} />
            7-day avg
          </span>
        </div>
      </div>

      {/* SVG Chart */}
      <div style={{ position: 'relative', height: chartH + 24 }}>
        <svg
          width="100%" height={chartH}
          viewBox={`0 0 ${data.length * 10} ${chartH}`}
          preserveAspectRatio="none"
          style={{ overflow: 'visible' }}
        >
          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map(pct => (
            <line key={pct} x1="0" y1={chartH * (1 - pct)} x2={data.length * 10} y2={chartH * (1 - pct)}
              stroke="#2a2a2a" strokeWidth="1" strokeDasharray="4 4" />
          ))}

          {/* Bar chart */}
          {data.map((d, i) => {
            const h = max === 0 ? 0 : (d.count / max) * (chartH - 8)
            const isHovered = hoveredIdx === i
            return (
              <g key={i}>
                <rect
                  x={i * 10 + 1} y={chartH - h} width={8} height={h}
                  fill={isHovered ? '#E9C000' : '#D4B33A'}
                  rx="2"
                  style={{ cursor: 'pointer', transition: 'fill 0.1s' }}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
                {isHovered && (
                  <g>
                    <rect x={i * 10 - 8} y={chartH - h - 22} width={34} height={18} rx="4" fill="#E9C000" />
                    <text x={i * 10 + 9} y={chartH - h - 10} textAnchor="middle" fontSize="9" fill="#12161A" fontWeight="700">
                      {d.count}
                    </text>
                  </g>
                )}
              </g>
            )
          })}

          {/* Trend line (7-day moving average) */}
          <polyline
            points={movingAvg.map((v, i) => `${i * 10 + 5},${chartH - (v / max) * (chartH - 8)}`).join(' ')}
            fill="none" stroke="#ff6b6b" strokeWidth="1.5" strokeDasharray="4 2"
          />
        </svg>

        {/* X-axis labels — 5일 간격 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          {data.filter((_, i) => i % 5 === 0 || i === data.length - 1).map((d, i) => (
            <span key={i} style={{ fontSize: 9, color: '#666', fontFamily: 'Inter' }}>
              {d.date.slice(5)} {/* MM-DD */}
            </span>
          ))}
        </div>
      </div>

      {/* Hover info */}
      {hoveredIdx !== null && (
        <div style={{ marginTop: 12, padding: '10px 14px', background: '#2a2a2a', borderRadius: 8, fontSize: 12 }}>
          <span style={{ color: '#888' }}>{data[hoveredIdx].date}</span>
          <span style={{ color: '#D4B33A', fontWeight: 700, marginLeft: 12 }}>{data[hoveredIdx].count} visits</span>
          <span style={{ color: '#ff6b6b', marginLeft: 12 }}>7d avg: {movingAvg[hoveredIdx]}</span>
        </div>
      )}
    </div>
  )
}

export default function ERPDashboardClient({
  todayVisits, dailyAvg, weeklyAvg, monthlyAvg, totalUsers,
  dailyVisits, nationalityMap, genderMap, ageMap, referralMap, interestMap, events,
}: {
  todayVisits: number; dailyAvg: number; weeklyAvg: number; monthlyAvg: number; totalUsers: number
  dailyVisits: { date: string; count: number }[]
  nationalityMap: Record<string, number>; genderMap: Record<string, number>
  ageMap: Record<string, number>; referralMap: Record<string, number>
  interestMap: Record<string, number>; events: any[]
}) {
  const [tab, setTab] = useState<'analytics' | 'email' | 'survey'>('analytics')
  const [selectedEvent, setSelectedEvent] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null)

  const sendEmail = async (surveyMode = false) => {
    if (!selectedEvent || (!surveyMode && (!subject || !message))) { alert('Fill in all fields'); return }
    setSending(true); setResult(null)
    const event = events.find((e: any) => e.id === selectedEvent)
    const res = await fetch('/api/admin/send-event-email', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        event_id: selectedEvent,
        subject: surveyMode ? `How was ${event?.title}? Share your feedback` : subject,
        message: surveyMode
          ? `Hi! Thank you for attending ${event?.title}.\n\nPlease take 2 minutes to fill out our satisfaction survey:\nhttps://kojaemcon.vercel.app/events/${selectedEvent}/survey\n\n— KOGEMCON Team`
          : message,
      }),
    })
    const data = await res.json()
    setSending(false)
    if (res.ok) { setResult({ ok: true, text: `Sent to ${data.sent_to} attendees!` }); setSubject(''); setMessage('') }
    else setResult({ ok: false, text: data.error })
  }

  const TABS = [
    { id: 'analytics', label: '📊 Analytics' },
    { id: 'email', label: '📧 Email' },
    { id: 'survey', label: '⭐ Survey' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d0d', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 32, letterSpacing: '-0.04em', color: '#fff', marginBottom: 24 }}>
          ERP Dashboard
        </h1>

        <div style={{ display: 'flex', gap: 3, marginBottom: 28, background: '#1a1a1a', padding: 4, borderRadius: 10, width: 'fit-content' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)}
              style={{ padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none',
                background: tab === t.id ? '#D4B33A' : 'transparent', color: tab === t.id ? '#0A0A0A' : '#999' }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'analytics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
              <StatCard label="Today's Visits" value={todayVisits} sub="since midnight KST" />
              <StatCard label="Daily Avg" value={dailyAvg} sub="per day, last 30 days" />
              <StatCard label="Weekly Avg" value={weeklyAvg} sub="per day, last 7 days" />
              <StatCard label="Monthly Avg" value={monthlyAvg} sub="per day, last 30 days" />
              <StatCard label="Total Users" value={totalUsers} />
            </div>

            {/* Visit chart with trend line */}
            <VisitChart data={dailyVisits} />

            {/* Breakdowns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <BreakdownBar title="Nationality" data={nationalityMap} />
              <BreakdownBar title="Gender" data={genderMap} />
              <BreakdownBar title="Age Range" data={ageMap} />
              <BreakdownBar title="Signup Referral" data={referralMap} />
            </div>
            <BreakdownBar title="Top Interests" data={interestMap} />
          </div>
        )}

        {(tab === 'email' || tab === 'survey') && (
          <div style={{ maxWidth: 560, background: '#1a1a1a', border: '1.5px solid #2a2a2a', borderRadius: 16, padding: 28 }}>
            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 6 }}>Event</label>
            <select value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)} className="input-dark" style={{ marginBottom: 16 }}>
              <option value="">Select an event</option>
              {events.map((e: any) => <option key={e.id} value={e.id}>{e.title} ({new Date(e.starts_at).toLocaleDateString()})</option>)}
            </select>

            {tab === 'email' && (
              <>
                <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 6 }}>Subject</label>
                <input value={subject} onChange={e => setSubject(e.target.value)} className="input-dark" placeholder="Subject..." style={{ marginBottom: 16 }} />
                <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 6 }}>Message</label>
                <textarea value={message} onChange={e => setMessage(e.target.value)} className="input-dark" rows={6} style={{ resize: 'none', marginBottom: 20 }} placeholder="Write your message..." />
                <button onClick={() => sendEmail(false)} disabled={sending} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                  {sending ? 'Sending...' : 'Send to all attendees'}
                </button>
              </>
            )}

            {tab === 'survey' && (
              <>
                <p style={{ fontSize: 13, color: '#999', marginBottom: 20, lineHeight: 1.6 }}>
                  Send a satisfaction survey link to all attendees of a completed event.
                </p>
                <button onClick={() => sendEmail(true)} disabled={sending || !selectedEvent} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                  {sending ? 'Sending...' : 'Send survey link to attendees'}
                </button>
              </>
            )}

            {result && (
              <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 10,
                background: result.ok ? '#0f2918' : '#2a1212',
                border: `1px solid ${result.ok ? '#15803d' : '#dc2626'}`,
                fontSize: 13, color: result.ok ? '#4ade80' : '#f87171' }}>
                {result.text}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
