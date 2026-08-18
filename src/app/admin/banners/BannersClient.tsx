'use client'
import { useState } from 'react'

export default function BannersClient({ banners }: { banners: any[] }) {
  const [list, setList] = useState(banners)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', image_url: '', link_url: '', position: 'home', sort_order: 0, is_active: true })
  const [saving, setSaving] = useState(false)

  const inputStyle: any = { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #E0E0E0', background: '#fff', color: '#1A1A1A', fontSize: 14, fontFamily: 'PretendardVariable, Pretendard, sans-serif', outline: 'none', boxSizing: 'border-box' }
  const labelStyle: any = { fontSize: 12, fontWeight: 700, color: '#6B6B6B', display: 'block', marginBottom: 6 }

  const save = async () => {
    if (!form.title || !form.link_url) return alert('제목과 링크 URL은 필수예요')
    setSaving(true)
    const res = await fetch('/api/admin/banners', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'create', ...form })
    }).then(r => r.json())
    if (res.ok) {
      setList(prev => [res.banner, ...prev])
      setShowForm(false)
      setForm({ title: '', image_url: '', link_url: '', position: 'home', sort_order: 0, is_active: true })
    } else alert(res.error)
    setSaving(false)
  }

  const toggle = async (id: string, is_active: boolean) => {
    await fetch('/api/admin/banners', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'toggle', id, is_active: !is_active })
    })
    setList(prev => prev.map(b => b.id === id ? { ...b, is_active: !is_active } : b))
  }

  const remove = async (id: string) => {
    if (!confirm('삭제할까요?')) return
    await fetch('/api/admin/banners', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id })
    })
    setList(prev => prev.filter(b => b.id !== id))
  }

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, fontSize: 24, color: '#1A1A1A', letterSpacing: '-0.04em' }}>스폰서 배너</h1>
          <p style={{ fontSize: 13, color: '#9A9A9A', marginTop: 4 }}>이미지 권장 규격: 1200×300px</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          style={{ padding: '10px 20px', borderRadius: 10, background: '#1A1A1A', color: '#E9C000', border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
          + 배너 추가
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#F7F7F7', borderRadius: 14, padding: 20, marginBottom: 24, border: '1px solid #E8E8E8' }}>
          <h3 style={{ fontWeight: 700, fontSize: 16, color: '#1A1A1A', marginBottom: 16, fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>새 배너</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>제목 *</label>
              <input style={inputStyle} value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="배너 제목" />
            </div>
            <div>
              <label style={labelStyle}>이미지 URL</label>
              <input style={inputStyle} value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} placeholder="https://..." />
              <p style={{ fontSize: 11, color: '#9A9A9A', marginTop: 4 }}>권장: 1200×300px, 500KB 이하</p>
            </div>
            <div>
              <label style={labelStyle}>링크 URL *</label>
              <input style={inputStyle} value={form.link_url} onChange={e => setForm({...form, link_url: e.target.value})} placeholder="https://..." />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>노출 위치</label>
                <select style={inputStyle} value={form.position} onChange={e => setForm({...form, position: e.target.value})}>
                  <option value="home">홈</option>
                  <option value="events">이벤트 목록</option>
                  <option value="community">커뮤니티</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>순서 (낮을수록 먼저)</label>
                <input style={inputStyle} type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: Number(e.target.value)})} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={save} disabled={saving}
                style={{ padding: '11px 24px', borderRadius: 10, background: '#1A1A1A', color: '#E9C000', border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
                {saving ? '저장 중...' : '저장'}
              </button>
              <button onClick={() => setShowForm(false)}
                style={{ padding: '11px 24px', borderRadius: 10, background: '#F0F0F0', color: '#6B6B6B', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {list.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#9A9A9A', fontSize: 14 }}>배너가 없어요. 추가해보세요!</div>
        )}
        {list.map(b => (
          <div key={b.id} style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
            {b.image_url && (
              <img src={b.image_url} alt="" style={{ width: 100, height: 56, objectFit: 'cover', borderRadius: 8, flexShrink: 0, border: '1px solid #F0F0F0' }} />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 3, fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>{b.title}</p>
              <p style={{ fontSize: 12, color: '#9A9A9A', marginBottom: 3 }}>위치: {b.position} · 순서: {b.sort_order}</p>
              <a href={b.link_url} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 12, color: '#1A1A1A', textDecoration: 'underline', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                {b.link_url}
              </a>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button onClick={() => toggle(b.id, b.is_active)}
                style={{ padding: '6px 14px', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: 12, cursor: 'pointer',
                  background: b.is_active ? '#DCFCE7' : '#F0F0F0', color: b.is_active ? '#15803D' : '#9A9A9A' }}>
                {b.is_active ? 'ON' : 'OFF'}
              </button>
              <button onClick={() => remove(b.id)}
                style={{ padding: '6px 14px', borderRadius: 8, background: '#FEE2E2', color: '#DC2626', border: 'none', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
