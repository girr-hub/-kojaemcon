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

export default function ERPDashboardClient({
  todayVisits, weekAvg, monthAvg, totalUsers,
  nationalityMap, genderMap, ageMap, referralMap, interestMap, events,
}: {
  todayVisits: number; weekAvg: number; monthAvg: number; totalUsers: number
  nationalityMap: Record<string, number>; genderMap: Record<string, number>
  ageMap: Record<string, number>; referralMap: Record<string, number>
  interestMap: Record<string, number>; events: any[]
}) {
  const [tab, setTab] = useState<'analytics' | 'email'>('analytics')

  // Email tab state
  const [selectedEvent, setSelectedEvent] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null)

  const sendEmail = async () => {
    if (!selectedEvent || !subject || !message) { alert('Fill in all fields'); return }
    setSending(true)
    setResult(null)
    const res = await fetch('/api/admin/send-event-email', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ event_id: selectedEvent, subject, message }),
    })
    const data = await res.json()
    setSending(false)
    if (res.ok) {
      setResult({ ok: true, text: `Sent to ${data.sent_to} attendees!` })
      setSubject(''); setMessage('')
    } else {
      setResult({ ok: false, text: data.error })
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d0d', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 32, letterSpacing: '-0.04em', color: '#fff', marginBottom: 24 }}>
          ERP Dashboard
        </h1>

        <div style={{ display: 'flex', gap: 3, marginBottom: 28, background: '#1a1a1a', padding: 4, borderRadius: 10, width: 'fit-content' }}>
          {[
            { id: 'analytics', label: '📊 Analytics' },
            { id: 'email', label: '📧 Email Attendees' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              style={{
                padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none',
                background: tab === t.id ? '#D4B33A' : 'transparent',
                color: tab === t.id ? '#0A0A0A' : '#999',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'analytics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Visit stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
              <StatCard label="Today's Visits" value={todayVisits} />
              <StatCard label="Weekly Avg / Day" value={weekAvg} sub="last 7 days" />
              <StatCard label="Monthly Avg / Day" value={monthAvg} sub="last 30 days" />
              <StatCard label="Total Users" value={totalUsers} />
            </div>

            {/* Breakdown grids */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <BreakdownBar title="Nationality" data={nationalityMap} />
              <BreakdownBar title="Gender" data={genderMap} />
              <BreakdownBar title="Age Range" data={ageMap} />
              <BreakdownBar title="Signup Referral Source" data={referralMap} />
            </div>
            <BreakdownBar title="Top Interests" data={interestMap} />
          </div>
        )}

        {tab === 'email' && (
          <div style={{ maxWidth: 560, background: '#1a1a1a', border: '1.5px solid #2a2a2a', borderRadius: 16, padding: 28 }}>
            <p style={{ fontSize: 13, color: '#999', marginBottom: 20, lineHeight: 1.6 }}>
              Send an email to all confirmed attendees of an event. Requires RESEND_API_KEY environment variable.
            </p>

            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 6 }}>
              Event
            </label>
            <select
              value={selectedEvent}
              onChange={e => setSelectedEvent(e.target.value)}
              className="input-dark"
              style={{ marginBottom: 16 }}
            >
              <option value="">Select an event</option>
              {events.map((e: any) => (
                <option key={e.id} value={e.id}>{e.title} ({new Date(e.starts_at).toLocaleDateString()})</option>
              ))}
            </select>

            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 6 }}>
              Subject
            </label>
            <input
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="input-dark"
              placeholder="Important update about your event"
              style={{ marginBottom: 16 }}
            />

            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 6 }}>
              Message
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="input-dark"
              rows={6}
              style={{ resize: 'none', marginBottom: 20 }}
              placeholder="Write your message here..."
            />

            <button onClick={sendEmail} disabled={sending} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
              {sending ? 'Sending...' : 'Send to all attendees'}
            </button>

            {result && (
              <div style={{
                marginTop: 16, padding: '12px 16px', borderRadius: 10,
                background: result.ok ? '#0f2918' : '#2a1212',
                border: `1px solid ${result.ok ? '#15803d' : '#dc2626'}`,
                fontSize: 13, color: result.ok ? '#4ade80' : '#f87171',
              }}>
                {result.text}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
