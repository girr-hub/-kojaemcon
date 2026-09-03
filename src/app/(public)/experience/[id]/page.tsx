'use client'
import { useEffect, useState, use } from 'react'
import { supabase } from '@/lib/supabase/client'

const ONHWA_ID = 'f4e90964-0f01-4ba3-9992-7c5464a539a3'

const BANKS = ['KB Kookmin Bank', 'Shinhan Bank', 'Woori Bank', 'Hana Bank', 'IBK Industrial Bank', 'NH NongHyup Bank', 'Kakao Bank', 'Toss Bank', 'K Bank', 'Citibank Korea', 'Standard Chartered Bank']


const inputStyle: any = { width: '100%', padding: '11px 12px', borderRadius: 10, border: '1.5px solid #E8E8E8', fontSize: 14, fontFamily: 'PretendardVariable, Pretendard, sans-serif', outline: 'none', boxSizing: 'border-box' }
const labelStyle: any = { fontSize: 12, fontWeight: 700, color: '#6B6B6B', display: 'block', marginBottom: 6 }

function OnhwaForm({ form, setForm }: { form: any, setForm: any }) {
  return (
    <>
      <div>
        <label style={labelStyle}>Real Name <span style={{ color: '#DC2626' }}>*</span></label>
        <input value={form.real_name} onChange={e => setForm({...form, real_name: e.target.value})} placeholder="Your full name" style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Email <span style={{ color: '#DC2626' }}>*</span></label>
        <input type="email" value={form.email || ''} onChange={e => setForm({...form, email: e.target.value})} placeholder="your@email.com" style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Phone Number <span style={{ color: '#DC2626' }}>*</span></label>
        <input value={form.phone || ''} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+82 10-0000-0000" style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>KakaoTalk ID</label>
        <input value={form.kakao_id || ''} onChange={e => setForm({...form, kakao_id: e.target.value})} placeholder="Your KakaoTalk ID" style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>SNS Accounts</label>
        <input value={form.sns_accounts} onChange={e => setForm({...form, sns_accounts: e.target.value})} placeholder="e.g. @instagram_id" style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Number of Companions (excluding yourself)</label>
        <input type="number" min="0" value={form.companions} onChange={e => setForm({...form, companions: Number(e.target.value)})} style={inputStyle} />
      </div>
      <div style={{ background: '#FFFBEA', borderRadius: 10, padding: '14px', border: '1px solid #F5E87C' }}>
        <p style={{ fontSize: 13, color: '#7A6100', lineHeight: 1.7, marginBottom: 12, fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
          I agree to write a review on-site before leaving the venue.
        </p>
        <label style={labelStyle}>Type "I agree" to confirm <span style={{ color: '#DC2626' }}>*</span></label>
        <input value={form.preferred_location} onChange={e => setForm({...form, preferred_location: e.target.value})}
          placeholder="I agree"
          style={{ ...inputStyle, border: '1.5px solid ' + (form.preferred_location.toLowerCase().trim() === 'i agree' ? '#00C471' : '#E8E8E8') }} />
        {form.preferred_location.toLowerCase().trim() === 'i agree' && (
          <p style={{ fontSize: 12, color: '#00C471', marginTop: 6, fontWeight: 600 }}>✓ Confirmed</p>
        )}
      </div>
    </>
  )
}

function StandardForm({ form, setForm }: { form: any, setForm: any }) {
  return (
    <>
      <div>
        <label style={labelStyle}>Real Name <span style={{ color: '#DC2626' }}>*</span></label>
        <input value={form.real_name} onChange={e => setForm({...form, real_name: e.target.value})} placeholder="Your full name" style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Email <span style={{ color: '#DC2626' }}>*</span></label>
        <input type="email" value={form.email || ''} onChange={e => setForm({...form, email: e.target.value})} placeholder="your@email.com" style={inputStyle} />
      </div>
      <div style={{ background: '#F7F7F7', borderRadius: 12, padding: 14 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#6B6B6B', marginBottom: 10 }}>Payback Account Info <span style={{ color: '#DC2626' }}>*</span></p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <select value={form.bank_name} onChange={e => setForm({...form, bank_name: e.target.value})} style={{ ...inputStyle, background: '#fff' }}>
            <option value="">Select Bank</option>
            {['KB Kookmin Bank','Shinhan Bank','Woori Bank','Hana Bank','IBK Industrial Bank','NH NongHyup Bank','Kakao Bank','Toss Bank','K Bank','Citibank Korea','Standard Chartered Bank'].map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <input value={form.account_number} onChange={e => setForm({...form, account_number: e.target.value})} placeholder="Account Number" style={inputStyle} />
          <input value={form.account_phone} onChange={e => setForm({...form, account_phone: e.target.value})} placeholder="Account Holder Phone" style={inputStyle} />
        </div>
      </div>
      <div>
        <label style={labelStyle}>Preferred Date <span style={{ color: '#DC2626' }}>*</span></label>
        <input value={form.preferred_date} onChange={e => setForm({...form, preferred_date: e.target.value})} placeholder="e.g. September 15, 2026" style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>SNS Accounts</label>
        <input value={form.sns_accounts} onChange={e => setForm({...form, sns_accounts: e.target.value})} placeholder="e.g. @instagram_id" style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Number of Companions (excluding yourself, max 1)</label>
        <input type="number" min="0" max="1" value={form.companions} onChange={e => setForm({...form, companions: Math.min(1, Number(e.target.value))})} style={inputStyle} />
      </div>
      <div style={{ background: '#FFFBEA', borderRadius: 10, padding: '14px', border: '1px solid #F5E87C' }}>
        <p style={{ fontSize: 13, color: '#7A6100', lineHeight: 1.7, marginBottom: 12, fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
          I have read and understood all the details. For any inquiries, I will contact via the CS KakaoTalk channel.
        </p>
        <label style={labelStyle}>Type "I understand" to confirm <span style={{ color: '#DC2626' }}>*</span></label>
        <input value={form.preferred_location} onChange={e => setForm({...form, preferred_location: e.target.value})}
          placeholder="I understand"
          style={{ ...inputStyle, border: '1.5px solid ' + (form.preferred_location.toLowerCase().trim() === 'i understand' ? '#00C471' : '#E8E8E8') }} />
        {form.preferred_location.toLowerCase().trim() === 'i understand' && (
          <p style={{ fontSize: 12, color: '#00C471', marginTop: 6, fontWeight: 600 }}>✓ Confirmed</p>
        )}
      </div>
    </>
  )
}

export default function ExperienceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [currentImg, setCurrentImg] = useState(0)
  const [form, setForm] = useState({
    real_name: '', bank_name: '', account_number: '', account_phone: '',
    preferred_date: '', sns_accounts: '', companions: 0, preferred_location: '',
    phone: '', kakao_id: '', email: ''
  })

  useEffect(() => {
    // API로 데이터 가져오기 (RLS 우회)
    fetch(`/api/experience-list?id=${id}`)
      .then(r => r.json())
      .then(d => { setEvent(Array.isArray(d) ? d[0] : d); setLoading(false) })
    supabase().auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [id])

  const submit = async () => {
    if (!user) { window.location.href = '/login'; return }
    if (id === ONHWA_ID) {
      if (!form.real_name || !form.phone || !form.preferred_location) {
        alert('Please fill in all required fields'); return
      }
      if (form.preferred_location.toLowerCase().trim() !== 'i agree') {
        alert('Please type "I agree" to confirm'); return
      }
    } else {
      if (!form.real_name || !form.bank_name || !form.account_number || !form.account_phone || !form.preferred_date) {
        alert('Please fill in all required fields'); return
      }
      if (form.preferred_location.toLowerCase().trim() !== 'i understand') {
        alert('Please type "I understand" to confirm'); return
      }
    }
    setSubmitting(true)
    const res = await fetch('/api/experience', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'apply', event_id: id, ...form, email: form.email || '' })
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
        <div style={{ fontSize: 14, color: '#6B6B6B', lineHeight: 1.7, marginBottom: 12 }}
          dangerouslySetInnerHTML={{ __html: (event.description || '')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/### (.+)/g, '<h3 style="font-size:16px;font-weight:800;color:#1A1A1A;margin:8px 0 4px">$1</h3>')
            .replace(/• (.+)/g, '<div style="display:flex;gap:6px;margin:2px 0"><span>•</span><span>$1</span></div>')
            .replace(/\n/g, '<br/>')
          }} />
        {event.location && <p style={{ fontSize: 13, color: '#999' }}>📍 {event.location}</p>}
        <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
          <span style={{ fontSize: 13, color: '#6B6B6B', fontWeight: 600 }}>
            신청 {event.applicant_count ?? 0}명
          </span>
          {event.capacity && (
            <span style={{ fontSize: 13, color: '#9A9A9A' }}>/ 모집 {event.capacity}명</span>
          )}
        </div>
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

      {event.status === 'closed' ? (
        <div style={{ background: '#FEE2E2', margin: '0 16px', borderRadius: 14, padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
          <p style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 18, color: '#DC2626', marginBottom: 6 }}>Applications Closed</p>
          <p style={{ fontSize: 14, color: '#6B6B6B' }}>This experience is no longer accepting applications.</p>
        </div>
      ) : submitted ? (
        <div style={{ background: '#FFFFFF', margin: '0 16px', borderRadius: 14, padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
          <p style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 18, color: '#1A1A1A', marginBottom: 6 }}>Application Submitted!</p>
          <p style={{ fontSize: 14, color: '#999' }}>We will review your application and get back to you soon.</p>
        </div>
      ) : (
        <div style={{ background: '#FFFFFF', padding: '20px 16px' }}>
          <h2 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 18, color: '#1A1A1A', marginBottom: 16, letterSpacing: '-0.03em' }}>Apply for Experience</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {id === ONHWA_ID ? (
              <OnhwaForm form={form} setForm={setForm} />
            ) : (
              <StandardForm form={form} setForm={setForm} />
            )}




            <button onClick={submit} disabled={submitting}
              style={{ width: '100%', padding: '14px', borderRadius: 12, background: '#1A1A1A', color: '#E9C000', border: 'none', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'PretendardVariable, Pretendard, sans-serif', opacity: submitting ? 0.6 : 1 }}>
              {submitting ? 'Submitting...' : 'Apply Now'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
