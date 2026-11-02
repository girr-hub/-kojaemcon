'use client'
import { useState, useMemo } from 'react'

function exportUsersCSV(users: any[]) {
  if (!users.length) return
  const rows = users.map(u => ({
    'Display Name': u.display_name || '',
    'Real Name': u.real_name || '',
    Email: u.email || '',
    Phone: u.phone || '',
    Nationality: u.nationality || '',
    Gender: u.gender || '',
    'Birth Date': u.birth_date || '',
    Age: u.birth_date ? new Date().getFullYear() - new Date(u.birth_date).getFullYear() : '',
    Role: u.role || 'user',
    Joined: new Date(u.created_at).toLocaleDateString('en-US'),
    Orders: u.orders?.length ?? 0,
  }))
  const headers = Object.keys(rows[0])
  const csv = [headers.join(','), ...rows.map(r => headers.map(h => {
    const v = (r as any)[h]; const s = String(v ?? '').replace(/"/g, '""')
    return s.includes(',') || s.includes('\n') ? '"' + s + '"' : s
  }).join(','))].join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = 'kogemcon_users_' + new Date().toISOString().slice(0, 10) + '.csv'; a.click()
  URL.revokeObjectURL(url)
}

const STATUS_BG: Record<string, string> = { paid: '#dcfce7', free_confirmed: '#dbeafe', pending: '#fef9c3', cancelled: '#fee2e2', failed: '#fce7f3' }
const STATUS_FG: Record<string, string> = { paid: '#15803d', free_confirmed: '#1d4ed8', pending: '#854d0e', cancelled: '#dc2626', failed: '#9d174d' }

export default function UsersClient({ users }: { users: any[] }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<any>(null)
  const [sortBy, setSortBy] = useState<'joined' | 'orders'>('joined')

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    let list = q ? users.filter(u =>
      u.display_name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q) ||
      u.nationality?.toLowerCase().includes(q) ||
      u.real_name?.toLowerCase().includes(q)
    ) : [...users]
    if (sortBy === 'orders') list.sort((a, b) => (b.orders?.length ?? 0) - (a.orders?.length ?? 0))
    else list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    return list
  }, [users, query, sortBy])

  return (
    <div style={{ display: 'flex', gap: 20, height: 'calc(100vh - 80px)' }}>

      {/* Left: user list */}
      <div style={{ width: 340, flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <h1 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, fontSize: 22, color: '#111', letterSpacing: '-0.04em' }}>
              Users <span style={{ fontSize: 15, fontWeight: 600, color: '#aaa' }}>({filtered.length})</span>
            </h1>
            <button onClick={() => exportUsersCSV(filtered)}
              style={{ padding: '6px 12px', borderRadius: 7, border: 'none', background: '#111', color: '#F5C400', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
              Export CSV
            </button>
          </div>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search name, email, phone, nationality..."
            style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid #E8E8E4', fontSize: 13, fontFamily: 'PretendardVariable, Pretendard, sans-serif', outline: 'none', boxSizing: 'border-box', marginBottom: 8 }}
          />
          <div style={{ display: 'flex', gap: 4 }}>
            {[{ id: 'joined', label: 'Newest' }, { id: 'orders', label: 'Most active' }].map(s => (
              <button key={s.id} onClick={() => setSortBy(s.id as any)}
                style={{ padding: '5px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: 'none', fontFamily: 'PretendardVariable, Pretendard, sans-serif',
                  background: sortBy === s.id ? '#111' : '#F4F4F4', color: sortBy === s.id ? '#fff' : '#888' }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {filtered.map(u => (
            <div key={u.id} onClick={() => setSelected(u)}
              style={{ padding: '11px 12px', borderRadius: 10, border: `1.5px solid ${selected?.id === u.id ? '#111' : '#F0F0F0'}`, background: selected?.id === u.id ? '#111' : '#fff', cursor: 'pointer', transition: 'all 0.12s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {u.avatar_url
                  ? <img src={u.avatar_url} style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} alt="" />
                  : <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#F5C400', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#111', flexShrink: 0 }}>
                      {(u.display_name || u.email || '?')[0].toUpperCase()}
                    </div>
                }
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: 13, color: selected?.id === u.id ? '#fff' : '#111', fontFamily: 'PretendardVariable, Pretendard, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {u.display_name || u.email}
                    </p>
                    {u.role === 'admin' && <span style={{ fontSize: 9, background: '#F5C400', color: '#111', padding: '1px 5px', borderRadius: 4, fontWeight: 800, flexShrink: 0 }}>ADMIN</span>}
                  </div>
                  <p style={{ fontSize: 11, color: selected?.id === u.id ? 'rgba(255,255,255,0.5)' : '#aaa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {u.nationality || ''}{u.nationality && u.orders?.length ? ' · ' : ''}{u.orders?.length ? `${u.orders.length} events` : ''}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#aaa', fontSize: 13 }}>No users found</div>
          )}
        </div>
      </div>

      {/* Right: user detail */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {selected ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Profile card */}
            <div style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1px solid #E8E8E4' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                {selected.avatar_url
                  ? <img src={selected.avatar_url} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }} alt="" />
                  : <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#F5C400', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: '#111' }}>
                      {(selected.display_name || selected.email || '?')[0].toUpperCase()}
                    </div>
                }
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <p style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 20, color: '#111' }}>{selected.display_name || '—'}</p>
                    {selected.role === 'admin' && <span style={{ fontSize: 10, background: '#F5C400', color: '#111', padding: '2px 7px', borderRadius: 5, fontWeight: 800 }}>ADMIN</span>}
                  </div>
                  <p style={{ fontSize: 13, color: '#aaa' }}>{selected.email}</p>
                  <p style={{ fontSize: 12, color: '#bbb', marginTop: 2 }}>Joined {new Date(selected.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
                {[
                  { label: 'Real Name', value: selected.real_name },
                  { label: 'Phone', value: selected.phone },
                  { label: 'Nationality', value: selected.nationality },
                  { label: 'Gender', value: selected.gender },
                  { label: 'Age', value: selected.birth_date ? String(new Date().getFullYear() - new Date(selected.birth_date).getFullYear()) + ' yrs' : undefined },
                  { label: 'Birth Date', value: selected.birth_date },
                  { label: 'Events', value: String(selected.orders?.length ?? 0) },
                  { label: 'Referral', value: selected.referral_source },
                ].filter(x => x.value).map(({ label, value }) => (
                  <div key={label} style={{ background: '#F8F8F8', borderRadius: 8, padding: '8px 12px' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#aaa', marginBottom: 2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</p>
                    <p style={{ fontSize: 13, color: '#111', fontWeight: 600 }}>{value}</p>
                  </div>
                ))}
              </div>

              {selected.interests?.length > 0 && (
                <div style={{ marginTop: 14 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#aaa', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Interests</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {selected.interests.map((i: string) => (
                      <span key={i} style={{ fontSize: 11, background: '#F5C40018', color: '#7A6100', padding: '3px 9px', borderRadius: 20, fontWeight: 600 }}>{i}</span>
                    ))}
                  </div>
                </div>
              )}

              {selected.bio && (
                <div style={{ marginTop: 14, padding: '10px 14px', background: '#F8F8F8', borderRadius: 10 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#aaa', marginBottom: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Bio</p>
                  <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6 }}>{selected.bio}</p>
                </div>
              )}
            </div>

            {/* Event history */}
            <div style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1px solid #E8E8E4' }}>
              <h3 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 15, color: '#111', marginBottom: 12 }}>
                Event History ({selected.orders?.length ?? 0})
              </h3>
              {!selected.orders?.length ? (
                <p style={{ fontSize: 13, color: '#aaa' }}>No events yet</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {selected.orders.map((o: any) => (
                    <div key={o.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#F8F8F8', borderRadius: 8, gap: 10 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#111', fontFamily: 'PretendardVariable, Pretendard, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.events?.title || '—'}</p>
                        <p style={{ fontSize: 11, color: '#aaa', marginTop: 1 }}>{new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#111' }}>
                          {o.amount_krw > 0 ? `₩${Number(o.amount_krw).toLocaleString()}` : 'Free'}
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 6, background: STATUS_BG[o.status] || '#F4F4F4', color: STATUS_FG[o.status] || '#888' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 36 }}>👤</span>
            <p style={{ fontSize: 14, color: '#aaa', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>Select a user to view details</p>
          </div>
        )}
      </div>
    </div>
  )
}
