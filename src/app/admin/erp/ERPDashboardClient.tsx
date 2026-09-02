'use client'
import { useState, useEffect } from 'react'

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: 12, padding: 16 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#9A9A9A', marginBottom: 6, letterSpacing: '0.05em' }}>{label}</p>
      <p style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, fontSize: 28, letterSpacing: '-0.03em', color: color || '#1A1A1A' }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: '#9A9A9A', marginTop: 4 }}>{sub}</p>}
    </div>
  )
}

function BarChart({ title, data, color = '#E9C000' }: { title: string; data: Record<string, number>; color?: string }) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]).slice(0, 10)
  const total = entries.reduce((s, [, v]) => s + v, 0) || 1
  return (
    <div style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: 12, padding: 16 }}>
      <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 14, fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>{title}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {entries.map(([key, val]) => (
          <div key={key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#555', marginBottom: 3 }}>
              <span>{key}</span>
              <span style={{ fontWeight: 700 }}>{val} ({Math.round(val / total * 100)}%)</span>
            </div>
            <div style={{ height: 5, background: '#F0F0F0', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(val / total) * 100}%`, background: color, borderRadius: 3 }} />
            </div>
          </div>
        ))}
        {entries.length === 0 && <p style={{ fontSize: 12, color: '#9A9A9A' }}>No data yet</p>}
      </div>
    </div>
  )
}

function LineChart({ title, data }: { title: string; data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map(d => d.count), 1)
  const w = 100 / (data.length - 1)
  const points = data.map((d, i) => `${i * w},${100 - (d.count / max) * 85}`).join(' ')
  return (
    <div style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: 12, padding: 16 }}>
      <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 12, fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>{title}</p>
      <svg viewBox={`0 0 100 100`} style={{ width: '100%', height: 120, overflow: 'visible' }} preserveAspectRatio="none">
        <polyline points={points} fill="none" stroke="#E9C000" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        {data.map((d, i) => (
          <circle key={i} cx={i * w} cy={100 - (d.count / max) * 85} r="1.5" fill="#E9C000" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#9A9A9A', marginTop: 4 }}>
        <span>{data[0]?.date?.slice(5)}</span>
        <span>{data[data.length-1]?.date?.slice(5)}</span>
      </div>
    </div>
  )
}

const TABS = [
  { id: 'overview', label: '📊 Overview' },
  { id: 'visitors', label: '👁 Visitors' },
  { id: 'users', label: '👥 Users' },
  { id: 'revenue', label: '💰 Revenue' },
  { id: 'events', label: '🎪 Events' },
  { id: 'experience', label: '🌟 Experience' },
  { id: 'cs', label: '💬 CS' },
]

export default function ERPDashboardClient({
  todayVisits, dailyAvg, weeklyAvg, totalUsers, newUsers30, newUsers7,
  dailyVisits, dailySignups, nationalityMap, genderMap, ageMap, interestMap, pageMap,
  events, allOrders, totalRevenue, todayRevenue, monthRevenue, revenueByEvent,
  csTickets, openCs, totalCs, experiences, expApplications
}: any) {
  const [tab, setTab] = useState('overview')

  useEffect(() => {
    const timer = setInterval(() => window.location.reload(), 60000)
    return () => clearInterval(timer)
  }, [])

  const paidOrders = allOrders?.filter((o: any) => o.status === 'paid') ?? []
  const freeOrders = allOrders?.filter((o: any) => o.status === 'free_confirmed') ?? []
  const pendingOrders = allOrders?.filter((o: any) => o.status === 'pending') ?? []
  const cancelledOrders = allOrders?.filter((o: any) => o.status === 'cancelled') ?? []

  return (
    <div style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontWeight: 900, fontSize: 24, color: '#1A1A1A', letterSpacing: '-0.04em' }}>ERP Dashboard</h1>
        <span style={{ fontSize: 12, color: '#9A9A9A' }}>Auto-refresh: 60s</span>
      </div>

      {/* 탭 */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: tab === t.id ? 700 : 500,
              background: tab === t.id ? '#1A1A1A' : '#F0F0F0', color: tab === t.id ? '#E9C000' : '#555',
              fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <StatCard label="Today Visitors" value={todayVisits} sub={`Avg ${dailyAvg}/day`} />
            <StatCard label="Total Users" value={totalUsers} sub={`+${newUsers7} this week`} />
            <StatCard label="Total Revenue" value={`₩${Number(totalRevenue).toLocaleString()}`} sub={`₩${Number(monthRevenue).toLocaleString()} this month`} color="#15803D" />
            <StatCard label="Open CS" value={openCs} sub={`${totalCs} total`} color={openCs > 0 ? '#DC2626' : '#1A1A1A'} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <StatCard label="Paid Orders" value={paidOrders.length} />
            <StatCard label="Free Orders" value={freeOrders.length} />
            <StatCard label="Pending" value={pendingOrders.length} color={pendingOrders.length > 0 ? '#D97706' : '#1A1A1A'} />
            <StatCard label="Cancelled" value={cancelledOrders.length} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <LineChart title="Visitors (30 days)" data={dailyVisits} />
            <LineChart title="Signups (30 days)" data={dailySignups} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <BarChart title="Nationality" data={nationalityMap} />
            <BarChart title="Gender" data={genderMap} color="#6366f1" />
            <BarChart title="Age" data={ageMap} color="#10b981" />
          </div>
        </div>
      )}

      {/* Visitors */}
      {tab === 'visitors' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <StatCard label="Today" value={todayVisits} />
            <StatCard label="Weekly Avg" value={weeklyAvg} sub="per day" />
            <StatCard label="30-day Avg" value={dailyAvg} sub="per day" />
          </div>
          <LineChart title="Daily Visitors (30 days)" data={dailyVisits} />
          <BarChart title="Top Pages" data={pageMap} />
        </div>
      )}

      {/* Users */}
      {tab === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <StatCard label="Total Users" value={totalUsers} />
            <StatCard label="New (7 days)" value={newUsers7} />
            <StatCard label="New (30 days)" value={newUsers30} />
          </div>
          <LineChart title="Daily Signups (30 days)" data={dailySignups} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <BarChart title="Nationality" data={nationalityMap} />
            <BarChart title="Gender" data={genderMap} color="#6366f1" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <BarChart title="Age Group" data={ageMap} color="#10b981" />
            <BarChart title="Interests" data={interestMap} color="#f59e0b" />
          </div>
          {/* 최근 가입 유저 */}
          <div style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: 12, padding: 16 }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 12 }}>Recent Signups</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F7F7F7' }}>
                  {['Name', 'Email', 'Nationality', 'Gender', 'Joined'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#9A9A9A', borderBottom: '1px solid #E8E8E8' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allOrders?.slice(0, 20).map((o: any, i: number) => (
                  o.profiles && <tr key={i} style={{ borderBottom: '1px solid #F5F5F5' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 600 }}>{o.profiles?.display_name || '-'}</td>
                    <td style={{ padding: '8px 12px', color: '#6B6B6B' }}>{o.profiles?.email || '-'}</td>
                    <td style={{ padding: '8px 12px', color: '#6B6B6B' }}>{o.profiles?.nationality || '-'}</td>
                    <td style={{ padding: '8px 12px', color: '#6B6B6B' }}>{o.profiles?.gender || '-'}</td>
                    <td style={{ padding: '8px 12px', color: '#6B6B6B' }}>{new Date(o.created_at).toLocaleDateString('ko-KR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Revenue */}
      {tab === 'revenue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <StatCard label="Total Revenue" value={`₩${Number(totalRevenue).toLocaleString()}`} color="#15803D" />
            <StatCard label="Today Revenue" value={`₩${Number(todayRevenue).toLocaleString()}`} />
            <StatCard label="30-day Revenue" value={`₩${Number(monthRevenue).toLocaleString()}`} />
          </div>
          <BarChart title="Revenue by Event" data={Object.fromEntries(Object.entries(revenueByEvent).map(([k, v]) => [k, v as number]))} color="#15803D" />
          <div style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: 12, padding: 16 }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 12 }}>Recent Paid Orders</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F7F7F7' }}>
                  {['Event', 'User', 'Amount', 'Date'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#9A9A9A', borderBottom: '1px solid #E8E8E8' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paidOrders.slice(0, 30).map((o: any, i: number) => (
                  <tr key={i} style={{ borderBottom: '1px solid #F5F5F5' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 600 }}>{o.events?.title || '-'}</td>
                    <td style={{ padding: '8px 12px', color: '#6B6B6B' }}>{o.profiles?.display_name || '-'}</td>
                    <td style={{ padding: '8px 12px', color: '#15803D', fontWeight: 700 }}>₩{Number(o.amount_krw).toLocaleString()}</td>
                    <td style={{ padding: '8px 12px', color: '#6B6B6B' }}>{new Date(o.created_at).toLocaleDateString('ko-KR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Events */}
      {tab === 'events' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <StatCard label="Total Events" value={events.length} />
            <StatCard label="Total Orders" value={allOrders?.length ?? 0} />
            <StatCard label="Pending Orders" value={pendingOrders.length} color={pendingOrders.length > 0 ? '#D97706' : '#1A1A1A'} />
          </div>
          <div style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: 12, padding: 16 }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 12 }}>Events Overview</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F7F7F7' }}>
                  {['Title', 'Date', 'Status', 'Paid', 'Free', 'Pending', 'Revenue'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#9A9A9A', borderBottom: '1px solid #E8E8E8', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {events.map((e: any) => {
                  const eOrders = allOrders?.filter((o: any) => o.events?.id === e.id) ?? []
                  const ePaid = eOrders.filter((o: any) => o.status === 'paid')
                  const eFree = eOrders.filter((o: any) => o.status === 'free_confirmed')
                  const ePending = eOrders.filter((o: any) => o.status === 'pending')
                  const eRevenue = ePaid.reduce((s: number, o: any) => s + (o.amount_krw || 0), 0)
                  return (
                    <tr key={e.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                      <td style={{ padding: '8px 12px', fontWeight: 600, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title}</td>
                      <td style={{ padding: '8px 12px', color: '#6B6B6B', whiteSpace: 'nowrap' }}>{e.starts_at ? new Date(e.starts_at).toLocaleDateString('ko-KR') : '-'}</td>
                      <td style={{ padding: '8px 12px' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: e.status === 'published' ? '#DCFCE7' : '#F3F4F6', color: e.status === 'published' ? '#15803D' : '#6B7280' }}>{e.status}</span>
                      </td>
                      <td style={{ padding: '8px 12px', fontWeight: 700, color: '#15803D' }}>{ePaid.length}</td>
                      <td style={{ padding: '8px 12px', color: '#1D4ED8' }}>{eFree.length}</td>
                      <td style={{ padding: '8px 12px', color: ePending.length > 0 ? '#D97706' : '#9A9A9A' }}>{ePending.length}</td>
                      <td style={{ padding: '8px 12px', fontWeight: 700, color: '#15803D' }}>₩{Number(eRevenue).toLocaleString()}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Experience */}
      {tab === 'experience' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <StatCard label="Total Experiences" value={experiences.length} />
            <StatCard label="Total Applications" value={expApplications?.length ?? 0} />
            <StatCard label="Published" value={experiences.filter((e: any) => e.status === 'published').length} />
          </div>
          <div style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: 12, padding: 16 }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 12 }}>Experience Events</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F7F7F7' }}>
                  {['Title', 'Status', 'Capacity', 'Applications', 'Created'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#9A9A9A', borderBottom: '1px solid #E8E8E8' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {experiences.map((e: any) => {
                  const apps = expApplications?.filter((a: any) => a.event_id === e.id) ?? []
                  return (
                    <tr key={e.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                      <td style={{ padding: '8px 12px', fontWeight: 600 }}>{e.title}</td>
                      <td style={{ padding: '8px 12px' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: e.status === 'published' ? '#DCFCE7' : '#F3F4F6', color: e.status === 'published' ? '#15803D' : '#6B7280' }}>{e.status}</span>
                      </td>
                      <td style={{ padding: '8px 12px', color: '#6B6B6B' }}>{e.capacity}</td>
                      <td style={{ padding: '8px 12px', fontWeight: 700, color: '#1D4ED8' }}>{apps.length}</td>
                      <td style={{ padding: '8px 12px', color: '#6B6B6B' }}>{new Date(e.created_at).toLocaleDateString('ko-KR')}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: 12, padding: 16 }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 12 }}>Recent Applications</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F7F7F7' }}>
                  {['Experience', 'Name', 'Phone', 'SNS', 'Date'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#9A9A9A', borderBottom: '1px solid #E8E8E8' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {expApplications?.slice(0, 30).map((a: any, i: number) => (
                  <tr key={i} style={{ borderBottom: '1px solid #F5F5F5' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 600 }}>{(a.experience_events as any)?.title || '-'}</td>
                    <td style={{ padding: '8px 12px' }}>{a.real_name}</td>
                    <td style={{ padding: '8px 12px', color: '#6B6B6B' }}>{a.account_phone || a.phone || '-'}</td>
                    <td style={{ padding: '8px 12px', color: '#6B6B6B' }}>{a.sns_accounts || '-'}</td>
                    <td style={{ padding: '8px 12px', color: '#6B6B6B', whiteSpace: 'nowrap' }}>{new Date(a.created_at).toLocaleDateString('ko-KR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CS */}
      {tab === 'cs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <StatCard label="Open Tickets" value={openCs} color={openCs > 0 ? '#DC2626' : '#1A1A1A'} />
            <StatCard label="Total Tickets" value={totalCs} />
            <StatCard label="Resolved" value={totalCs - openCs} color="#15803D" />
          </div>
          <div style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: 12, padding: 16 }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 12 }}>CS Tickets</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F7F7F7' }}>
                  {['Subject', 'Name', 'Email', 'Category', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#9A9A9A', borderBottom: '1px solid #E8E8E8', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csTickets.map((c: any, i: number) => (
                  <tr key={i} style={{ borderBottom: '1px solid #F5F5F5' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 600, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.subject}</td>
                    <td style={{ padding: '8px 12px' }}>{c.name}</td>
                    <td style={{ padding: '8px 12px', color: '#6B6B6B' }}>{c.email}</td>
                    <td style={{ padding: '8px 12px', color: '#6B6B6B' }}>{c.category}</td>
                    <td style={{ padding: '8px 12px' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: c.status === 'open' ? '#FEE2E2' : '#DCFCE7', color: c.status === 'open' ? '#DC2626' : '#15803D' }}>{c.status}</span>
                    </td>
                    <td style={{ padding: '8px 12px', color: '#6B6B6B', whiteSpace: 'nowrap' }}>{new Date(c.created_at).toLocaleDateString('ko-KR')}</td>
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
