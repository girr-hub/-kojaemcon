'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const COUNTRIES = ['Afghanistan','Albania','Algeria','Andorra','Angola','Argentina','Armenia','Australia','Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia','Botswana','Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','Cambodia','Cameroon','Canada','Chile','China','Colombia','Congo','Costa Rica','Croatia','Cuba','Cyprus','Czech Republic','Denmark','Dominican Republic','Ecuador','Egypt','El Salvador','Estonia','Ethiopia','Finland','France','Gabon','Georgia','Germany','Ghana','Greece','Guatemala','Guinea','Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kosovo','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Libya','Lithuania','Luxembourg','Madagascar','Malaysia','Maldives','Mali','Malta','Mexico','Moldova','Mongolia','Montenegro','Morocco','Mozambique','Myanmar','Namibia','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','North Korea','North Macedonia','Norway','Oman','Pakistan','Palestine','Panama','Paraguay','Peru','Philippines','Poland','Portugal','Qatar','Romania','Russia','Rwanda','Saudi Arabia','Senegal','Serbia','Sierra Leone','Singapore','Slovakia','Slovenia','Somalia','South Africa','South Korea','South Sudan','Spain','Sri Lanka','Sudan','Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Thailand','Togo','Trinidad and Tobago','Tunisia','Turkey','Turkmenistan','Uganda','Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe']

const REFERRALS = ['Instagram','Facebook','Twitter / X','TikTok','YouTube','Google Search','Friend / Word of mouth','Event flyer','KakaoTalk','Naver','Other']

const INTEREST_CATEGORIES = [
  { label: '🏃 Sports & Fitness', items: ['Running', 'Gym', 'Yoga', 'Swimming', 'Hiking', 'Cycling', 'Football', 'Basketball', 'Tennis', 'Martial Arts'] },
  { label: '🎨 Creative', items: ['Photography', 'Drawing', 'Music', 'Dancing', 'Writing', 'Fashion', 'Film'] },
  { label: '🌱 Lifestyle', items: ['Plant parent', 'Cooking', 'Baking', 'Coffee lover', 'Reading', 'Meditation', 'Skincare'] },
  { label: '🌍 Travel & Culture', items: ['Backpacking', 'K-Culture', 'Language learning', 'Museums', 'Street food'] },
  { label: '🎮 Entertainment', items: ['Gaming', 'Anime', 'K-drama', 'Movies', 'Live music', 'Festivals', 'Podcasts'] },
  { label: '🌤 Personality', items: ['Summer person ☀️', 'Winter person ❄️', 'Morning person', 'Night owl', 'Introvert', 'Extrovert', 'Foodie', 'Adventure seeker'] },
]

export default function SignupPage() {
  const [step, setStep] = useState(1) // 1: basic, 2: profile, 3: interests
  const [f, setF] = useState({
    display_name: '', email: '', password: '', nationality: '',
    birth_date: '', gender: 'undisclosed', referral_source: '',
  })
  const [interests, setInterests] = useState<string[]>([])
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const sb = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const input = "w-full bg-[#F8F8F6] border border-[#E8E8E4] text-[#0A0A0A] px-4 py-3 rounded-xl outline-none focus:border-[#0A0A0A] font-sans text-sm"

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const toggleInterest = (item: string) => {
    setInterests(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item])
  }

  const submit = async () => {
    setErr('')
    setLoading(true)

    const { data, error: signupErr } = await sb.auth.signUp({
      email: f.email,
      password: f.password,
    })
    if (signupErr) { setErr(signupErr.message); setLoading(false); return }

    const userId = data.user?.id
    if (!userId) { setErr('Something went wrong'); setLoading(false); return }

    // 아바타 업로드
    let avatarUrl = ''
    if (avatarFile) {
      setUploading(true)
      const ext = avatarFile.name.split('.').pop()
      const path = `${userId}/${Date.now()}.${ext}`
      const { error: upErr } = await sb.storage.from('avatars').upload(path, avatarFile, { upsert: true })
      if (!upErr) {
        const { data: pub } = sb.storage.from('avatars').getPublicUrl(path)
        avatarUrl = pub.publicUrl
      }
      setUploading(false)
    }

    // 프로필 업데이트
    const birthYear = f.birth_date ? new Date(f.birth_date).getFullYear() : null
    await sb.from('profiles').update({
      display_name: f.display_name,
      nationality: f.nationality,
      birth_year: birthYear,
      gender: f.gender,
      signup_referral: f.referral_source,
      referral_source: JSON.stringify({ interests, referral: f.referral_source }),
      avatar_url: avatarUrl || null,
    }).eq('id', userId)

    setLoading(false)
    window.location.href = '/events'
  }

  const inputStyle = {
    width: '100%', background: '#F8F8F6', border: '1.5px solid #E8E8E4',
    color: '#0A0A0A', borderRadius: 12, padding: '12px 16px',
    fontFamily: 'Inter, sans-serif', fontSize: 14, outline: 'none',
  }

  const labelStyle = {
    fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' as const,
    color: '#9A9A9A', display: 'block', marginBottom: 6,
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 24, letterSpacing: '-0.04em', color: '#0A0A0A' }}>
            Ko<em style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontWeight: 400, fontSize: 28 }}>jaem</em>con
          </span>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, justifyContent: 'center' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Inter', fontWeight: 700, fontSize: 12,
                background: step >= s ? '#0A0A0A' : '#F8F8F6',
                color: step >= s ? '#fff' : '#9A9A9A',
                border: step >= s ? '1.5px solid #0A0A0A' : '1.5px solid #E8E8E4',
              }}>{s}</div>
              {s < 3 && <div style={{ width: 32, height: 1.5, background: step > s ? '#0A0A0A' : '#E8E8E4' }} />}
            </div>
          ))}
        </div>

        {/* STEP 1: Basic info */}
        {step === 1 && (
          <div>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 28, letterSpacing: '-0.04em', color: '#0A0A0A', marginBottom: 6 }}>Create account</h1>
            <p style={{ fontSize: 14, color: '#6B6B6B', marginBottom: 28 }}>Step 1 of 3 — Basic info</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Display name *</label>
                <input style={inputStyle} placeholder="How others see you" required value={f.display_name} onChange={e => setF({ ...f, display_name: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Email *</label>
                <input style={inputStyle} type="email" placeholder="your@email.com" required value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Password *</label>
                <input style={inputStyle} type="password" placeholder="Min 8 characters" required value={f.password} onChange={e => setF({ ...f, password: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Nationality *</label>
                <select style={inputStyle} required value={f.nationality} onChange={e => setF({ ...f, nationality: e.target.value })}>
                  <option value="">Select your country</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Date of birth *</label>
                  <input style={inputStyle} type="date" required value={f.birth_date} onChange={e => setF({ ...f, birth_date: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Gender</label>
                  <select style={inputStyle} value={f.gender} onChange={e => setF({ ...f, gender: e.target.value })}>
                    <option value="undisclosed">Prefer not to say</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>How did you hear about us? *</label>
                <select style={inputStyle} required value={f.referral_source} onChange={e => setF({ ...f, referral_source: e.target.value })}>
                  <option value="">Select one</option>
                  {REFERRALS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            {err && <p style={{ color: '#dc2626', fontSize: 13, marginTop: 12 }}>{err}</p>}

            <button
              onClick={() => {
                if (!f.display_name || !f.email || !f.password || !f.nationality || !f.birth_date || !f.referral_source) {
                  setErr('Please fill in all required fields')
                  return
                }
                setErr('')
                setStep(2)
              }}
              style={{ width: '100%', background: '#0A0A0A', color: '#fff', border: '1.5px solid #0A0A0A', borderRadius: 100, padding: '14px', fontFamily: 'Inter', fontWeight: 700, fontSize: 14, cursor: 'pointer', marginTop: 24 }}
            >
              Next →
            </button>

            <p style={{ textAlign: 'center', fontSize: 13, color: '#9A9A9A', marginTop: 16 }}>
              Already have an account? <a href="/login" style={{ color: '#0A0A0A', fontWeight: 700 }}>Log in</a>
            </p>
          </div>
        )}

        {/* STEP 2: Profile photo */}
        {step === 2 && (
          <div>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 28, letterSpacing: '-0.04em', color: '#0A0A0A', marginBottom: 6 }}>Profile photo</h1>
            <p style={{ fontSize: 14, color: '#6B6B6B', marginBottom: 32 }}>Step 2 of 3 — Optional but recommended</p>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, marginBottom: 32 }}>
              <div style={{
                width: 120, height: 120, borderRadius: '50%', overflow: 'hidden',
                background: '#F8F8F6', border: '1.5px solid #E8E8E4',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {avatarPreview
                  ? <img src={avatarPreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                  : <span style={{ fontSize: 48, color: '#C4C4C0' }}>👤</span>
                }
              </div>

              <label style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                padding: '10px 24px', borderRadius: 100, fontSize: 13, fontWeight: 600,
                background: '#F8F8F6', color: '#0A0A0A', border: '1.5px solid #E8E8E4',
              }}>
                {avatarPreview ? '📷 Change photo' : '📷 Upload photo'}
                <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
              </label>

              <p style={{ fontSize: 12, color: '#9A9A9A', textAlign: 'center' }}>
                JPG, PNG, WebP. Max 5MB.<br/>You can also add this later in your profile.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, background: '#F8F8F6', color: '#6B6B6B', border: '1.5px solid #E8E8E4', borderRadius: 100, padding: '13px', fontFamily: 'Inter', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>← Back</button>
              <button onClick={() => setStep(3)} style={{ flex: 2, background: '#0A0A0A', color: '#fff', border: '1.5px solid #0A0A0A', borderRadius: 100, padding: '13px', fontFamily: 'Inter', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                {avatarPreview ? 'Next →' : 'Skip for now →'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Interests */}
        {step === 3 && (
          <div>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 28, letterSpacing: '-0.04em', color: '#0A0A0A', marginBottom: 6 }}>Your interests</h1>
            <p style={{ fontSize: 14, color: '#6B6B6B', marginBottom: 28 }}>Step 3 of 3 — Select all that apply. Helps us recommend events for you.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 28, maxHeight: 400, overflowY: 'auto', paddingRight: 4 }}>
              {INTEREST_CATEGORIES.map(cat => (
                <div key={cat.label}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#0A0A0A', marginBottom: 10 }}>{cat.label}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {cat.items.map(item => (
                      <button key={item} type="button" onClick={() => toggleInterest(item)}
                        style={{
                          padding: '6px 12px', borderRadius: 100, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                          background: interests.includes(item) ? '#D4B33A' : '#F8F8F6',
                          color: '#0A0A0A',
                          border: interests.includes(item) ? '1.5px solid #0A0A0A' : '1.5px solid #E8E8E4',
                          transition: 'all 0.15s',
                        }}>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 12, color: '#9A9A9A', marginBottom: 16 }}>{interests.length} selected</p>

            {err && <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 12 }}>{err}</p>}

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStep(2)} style={{ flex: 1, background: '#F8F8F6', color: '#6B6B6B', border: '1.5px solid #E8E8E4', borderRadius: 100, padding: '13px', fontFamily: 'Inter', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>← Back</button>
              <button onClick={submit} disabled={loading || uploading}
                style={{ flex: 2, background: '#0A0A0A', color: '#fff', border: '1.5px solid #0A0A0A', borderRadius: 100, padding: '13px', fontFamily: 'Inter', fontWeight: 700, fontSize: 13, cursor: 'pointer', opacity: (loading || uploading) ? 0.6 : 1 }}>
                {loading ? 'Creating account...' : uploading ? 'Uploading photo...' : interests.length > 0 ? 'Create account →' : 'Skip & create account →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
