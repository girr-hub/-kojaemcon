'use client'
import { useState } from 'react'

export default function UsersClient({ users }: { users: any[] }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<any>(null)

  const filtered = users.filter(u => {
    const q = query.toLowerCase()
    if (!q) return true
    return (
      u.display_name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q) ||
      u.nationality?.toLowerCase().includes(q) ||
      u.real_name?.toLowerCase().includes(q)
    )
  })

  return (
    <div style={{ display: 'flex', gap: 24, height: 'calc(100vh - 80px)' }}>

      {/* 좌측: 유저 목록 */}
      <div style={{ width: 380, flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 16 }}>
          <h1 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, fontSize: 22, color: '#1A1A1A', letterSpacing: '-0.04em', marginBottom: 12 }}>
            Users ({filtered.length})
          </h1>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, email, phone, nationality..."
            style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #E0E0E0', fontSize: 14, fontFamily: 'PretendardVariable, Pretendard, sans-serif', outline: 'none', boxSizing: 'border-box' as any }}
          />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filtered.map(u => (
            <div key={u.id} onClick={() => setSelected(u)}
              style={{ padding: '12px 14px', borderRadius: 10, border: `1.5px solid ${selected?.id === u.id ? '#1A1A1A' : '#E8E8E8'}`, background: selected?.id === u.id ? '#1A1A1A' : '#fff', cursor: 'pointer', transition: 'all 0.15s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {u.avatar_url ? (
                  <img src={u.avatar_url} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} alt="" />
                ) : (
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#E9C000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#1A1A1A', flexShrink: 0 }}>
                    {(u.display_name || u.email || '?')[0].toUpperCase()}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 13, color: selected?.id === u.id ? '#fff' : '#1A1A1A', fontFamily: 'PretendardVariable, Pretendard, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {u.display_name || '-'} {u.role === 'admin' && <span style={{ fontSize: 10, background: '#E9C000', color: '#1A1A1A', padding: '1px 6px', borderRadius: 4, marginLeft: 4 }}>ADMIN</span>}
                  </p>
                  <p style={{ fontSize: 11, color: selected?.id === u.id ? '#aaa' : '#9A9A9A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</p>
                </div>
                <span style={{ fontSize: 11, color: selected?.id === u.id ? '#aaa' : '#9A9A9A', flexShrink: 0 }}>{u.nationality || ''}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 우측: 유저 상세 */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {selected ? (
          <div>
            {/* 프로필 */}
            <div style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1px solid #E8E8E8', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                {selected.avatar_url ? (
                  <img src={selected.avatar_url} style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover' }} alt="" />
                ) : (
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#E9C000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#1A1A1A' }}>
                    {(selected.display_name || selected.email || '?')[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <p style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 18, color: '#1A1A1A' }}>{selected.display_name || '-'}</p>
                  <p style={{ fontSize: 13, color: '#9A9A9A' }}>{selected.email}</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { label: 'Real Name', value: selected.real_name },
                  { label: 'Phone', value: selected.phone },
                  { label: 'Nationality', value: selected.nationality },
                  { label: 'Gender', value: selected.gender },
                  { label: 'Birth Date', value: selected.birth_date },
                  { label: 'Role', value: selected.role || 'user' },
                  { label: 'Joined', value: new Date(selected.created_at).toLocaleDateString('ko-KR') },
                  { label: 'Bio', value: selected.bio },
                ].map(({ label, value }) => value ? (
                  <div key={label} style={{ background: '#F7F7F7', borderRadius: 8, padding: '8px 12px' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#9A9A9A', marginBottom: 2, letterSpacing: '0.05em' }}>{label.toUpperCase()}</p>
                    <p style={{ fontSize: 13, color: '#1A1A1A', fontWeight: 500 }}>{value}</p>
                  </div>
                ) : null)}
              </div>
            </div>

            {/* 참여 이력 */}
            <div style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1px solid #E8E8E8' }}>
              <h3 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 700, fontSize: 16, color: '#1A1A1A', marginBottom: 12 }}>
                Event History ({selected.orders?.length ?? 0})
              </h3>
              {selected.orders?.length === 0 ? (
                <p style={{ fontSize: 13, color: '#9A9A9A' }}>No events yet</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selected.orders?.map((o: any) => (
                    <div key={o.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#F7F7F7', borderRadius: 8 }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>{o.events?.title || '-'}</p>
                        <p style={{ fontSize: 11, color: '#9A9A9A', marginTop: 2 }}>{new Date(o.created_at).toLocaleDateString('ko-KR')}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#1A1A1A' }}>
                          {o.amount_krw > 0 ? `₩${Number(o.amount_krw).toLocaleString()}` : 'Free'}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                          background: o.status === 'paid' ? '#DCFCE7' : o.status === 'free_confirmed' ? '#DBEAFE' : o.status === 'cancelled' ? '#FEE2E2' : '#F3F4F6',
                          color: o.status === 'paid' ? '#15803D' : o.status === 'free_confirmed' ? '#1D4ED8' : o.status === 'cancelled' ? '#DC2626' : '#6B7280' }}>
                          {o.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9A9A9A', fontSize: 14 }}>
            Select a user to view details
          </div>
        )}
      </div>
    </div>
  )
}
