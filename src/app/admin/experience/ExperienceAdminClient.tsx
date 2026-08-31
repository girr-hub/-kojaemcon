'use client'
import { useState } from 'react'

export default function ExperienceAdminClient({ events, applications }: { events: any[], applications: any[] }) {
  const [list, setList] = useState(events)
  const [editTarget, setEditTarget] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  const inputStyle: any = { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #E0E0E0', fontSize: 14, fontFamily: 'PretendardVariable, Pretendard, sans-serif', outline: 'none', boxSizing: 'border-box' }
  const labelStyle: any = { fontSize: 12, fontWeight: 700, color: '#6B6B6B', display: 'block', marginBottom: 6 }

  const save = async () => {
    setSaving(true)
    const res = await fetch('/api/experience', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'update', ...editTarget })
    }).then(r => r.json())
    if (res.ok) {
      setList(prev => prev.map(e => e.id === editTarget.id ? editTarget : e))
      setEditTarget(null)
    } else alert(res.error)
    setSaving(false)
  }

  const toggleStatus = async (id: string, status: string) => {
    const newStatus = status === 'published' ? 'draft' : 'published'
    await fetch('/api/experience', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'update', id, status: newStatus })
    })
    setList(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e))
  }

  const deleteEvent = async (id: string) => {
    if (!confirm('삭제할까요?')) return
    await fetch('/api/experience', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id })
    })
    setList(prev => prev.filter(e => e.id !== id))
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, fontSize: 24, color: '#1A1A1A', letterSpacing: '-0.04em', marginBottom: 24 }}>체험단 관리</h1>

      {/* 수정 모달 */}
      {editTarget && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, width: '100%', maxWidth: 500, maxHeight: '80vh', overflowY: 'auto' }}>
            <h2 style={{ fontWeight: 800, fontSize: 18, color: '#1A1A1A', marginBottom: 20, fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>체험단 수정</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>제목</label>
                <input style={inputStyle} value={editTarget.title} onChange={e => setEditTarget({...editTarget, title: e.target.value})} />
              </div>
              <div>
                <label style={labelStyle}>설명</label>
                <textarea style={{...inputStyle, resize: 'none'}} rows={4} value={editTarget.description} onChange={e => setEditTarget({...editTarget, description: e.target.value})} />
              </div>
              <div>
                <label style={labelStyle}>장소</label>
                <input style={inputStyle} value={editTarget.location} onChange={e => setEditTarget({...editTarget, location: e.target.value})} />
              </div>
              <div>
                <label style={labelStyle}>모집 인원</label>
                <input style={inputStyle} type="number" value={editTarget.capacity} onChange={e => setEditTarget({...editTarget, capacity: Number(e.target.value)})} />
              </div>
              <div>
                <label style={labelStyle}>상태</label>
                <select style={inputStyle} value={editTarget.status} onChange={e => setEditTarget({...editTarget, status: e.target.value})}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button onClick={save} disabled={saving}
                  style={{ flex: 1, padding: '12px', borderRadius: 10, background: '#1A1A1A', color: '#E9C000', border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
                  {saving ? '저장 중...' : '저장'}
                </button>
                <button onClick={() => setEditTarget(null)}
                  style={{ flex: 1, padding: '12px', borderRadius: 10, background: '#F0F0F0', color: '#6B6B6B', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 체험단 목록 */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontWeight: 700, fontSize: 16, color: '#1A1A1A', marginBottom: 12, fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>등록된 체험단 ({list.length})</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {list.map(e => (
            <div key={e.id} style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A', fontFamily: 'PretendardVariable, Pretendard, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title}</p>
                <p style={{ fontSize: 12, color: '#9A9A9A', marginTop: 2 }}>모집 {e.capacity}명 · {e.location}</p>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={() => setEditTarget({...e})}
                  style={{ padding: '6px 12px', borderRadius: 8, background: '#F0F0F0', color: '#1A1A1A', border: 'none', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>수정</button>
                <button onClick={() => toggleStatus(e.id, e.status)}
                  style={{ padding: '6px 12px', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: 12, cursor: 'pointer',
                    background: e.status === 'published' ? '#DCFCE7' : '#F0F0F0', color: e.status === 'published' ? '#15803D' : '#9A9A9A' }}>
                  {e.status === 'published' ? 'ON' : 'OFF'}
                </button>
                <button onClick={() => deleteEvent(e.id)}
                  style={{ padding: '6px 12px', borderRadius: 8, background: '#FEE2E2', color: '#DC2626', border: 'none', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>삭제</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 신청 목록 */}
      <div>
        <h2 style={{ fontWeight: 700, fontSize: 16, color: '#1A1A1A', marginBottom: 12, fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>신청 현황 ({applications.length})</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F7F7F7' }}>
                {['체험단', '실명', '은행', '계좌번호', '전화', '희망날짜', '장소', 'SNS', '동행인', '신청일'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: '#6B6B6B', fontSize: 11, whiteSpace: 'nowrap', borderBottom: '1px solid #E8E8E8' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {applications.map(a => (
                <tr key={a.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600, fontSize: 12, whiteSpace: 'nowrap' }}>{(a.experience_events as any)?.title}</td>
                  <td style={{ padding: '10px 12px' }}>{a.real_name}</td>
                  <td style={{ padding: '10px 12px', color: '#6B6B6B' }}>{a.bank_name}</td>
                  <td style={{ padding: '10px 12px', color: '#6B6B6B' }}>{a.account_number}</td>
                  <td style={{ padding: '10px 12px', color: '#6B6B6B', whiteSpace: 'nowrap' }}>{a.account_phone}</td>
                  <td style={{ padding: '10px 12px', color: '#6B6B6B', whiteSpace: 'nowrap' }}>{a.preferred_date}</td>
                  <td style={{ padding: '10px 12px', color: '#6B6B6B', maxWidth: 150 }}>{a.preferred_location}</td>
                  <td style={{ padding: '10px 12px', color: '#6B6B6B' }}>{a.sns_accounts || '-'}</td>
                  <td style={{ padding: '10px 12px', color: '#6B6B6B', textAlign: 'center' }}>{a.companions}</td>
                  <td style={{ padding: '10px 12px', color: '#6B6B6B', whiteSpace: 'nowrap' }}>{new Date(a.created_at).toLocaleDateString('ko-KR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {applications.length === 0 && (
            <p style={{ textAlign: 'center', padding: '32px', color: '#9A9A9A', fontSize: 14 }}>신청이 없어요</p>
          )}
        </div>
      </div>
    </div>
  )
}
