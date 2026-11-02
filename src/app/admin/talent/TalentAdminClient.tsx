'use client'
import { useState } from 'react'

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending: { bg: '#FEF9C3', color: '#854D0E' },
  approved: { bg: '#DCFCE7', color: '#15803D' },
  rejected: { bg: '#FEE2E2', color: '#DC2626' },
  contacted: { bg: '#DBEAFE', color: '#1D4ED8' },
}

export default function TalentAdminClient({ talents }: { talents: any[] }) {
  const [list, setList] = useState(talents)
  const [selected, setSelected] = useState<any>(null)
  const [query, setQuery] = useState('')

  const filtered = list.filter(t => {
    const q = query.toLowerCase()
    if (!q) return true
    return t.name?.toLowerCase().includes(q) ||
      t.email?.toLowerCase().includes(q) ||
      t.nationality?.toLowerCase().includes(q) ||
      t.bio?.toLowerCase().includes(q) ||
      (Array.isArray(t.categories) && t.categories.some((c: string) => c.toLowerCase().includes(q)))
  })

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/admin/talent', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'updateStatus', id, status })
    })
    setList(prev => prev.map(t => t.id === id ? { ...t, status } : t))
    if (selected?.id === id) setSelected((prev: any) => ({ ...prev, status }))
  }

  const downloadCSV = () => {
    const headers = ['Name', 'Email', 'Nationality', 'Categories', 'Instagram', 'Portfolio', 'Status', 'Date']
    const rows = list.map(t => [
      t.name, t.email, t.nationality,
      Array.isArray(t.categories) ? t.categories.join('/') : '',
      t.instagram, t.portfolio, t.status,
      new Date(t.created_at).toLocaleDateString('ko-KR')
    ])
    const csv = [headers, ...rows].map(r => r.map(v => `"${v || ''}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `talent_roster_${new Date().toLocaleDateString('ko-KR')}.csv`
    a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div style={{ display: 'flex', gap: 24, height: 'calc(100vh - 80px)' }}>

      {/* 좌측 목록 */}
      <div style={{ width: 360, flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h1 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, fontSize: 22, color: 'var(--text)', letterSpacing: '-0.04em' }}>
              Talent ({filtered.length})
            </h1>
            <button onClick={downloadCSV}
              style={{ padding: '7px 14px', borderRadius: 8, background: 'var(--text)', color: 'var(--gold)', border: 'none', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
              CSV
            </button>
          </div>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search name, email, category..."
            style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #E0E0E0', fontSize: 14, fontFamily: 'PretendardVariable, Pretendard, sans-serif', outline: 'none', boxSizing: 'border-box' as any }} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filtered.map(t => {
            const sc = STATUS_COLORS[t.status] || STATUS_COLORS.pending
            return (
              <div key={t.id} onClick={() => setSelected(t)}
                style={{ padding: '12px 14px', borderRadius: 10, border: `1.5px solid ${selected?.id === t.id ? 'var(--text)' : '#E8E8E8'}`, background: selected?.id === t.id ? 'var(--text)' : '#fff', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, color: selected?.id === t.id ? '#fff' : 'var(--text)', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>{t.name}</p>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 6, background: sc.bg, color: sc.color }}>{t.status}</span>
                </div>
                <p style={{ fontSize: 12, color: selected?.id === t.id ? '#aaa' : 'var(--text-5)', marginBottom: 4 }}>{t.email}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {(Array.isArray(t.categories) ? t.categories : []).slice(0, 3).map((c: string) => (
                    <span key={c} style={{ fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4, background: selected?.id === t.id ? '#2a2a2a' : '#F0F0F0', color: selected?.id === t.id ? 'var(--gold)' : '#555' }}>{c}</span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 우측 상세 */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {selected ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* 헤더 */}
            <div style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: 14, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <h2 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, fontSize: 22, color: 'var(--text)', letterSpacing: '-0.04em', marginBottom: 4 }}>{selected.name}</h2>
                  <p style={{ fontSize: 14, color: 'var(--text-3)' }}>{selected.email}</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['pending', 'contacted', 'approved', 'rejected'].map(s => {
                    const sc = STATUS_COLORS[s]
                    return (
                      <button key={s} onClick={() => updateStatus(selected.id, s)}
                        style={{ padding: '6px 12px', borderRadius: 8, border: `2px solid ${selected.status === s ? sc.color : '#E8E8E8'}`, background: selected.status === s ? sc.bg : '#fff', color: selected.status === s ? sc.color : 'var(--text-5)', fontWeight: 700, fontSize: 11, cursor: 'pointer', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
                        {s}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                {[
                  { label: 'Nationality', value: selected.nationality },
                  { label: 'Instagram', value: selected.instagram },
                  { label: 'Portfolio', value: selected.portfolio },
                  { label: 'Applied', value: new Date(selected.created_at).toLocaleDateString('ko-KR') },
                ].filter(i => i.value).map(({ label, value }) => (
                  <div key={label} style={{ background: 'var(--bg)', borderRadius: 8, padding: '8px 12px' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-5)', marginBottom: 2, letterSpacing: '0.05em' }}>{label.toUpperCase()}</p>
                    {label === 'Instagram' || label === 'Portfolio' ? (
                      <a href={value} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{value}</a>
                    ) : (
                      <p style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{value}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 카테고리 */}
            <div style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: 14, padding: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-5)', marginBottom: 10, letterSpacing: '0.05em' }}>CATEGORIES</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {(Array.isArray(selected.categories) ? selected.categories : []).map((c: string) => (
                  <span key={c} style={{ fontSize: 13, fontWeight: 600, padding: '6px 12px', borderRadius: 8, background: '#F0F0F0', color: 'var(--text)' }}>{c}</span>
                ))}
              </div>
            </div>

            {/* 바이오 */}
            <div style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: 14, padding: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-5)', marginBottom: 10, letterSpacing: '0.05em' }}>BIO</p>
              <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7, fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>{selected.bio}</p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-5)', fontSize: 14 }}>
            Select a talent to view details
          </div>
        )}
      </div>
    </div>
  )
}
