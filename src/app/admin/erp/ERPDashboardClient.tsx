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

function BarChart({ title, data, color = '#E9C000', xLabel = '', yLabel = '', unit = '' }: { title: string; data: Record<string, number>; color?: string; xLabel?: string; yLabel?: string; unit?: string }) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]).slice(0, 10)
  const max = Math.max(...entries.map(([, v]) => v), 1)
  return (
    <div style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: 12, padding: 16 }}>
      <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 4 }}>{title}</p>
      {(xLabel || yLabel) && <p style={{ fontSize: 10, color: '#BBB', marginBottom: 10 }}>x: {xLabel} · y: {yLabel}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {entries.map(([key, val]) => (
          <div key={key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#555', marginBottom: 3 }}>
              <span>{key}</span>
              <span style={{ fontWeight: 700 }}>{unit === '₩' ? `₩${Number(val).toLocaleString()}` : `${val.toLocaleString()}${unit}`}</span>
            </div>
            <div style={{ height: 5, background: '#F0F0F0', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(val / max) * 100}%`, background: color, borderRadius: 3 }} />
            </div>
          </div>
        ))}
        {entries.length === 0 && <p style={{ fontSize: 12, color: '#9A9A9A' }}>No data yet</p>}
      </div>
    </div>
  )
}

function LineChart({ title, data, period, yLabel = '건', color = '#E9C000' }: { title: string; data: { date: string; count: number }[]; period: number; yLabel?: string; color?: string }) {
  const sliced = data.slice(-period)
  if (sliced.length === 0) return null
  const max = Math.max(...sliced.map(d => d.count), 1)
  const yMid = Math.round(max / 2)
  const PAD_L = 32, PAD_B = 18, W = 260, H = 80
  const total_w = W + PAD_L
  const total_h = H + PAD_B
  const pts = sliced.map((d, i) => {
    const x = PAD_L + (i / (sliced.length - 1 || 1)) * W
    const y = H - (d.count / max) * H * 0.85
    return `${x},${y}`
  }).join(' ')
  return (
    <div style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: 12, padding: 16 }}>
      <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 2 }}>{title}</p>
      <p style={{ fontSize: 10, color: '#BBB', marginBottom: 8 }}>x: 날짜 · y: {yLabel}</p>
      <svg viewBox={`0 0 ${total_w} ${total_h}`} style={{ width: '100%', height: 110, overflow: 'visible' }}>
        <text x={PAD_L - 4} y={8} textAnchor="end" fontSize={8} fill="#999">{max.toLocaleString()}</text>
        <text x={PAD_L - 4} y={H * 0.075 + H * 0.425 + 4} textAnchor="end" fontSize={8} fill="#999">{yMid.toLocaleString()}</text>
        <text x={PAD_L - 4} y={H + 4} textAnchor="end" fontSize={8} fill="#999">0</text>
        <line x1={PAD_L} y1={H * 0.15} x2={PAD_L + W} y2={H * 0.15} stroke="#F0F0EE" strokeWidth={0.5} />
        <line x1={PAD_L} y1={H * 0.575} x2={PAD_L + W} y2={H * 0.575} stroke="#F0F0EE" strokeWidth={0.5} />
        <line x1={PAD_L} y1={H} x2={PAD_L + W} y2={H} stroke="#E8E8E8" strokeWidth={0.8} />
        {sliced.length > 1 && <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" />}
        {sliced.length > 0 && <text x={PAD_L} y={total_h - 2} textAnchor="start" fontSize={7} fill="#BBB">{sliced[0].date.slice(5)}</text>}
        {sliced.length > 1 && <text x={PAD_L + W} y={total_h - 2} textAnchor="end" fontSize={7} fill="#BBB">{sliced[sliced.length-1].date.slice(5)}</text>}
      </svg>
    </div>
  )
}

function HeatmapChart({ title, data, xLabel = '', yLabel = '' }: { title: string; data: Record<number, number>; xLabel?: string; yLabel?: string }) {
  const vals = Object.values(data)
  const max = Math.max(...vals, 1)
  const hours = Array.from({ length: 24 }, (_, i) => i)
  return (
    <div style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: 12, padding: 16 }}>
      <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 4 }}>{title}</p>
      {(xLabel || yLabel) && <p style={{ fontSize: 10, color: '#BBB', marginBottom: 10 }}>x: {xLabel} · y: {yLabel}</p>}
      <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
        {hours.map(h => {
          const count = data[h] || 0
          const intensity = count / max
          const bg = intensity > 0.8 ? '#B45309' : intensity > 0.6 ? '#D97706' : intensity > 0.4 ? '#E9C000' : intensity > 0.2 ? '#FDE68A' : intensity > 0 ? '#FEF9C3' : '#F5F5F5'
          const barH = Math.max(4, Math.round(intensity * 60))
          return (
            <div key={h} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <span style={{ fontSize: 7, color: '#999' }}>{count > 0 ? count : ''}</span>
              <div style={{ width: 10, height: barH, background: bg, borderRadius: 2 }} title={`${h}시: ${count}회`} />
              {h % 6 === 0 && <span style={{ fontSize: 7, color: '#BBB' }}>{h}시</span>}
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 9, color: '#9A9A9A' }}>적음</span>
        {['#FEF9C3', '#FDE68A', '#E9C000', '#D97706', '#B45309'].map(c => (
          <div key={c} style={{ width: 12, height: 8, background: c, borderRadius: 2 }} />
        ))}
        <span style={{ fontSize: 9, color: '#9A9A9A' }}>많음</span>
      </div>
    </div>
  )
}

function WeekdayChart({ title, data, xLabel = '요일', yLabel = '건', color = '#E9C000' }: { title: string; data: Record<string, number>; xLabel?: string; yLabel?: string; color?: string }) {
  const days = ['일', '월', '화', '수', '목', '금', '토']
  const vals = days.map(d => data[d] || 0)
  const max = Math.max(...vals, 1)
  return (
    <div style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: 12, padding: 16 }}>
      <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 4 }}>{title}</p>
      <p style={{ fontSize: 10, color: '#BBB', marginBottom: 10 }}>x: {xLabel} · y: {yLabel}</p>
      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 80 }}>
        {days.map((d, i) => {
          const v = vals[i]
          const h = Math.max(4, Math.round((v / max) * 70))
          return (
            <div key={d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <span style={{ fontSize: 9, color: '#666', fontWeight: 700 }}>{v}</span>
              <div style={{ width: '100%', height: h, background: color, borderRadius: 3, opacity: v === 0 ? 0.2 : 1 }} />
              <span style={{ fontSize: 10, color: '#9A9A9A' }}>{d}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MonthlyBarChart({ title, data, yLabel = '원', color = '#15803D' }: { title: string; data: Record<string, number>; yLabel?: string; color?: string }) {
  const entries = Object.entries(data)
  const max = Math.max(...entries.map(([, v]) => v), 1)
  return (
    <div style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: 12, padding: 16 }}>
      <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 4 }}>{title}</p>
      <p style={{ fontSize: 10, color: '#BBB', marginBottom: 10 }}>x: 연-월 · y: {yLabel}</p>
      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 90 }}>
        {entries.map(([key, val]) => {
          const h = Math.max(4, Math.round((val / max) * 75))
          return (
            <div key={key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <span style={{ fontSize: 8, color: '#666' }}>{val > 0 ? `${Math.round(val/1000)}K` : '0'}</span>
              <div style={{ width: '100%', height: h, background: color, borderRadius: 3, opacity: val === 0 ? 0.2 : 1 }} />
              <span style={{ fontSize: 8, color: '#9A9A9A', textAlign: 'center' }}>{key.slice(5)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function ERPDashboardClient({
  todayVisits, dailyAvg, weeklyAvg, totalUsers, newUsers30, newUsers7,
  dailyVisits, dailySignups, nationalityMap, genderMap, ageMap, interestMap, pageMap,
  hourlyVisitMap, weekdayVisitMap, avgDurationByPage, totalVisits30,
  events, allOrders, totalRevenue, todayRevenue, monthRevenue, revenueByEvent,
  avgOrderValue, weekdayOrderMap, hourlyOrderMap, monthlyRevenueMap,
  nationalityAvgOrder, genderPurchaseMap, avgDaysToFirstPurchase, repurchaseRate, cancelRate,
  languageRevenueMap, categoryRevenueMap,
  csTickets, openCs, totalCs, csCategoryMap, avgResponseHours,
  experiences, expApplications, surveys
}: any) {
  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'visitors', label: 'Visitors' },
    { id: 'users', label: 'Users' },
    { id: 'orders', label: 'Orders' },
    { id: 'events', label: 'Events' },
    { id: 'experience', label: 'Experience' },
    { id: 'survey', label: 'Survey' },
    { id: 'cs', label: 'CS' },
  ]
  const [tab, setTab] = useState('overview')
  const [period, setPeriod] = useState(30)

  useEffect(() => {
    const timer = setInterval(() => window.location.reload(), 60000)
    return () => clearInterval(timer)
  }, [])

  const paidOrders = allOrders?.filter((o: any) => o.status === 'paid') ?? []
  const freeOrders = allOrders?.filter((o: any) => o.status === 'free_confirmed') ?? []
  const pendingOrders = allOrders?.filter((o: any) => o.status === 'pending') ?? []
  const cancelledOrders = allOrders?.filter((o: any) => o.status === 'cancelled') ?? []

  const eventFillRate: { title: string; capacity: number; filled: number; rate: number }[] = (events ?? [])
    .map((e: any) => {
      const confirmed = (allOrders ?? []).filter((o: any) => o.events?.id === e.id && ['paid', 'free_confirmed'].includes(o.status)).length
      const cap = e.capacity || 0
      return { title: e.title, capacity: cap, filled: confirmed, rate: cap > 0 ? Math.round((confirmed / cap) * 100) : 0 }
    })
    .filter((e: any) => e.capacity > 0)
    .sort((a: any, b: any) => b.rate - a.rate)

  return (
    <div style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontWeight: 900, fontSize: 24, color: '#1A1A1A', letterSpacing: '-0.04em' }}>ERP Dashboard</h1>
        <span style={{ fontSize: 12, color: '#9A9A9A' }}>Auto-refresh: 60s</span>
      </div>
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
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {[90, 30, 15, 7, 3].map(d => (
          <button key={d} onClick={() => setPeriod(d)} style={{
            padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
            background: period === d ? '#1A1A1A' : '#F5F5F5', color: period === d ? '#E9C000' : '#666',
            border: period === d ? 'none' : '1px solid #E8E8E8'
          }}>{d}일</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <StatCard label="Today Visitors" value={todayVisits} sub={`평균 ${dailyAvg}명/일`} />
            <StatCard label="Total Users" value={totalUsers} sub={`+${newUsers7}명 이번주`} />
            <StatCard label="Total Revenue" value={`₩${Number(totalRevenue).toLocaleString()}`} sub={`₩${Number(monthRevenue).toLocaleString()} this month`} color="#15803D" />
            <StatCard label="Open CS" value={openCs} sub={`총 ${totalCs}건`} color={openCs > 0 ? '#DC2626' : '#1A1A1A'} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <StatCard label="Paid Orders" value={paidOrders.length} sub={`평균 ₩${Number(avgOrderValue).toLocaleString()}`} />
            <StatCard label="Free Orders" value={freeOrders.length} />
            <StatCard label="Pending" value={pendingOrders.length} color={pendingOrders.length > 0 ? '#D97706' : '#1A1A1A'} />
            <StatCard label="Cancel Rate" value={`${cancelRate}%`} sub={`${cancelledOrders.length}건 취소`} color={cancelRate > 10 ? '#DC2626' : '#1A1A1A'} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <LineChart title="방문자 추이" data={dailyVisits} period={period} yLabel="방문 수 (명)" />
            <LineChart title="가입자 추이" data={dailySignups} period={period} yLabel="가입 수 (명)" color="#6366f1" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <BarChart title="국적 분포" data={nationalityMap} xLabel="국가명" yLabel="유저 수 (명)" />
            <BarChart title="성별 분포" data={genderMap} color="#6366f1" xLabel="성별" yLabel="유저 수 (명)" />
            <BarChart title="연령대 분포" data={ageMap} color="#10b981" xLabel="연령대" yLabel="유저 수 (명)" />
          </div>
        </div>
      )}

      {tab === 'visitors' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <StatCard label="오늘 방문" value={todayVisits} sub="명" />
            <StatCard label="주간 평균" value={weeklyAvg} sub="명/일" />
            <StatCard label="30일 평균" value={dailyAvg} sub="명/일" />
            <StatCard label="30일 총 방문" value={totalVisits30} sub="명" />
          </div>
          <LineChart title="일별 방문자 추이" data={dailyVisits} period={period} yLabel="방문 수 (명)" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <HeatmapChart title="시간대별 방문 (최근 30일)" data={hourlyVisitMap} xLabel="시간대 (0~23시)" yLabel="방문 수 (건)" />
            <WeekdayChart title="요일별 방문 (최근 30일)" data={weekdayVisitMap} xLabel="요일" yLabel="방문 수 (건)" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <BarChart title="페이지별 방문 수 (Top 10)" data={pageMap} xLabel="페이지 경로" yLabel="방문 수 (건)" unit="건" />
            <BarChart title="페이지별 평균 체류시간 (Top 10)" data={avgDurationByPage} color="#6366f1" xLabel="페이지 경로" yLabel="평균 체류시간 (초)" unit="초" />
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <StatCard label="총 유저" value={totalUsers} sub="명" />
            <StatCard label="신규 (7일)" value={newUsers7} sub="명" />
            <StatCard label="신규 (30일)" value={newUsers30} sub="명" />
            <StatCard label="재구매율" value={`${repurchaseRate}%`} sub="2회 이상 구매 유저" color={repurchaseRate > 20 ? '#15803D' : '#1A1A1A'} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <StatCard label="가입→첫구매 평균" value={`${avgDaysToFirstPurchase}일`} sub="가입 후 첫 결제까지" />
            <StatCard label="방문→가입 전환" value={totalUsers > 0 && totalVisits30 > 0 ? `${Math.round((newUsers30 / totalVisits30) * 100)}%` : '-'} sub={`30일 방문 ${totalVisits30}명 중 가입 ${newUsers30}명`} />
          </div>
          <LineChart title="일별 가입자 추이" data={dailySignups} period={period} yLabel="가입 수 (명)" color="#6366f1" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <BarChart title="국적 분포" data={nationalityMap} xLabel="국가명" yLabel="유저 수 (명)" />
            <BarChart title="성별 분포" data={genderMap} color="#6366f1" xLabel="성별" yLabel="유저 수 (명)" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <BarChart title="연령대 분포" data={ageMap} color="#10b981" xLabel="연령대" yLabel="유저 수 (명)" />
            <BarChart title="관심사" data={interestMap} color="#f59e0b" xLabel="관심 카테고리" yLabel="선택 수 (건)" />
          </div>
          <div style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: 12, padding: 16 }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 4 }}>성별별 구매율</p>
            <p style={{ fontSize: 10, color: '#BBB', marginBottom: 12 }}>x: 성별 · y: 구매 비율 (%)</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Object.entries(genderPurchaseMap ?? {}).map(([g, v]: any) => {
                const rate = v.total > 0 ? Math.round((v.purchased / v.total) * 100) : 0
                return (
                  <div key={g}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                      <span style={{ fontWeight: 600 }}>{g}</span>
                      <span style={{ color: '#555' }}>{v.purchased}/{v.total}명 · <b>{rate}%</b></span>
                    </div>
                    <div style={{ height: 6, background: '#F0F0F0', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${rate}%`, background: '#6366f1', borderRadius: 3 }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <BarChart title="국적별 평균 객단가" data={nationalityAvgOrder} color="#15803D" xLabel="국가명" yLabel="평균 결제액 (원)" unit="₩" />
        </div>
      )}

      {tab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <StatCard label="총 매출" value={`₩${Number(totalRevenue).toLocaleString()}`} color="#15803D" />
            <StatCard label="평균 객단가" value={`₩${Number(avgOrderValue).toLocaleString()}`} sub="유료 주문 기준" />
            <StatCard label="취소율" value={`${cancelRate}%`} sub={`${cancelledOrders.length}건 취소`} color={cancelRate > 10 ? '#DC2626' : '#1A1A1A'} />
            <StatCard label="유료 vs 무료" value={`${paidOrders.length} : ${freeOrders.length}`} sub="유료 : 무료초청" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <StatCard label="오늘 매출" value={`₩${Number(todayRevenue).toLocaleString()}`} />
            <StatCard label="30일 매출" value={`₩${Number(monthRevenue).toLocaleString()}`} />
            <StatCard label="재구매율" value={`${repurchaseRate}%`} color={repurchaseRate > 20 ? '#15803D' : '#1A1A1A'} />
          </div>
          <MonthlyBarChart title="월별 매출 추이 (최근 6개월)" data={monthlyRevenueMap} yLabel="매출액 (원)" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <WeekdayChart title="요일별 결제 건수" data={weekdayOrderMap} xLabel="요일" yLabel="결제 건수 (건)" color="#15803D" />
            <HeatmapChart title="시간대별 결제 건수" data={hourlyOrderMap} xLabel="시간대 (0~23시)" yLabel="결제 건수 (건)" />
          </div>
          <div style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: 12, padding: 16 }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 4 }}>유료 vs 무료초청 비율</p>
            <p style={{ fontSize: 10, color: '#BBB', marginBottom: 12 }}>x: 주문 유형 · y: 건수 (건) · 비율 (%)</p>
            {(() => {
              const total = paidOrders.length + freeOrders.length + cancelledOrders.length + pendingOrders.length || 1
              const items = [
                { label: '유료 결제', val: paidOrders.length, color: '#15803D' },
                { label: '무료 초청', val: freeOrders.length, color: '#1D4ED8' },
                { label: '대기 중', val: pendingOrders.length, color: '#D97706' },
                { label: '취소', val: cancelledOrders.length, color: '#DC2626' },
              ]
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {items.map(item => (
                    <div key={item.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                        <span style={{ fontWeight: 600, color: item.color }}>{item.label}</span>
                        <span>{item.val}건 ({Math.round(item.val / total * 100)}%)</span>
                      </div>
                      <div style={{ height: 6, background: '#F0F0F0', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(item.val / total) * 100}%`, background: item.color, borderRadius: 3 }} />
                      </div>
                    </div>
                  ))}
                </div>
              )
            })()}
          </div>
          <BarChart title="이벤트별 매출 (Top 10)" data={revenueByEvent} color="#15803D" xLabel="이벤트명" yLabel="매출액 (원)" unit="₩" />
          <div style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: 12, padding: 16 }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 12 }}>최근 결제 내역</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F7F7F7' }}>
                  {['이벤트', '유저', '금액', '상태', '날짜'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#9A9A9A', borderBottom: '1px solid #E8E8E8' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allOrders.slice(0, 30).map((o: any, i: number) => (
                  <tr key={i} style={{ borderBottom: '1px solid #F5F5F5' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 600, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.events?.title || '-'}</td>
                    <td style={{ padding: '8px 12px', color: '#6B6B6B' }}>{o.profiles?.display_name || '-'}</td>
                    <td style={{ padding: '8px 12px', color: '#15803D', fontWeight: 700 }}>₩{Number(o.amount_krw || 0).toLocaleString()}</td>
                    <td style={{ padding: '8px 12px' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                        background: o.status === 'paid' ? '#DCFCE7' : o.status === 'cancelled' ? '#FEE2E2' : o.status === 'free_confirmed' ? '#DBEAFE' : '#FEF9C3',
                        color: o.status === 'paid' ? '#15803D' : o.status === 'cancelled' ? '#DC2626' : o.status === 'free_confirmed' ? '#1D4ED8' : '#D97706'
                      }}>{o.status}</span>
                    </td>
                    <td style={{ padding: '8px 12px', color: '#6B6B6B', whiteSpace: 'nowrap' }}>{new Date(o.created_at).toLocaleDateString('ko-KR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'events' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <StatCard label="총 이벤트" value={events.length} />
            <StatCard label="총 주문" value={allOrders?.length ?? 0} />
            <StatCard label="대기 주문" value={pendingOrders.length} color={pendingOrders.length > 0 ? '#D97706' : '#1A1A1A'} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <BarChart title="언어별 매출" data={languageRevenueMap} color="#6366f1" xLabel="이벤트 언어" yLabel="매출액 (원)" unit="₩" />
            <BarChart title="카테고리별 매출" data={categoryRevenueMap} color="#10b981" xLabel="이벤트 카테고리" yLabel="매출액 (원)" unit="₩" />
          </div>
          <div style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: 12, padding: 16 }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 4 }}>이벤트별 정원 충족률</p>
            <p style={{ fontSize: 10, color: '#BBB', marginBottom: 12 }}>x: 이벤트명 · y: 충족률 (%) · 참가 확정 / 정원</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {eventFillRate.slice(0, 10).map((e: any) => (
                <div key={e.title}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                    <span style={{ fontWeight: 600, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title}</span>
                    <span style={{ color: '#555' }}>{e.filled}/{e.capacity}명 · <b style={{ color: e.rate >= 100 ? '#DC2626' : e.rate >= 80 ? '#D97706' : '#15803D' }}>{e.rate}%</b></span>
                  </div>
                  <div style={{ height: 6, background: '#F0F0F0', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(e.rate, 100)}%`, background: e.rate >= 100 ? '#DC2626' : e.rate >= 80 ? '#E9C000' : '#10b981', borderRadius: 3 }} />
                  </div>
                </div>
              ))}
              {eventFillRate.length === 0 && <p style={{ fontSize: 12, color: '#9A9A9A' }}>정원 데이터 없음</p>}
            </div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: 12, padding: 16 }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 12 }}>이벤트 전체 목록</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F7F7F7' }}>
                  {['Title', 'Date', 'Status', 'Paid', 'Free', 'Pending', '충족률', 'Revenue'].map(h => (
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
                  const confirmed = ePaid.length + eFree.length
                  const cap = e.capacity || 0
                  const fillRate = cap > 0 ? Math.round((confirmed / cap) * 100) : '-'
                  return (
                    <tr key={e.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                      <td style={{ padding: '8px 12px', fontWeight: 600, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title}</td>
                      <td style={{ padding: '8px 12px', color: '#6B6B6B', whiteSpace: 'nowrap' }}>{e.starts_at ? new Date(e.starts_at).toLocaleDateString('ko-KR') : '-'}</td>
                      <td style={{ padding: '8px 12px' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: e.status === 'published' ? '#DCFCE7' : '#F3F4F6', color: e.status === 'published' ? '#15803D' : '#6B7280' }}>{e.status}</span>
                      </td>
                      <td style={{ padding: '8px 12px', fontWeight: 700, color: '#15803D' }}>{ePaid.length}</td>
                      <td style={{ padding: '8px 12px', color: '#1D4ED8' }}>{eFree.length}</td>
                      <td style={{ padding: '8px 12px', color: ePending.length > 0 ? '#D97706' : '#9A9A9A' }}>{ePending.length}</td>
                      <td style={{ padding: '8px 12px', fontWeight: 700, color: typeof fillRate === 'number' && fillRate >= 100 ? '#DC2626' : '#555' }}>{typeof fillRate === 'number' ? `${fillRate}%` : '-'}</td>
                      <td style={{ padding: '8px 12px', fontWeight: 700, color: '#15803D' }}>₩{Number(eRevenue).toLocaleString()}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'experience' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <StatCard label="총 체험단" value={experiences.length} />
            <StatCard label="총 신청" value={expApplications?.length ?? 0} />
            <StatCard label="Published" value={experiences.filter((e: any) => e.status === 'published').length} />
          </div>
          <div style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: 12, padding: 16 }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 12 }}>체험단 이벤트</p>
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
            <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 12 }}>최근 신청 내역</p>
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

      {tab === 'survey' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A' }}>만족도 조사 결과</p>
              <button onClick={async () => {
                const res = await fetch('/api/send-surveys', { method: 'POST' }).then(r => r.json())
                alert(`발송 완료: ${res.sent}명`)
              }}
                style={{ padding: '7px 14px', borderRadius: 8, background: '#1A1A1A', color: '#E9C000', border: 'none', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                📧 만족도 조사 발송
              </button>
            </div>
            <p style={{ fontSize: 13, color: '#9A9A9A' }}>종료된 이벤트 참가자에게 만족도 조사 이메일을 발송합니다.</p>
          </div>
        </div>
      )}

      {tab === 'cs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <StatCard label="미처리 티켓" value={openCs} color={openCs > 0 ? '#DC2626' : '#1A1A1A'} sub="open 상태" />
            <StatCard label="총 티켓" value={totalCs} />
            <StatCard label="해결된 티켓" value={totalCs - openCs} color="#15803D" />
            <StatCard label="평균 응답시간" value={`${avgResponseHours}h`} sub="접수→답변 완료" color={avgResponseHours > 24 ? '#DC2626' : '#1A1A1A'} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <BarChart title="카테고리별 CS 건수" data={csCategoryMap} xLabel="CS 카테고리" yLabel="티켓 수 (건)" unit="건" />
            <div style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: 12, padding: 16 }}>
              <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 4 }}>CS 처리 현황</p>
              <p style={{ fontSize: 10, color: '#BBB', marginBottom: 12 }}>x: 상태 · y: 티켓 수 (건)</p>
              {(() => {
                const total = totalCs || 1
                const resolved = totalCs - openCs
                const resolveRate = Math.round((resolved / total) * 100)
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                        <span style={{ fontWeight: 600, color: '#DC2626' }}>미처리 (open)</span>
                        <span>{openCs}건 ({100 - resolveRate}%)</span>
                      </div>
                      <div style={{ height: 6, background: '#F0F0F0', borderRadius: 3 }}>
                        <div style={{ height: '100%', width: `${100 - resolveRate}%`, background: '#DC2626', borderRadius: 3 }} />
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                        <span style={{ fontWeight: 600, color: '#15803D' }}>해결 완료</span>
                        <span>{resolved}건 ({resolveRate}%)</span>
                      </div>
                      <div style={{ height: 6, background: '#F0F0F0', borderRadius: 3 }}>
                        <div style={{ height: '100%', width: `${resolveRate}%`, background: '#15803D', borderRadius: 3 }} />
                      </div>
                    </div>
                    <p style={{ fontSize: 12, color: '#9A9A9A', marginTop: 4 }}>평균 응답: <b style={{ color: avgResponseHours > 24 ? '#DC2626' : '#15803D' }}>{avgResponseHours}시간</b> · 총 {totalCs}건</p>
                  </div>
                )
              })()}
            </div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: 12, padding: 16 }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 12 }}>CS 티켓 목록</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F7F7F7' }}>
                  {['Subject', 'Name', 'Email', 'Category', 'Status', '응답시간', 'Date'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#9A9A9A', borderBottom: '1px solid #E8E8E8', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csTickets.map((c: any, i: number) => {
                  const responseHours = c.replied_at && c.created_at
                    ? Math.round((new Date(c.replied_at).getTime() - new Date(c.created_at).getTime()) / (1000 * 60 * 60) * 10) / 10
                    : null
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid #F5F5F5' }}>
                      <td style={{ padding: '8px 12px', fontWeight: 600, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.subject}</td>
                      <td style={{ padding: '8px 12px' }}>{c.name}</td>
                      <td style={{ padding: '8px 12px', color: '#6B6B6B' }}>{c.email}</td>
                      <td style={{ padding: '8px 12px', color: '#6B6B6B' }}>{c.category}</td>
                      <td style={{ padding: '8px 12px' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: c.status === 'open' ? '#FEE2E2' : '#DCFCE7', color: c.status === 'open' ? '#DC2626' : '#15803D' }}>{c.status}</span>
                      </td>
                      <td style={{ padding: '8px 12px', color: responseHours && responseHours > 24 ? '#DC2626' : '#15803D', fontWeight: responseHours ? 700 : 400 }}>{responseHours !== null ? `${responseHours}h` : '-'}</td>
                      <td style={{ padding: '8px 12px', color: '#6B6B6B', whiteSpace: 'nowrap' }}>{new Date(c.created_at).toLocaleDateString('ko-KR')}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
