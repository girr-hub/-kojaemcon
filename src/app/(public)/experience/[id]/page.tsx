'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'

const BANKS = ['KB국민은행', '신한은행', '우리은행', '하나은행', 'IBK기업은행', 'NH농협은행', '카카오뱅크', '토스뱅크', '케이뱅크', '씨티은행', 'SC제일은행']

export default function ExperienceDetailPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [currentImg, setCurrentImg] = useState(0)
  const [form, setForm] = useState({
    real_name: '', bank_name: '', account_number: '', account_phone: '',
    preferred_date: '', sns_accounts: '', companions: 0, preferred_location: ''
  })

  useEffect(() => {
    const sb = supabase()
    sb.from('experience_events').select('*').eq('id', params.id).single()
      .then(({ data }) => { setEvent(data); setLoading(false) })
    sb.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [params.id])

  const submit = async () => {
    if (!user) { window.location.href = '/login'; return }
    if (!form.real_name || !form.bank_name || !form.account_number || !form.account_phone || !form.preferred_date || !form.preferred_location) {
      alert('Please fill in all required fields'); return
    }
    setSubmitting(true)
    const res = await fetch('/api/experience', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'apply', event_id: params.id, ...form })
    }).then(r => r.json())
    setSubmitting(false)
    if (res.ok) setSubmitted(true)
    else alert(res.error)
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>Loading...</div>
  if (!event) return <div style={{ padding: 40, textAlign: 'center' }}>Not found</div>

  const images = event.images ?? []

  return (
    <div style={{ background: '#F5F5F5', minHeight: '100vh', paddingBottom: 100 }}>

      {/* 이미지 슬라이더 */}
      {images.length > 0 && (
        <div style={{ position: 'relative', background: '#000' }}>
          <img src={images[currentImg]} alt="" style={{ width: '100%', height: 280, objectFit: 'cover', display: 'block', opacity: 0.9 }} />
          {images.length > 1 && (
            <>
              <button onClick={() => setCurrentImg(i => (i - 1 + images.length) % images.length)}
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.4)', border: 'none', color: '#fff', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: 16 }}>←</button>
              <button onClick={() => setCurrentImg(i => (i + 1) % images.length)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.4)', border: 'none', color: '#fff', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: 16 }}>→</button>
              <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4 }}>
                {images.map((_: any, i: number) => (
                  <div key={i} onClick={() => setCurrentImg(i)} style={{ width: i === currentImg ? 16 : 6, height: 6, borderRadius: 3, background: i === currentImg ? '#fff' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.2s' }} />
                ))}
              </div>
              <span style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 11, padding: '3px 8px', borderRadius: 10 }}>{currentImg + 1}/{images.length}</span>
            </>
          )}
        </div>
      )}

      <div style={{ background: '#FFFFFF', padding: '20px 16px', marginBottom: 8 }}>
        <h1 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, fontSize: 22, color: '#1A1A1A', letterSpacing: '-0.04em', marginBottom: 8 }}>{event.title}</h1>
        <p style={{ fontSize: 14, color: '#6B6B6B', lineHeight: 1.7, marginBottom: 12 }}>{event.description}</p>
        {event.location && <p style={{ fontSize: 13, color: '#999' }}>📍 {event.location}</p>}
        {event.available_dates?.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#6B6B6B', marginBottom: 6 }}>Available Dates</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {event.available_dates.map((d: string, i: number) => (
                <span key={i} style={{ fontSize: 12, background: '#F7F7F7', border: '1px solid #E8E8E8', borderRadius: 6, padding: '4px 10px', color: '#555' }}>{d}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 신청 폼 */}
      {submitted ? (
        <div style={{ background: '#FFFFFF', margin: '0 16px', borderRadius: 14, padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
          <p style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 18, color: '#1A1A1A', marginBottom: 6 }}>Application Submitted!</p>
          <p style={{ fontSize: 14, color: '#999' }}>We will review your application and get back to you soon.</p>
        </div>
      ) : (
        <div style={{ background: '#FFFFFF', padding: '20px 16px' }}>
          <h2 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 18, color: '#1A1A1A', marginBottom: 16, letterSpacing: '-0.03em' }}>Apply for Experience</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* 실명 */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#6B6B6B', display: 'block', marginBottom: 6 }}>Real Name <span style={{ color: '#DC2626' }}>*</span></label>
              <input value={form.real_name} onChange={e => setForm({...form, real_name: e.target.value})}
                placeholder="Your full name"
                style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: '1.5px solid #E8E8E8', fontSize: 14, fontFamily: 'PretendardVariable, Pretendard, sans-serif', outline: 'none', boxSizing: 'border-box' as any }} />
            </div>

            {/* 계좌 정보 */}
            <div style={{ background: '#F7F7F7', borderRadius: 12, padding: 14 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#6B6B6B', marginBottom: 10 }}>페이백 계좌정보 <span style={{ color: '#DC2626' }}>*</span></p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <select value={form.bank_name} onChange={e => setForm({...form, bank_name: e.target.value})}
                  style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: '1.5px solid #E8E8E8', fontSize: 14, fontFamily: 'PretendardVariable, Pretendard, sans-serif', outline: 'none', background: '#fff', boxSizing: 'border-box' as any }}>
                  <option value="">은행 선택</option>
                  {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                <input value={form.account_number} onChange={e => setForm({...form, account_number: e.target.value})}
                  placeholder="계좌번호"
                  style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: '1.5px solid #E8E8E8', fontSize: 14, fontFamily: 'PretendardVariable, Pretendard, sans-serif', outline: 'none', boxSizing: 'border-box' as any }} />
                <input value={form.account_phone} onChange={e => setForm({...form, account_phone: e.target.value})}
                  placeholder="계좌주 전화번호"
                  style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: '1.5px solid #E8E8E8', fontSize: 14, fontFamily: 'PretendardVariable, Pretendard, sans-serif', outline: 'none', boxSizing: 'border-box' as any }} />
              </div>
            </div>

            {/* 희망 날짜 */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#6B6B6B', display: 'block', marginBottom: 6 }}>체험 희망 날짜 <span style={{ color: '#DC2626' }}>*</span></label>
              <input value={form.preferred_date} onChange={e => setForm({...form, preferred_date: e.target.value})}
                placeholder="예: 2026년 9월 15일 또는 주말 희망"
                style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: '1.5px solid #E8E8E8', fontSize: 14, fontFamily: 'PretendardVariable, Pretendard, sans-serif', outline: 'none', boxSizing: 'border-box' as any }} />
            </div>

            {/* SNS */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#6B6B6B', display: 'block', marginBottom: 6 }}>운영 중인 SNS 계정</label>
              <input value={form.sns_accounts} onChange={e => setForm({...form, sns_accounts: e.target.value})}
                placeholder="예: @instagram_id, YouTube: 채널명"
                style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: '1.5px solid #E8E8E8', fontSize: 14, fontFamily: 'PretendardVariable, Pretendard, sans-serif', outline: 'none', boxSizing: 'border-box' as any }} />
            </div>

            {/* 동행인 */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#6B6B6B', display: 'block', marginBottom: 6 }}>동행인 수</label>
              <input type="number" min="0" value={form.companions} onChange={e => setForm({...form, companions: Number(e.target.value)})}
                style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: '1.5px solid #E8E8E8', fontSize: 14, fontFamily: 'PretendardVariable, Pretendard, sans-serif', outline: 'none', boxSizing: 'border-box' as any }} />
            </div>

            {/* 희망 장소 */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#6B6B6B', display: 'block', marginBottom: 6 }}>희망 체험 장소 <span style={{ color: '#DC2626' }}>*</span></label>
              <textarea value={form.preferred_location} onChange={e => setForm({...form, preferred_location: e.target.value})}
                placeholder="희망하는 체험 장소를 모두 입력해주세요"
                rows={3}
                style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: '1.5px solid #E8E8E8', fontSize: 14, fontFamily: 'PretendardVariable, Pretendard, sans-serif', outline: 'none', resize: 'none', boxSizing: 'border-box' as any }} />
            </div>

            <button onClick={submit} disabled={submitting}
              style={{ width: '100%', padding: '14px', borderRadius: 12, background: '#1A1A1A', color: '#E9C000', border: 'none', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'PretendardVariable, Pretendard, sans-serif', opacity: submitting ? 0.6 : 1 }}>
              {submitting ? '신청 중...' : '체험단 신청하기'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
