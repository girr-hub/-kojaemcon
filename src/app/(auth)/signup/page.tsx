'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const REFERRALS = ['Instagram','TikTok','Google','Friend','Reddit','Other']

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Argentina','Armenia','Australia',
  'Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Belarus','Belgium','Belize',
  'Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei',
  'Bulgaria','Burkina Faso','Burundi','Cambodia','Cameroon','Canada','Cape Verde',
  'Central African Republic','Chad','Chile','China','Colombia','Comoros','Congo',
  'Costa Rica','Croatia','Cuba','Cyprus','Czech Republic','Denmark','Djibouti',
  'Dominican Republic','Ecuador','Egypt','El Salvador','Eritrea','Estonia','Eswatini',
  'Ethiopia','Fiji','Finland','France','Gabon','Gambia','Georgia','Germany','Ghana',
  'Greece','Guatemala','Guinea','Haiti','Honduras','Hungary','Iceland','India',
  'Indonesia','Iran','Iraq','Ireland','Israel','Italy','Jamaica','Japan','Jordan',
  'Kazakhstan','Kenya','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Liberia',
  'Libya','Lithuania','Luxembourg','Madagascar','Malawi','Malaysia','Maldives','Mali',
  'Malta','Mauritania','Mauritius','Mexico','Moldova','Monaco','Mongolia','Montenegro',
  'Morocco','Mozambique','Myanmar','Namibia','Nepal','Netherlands','New Zealand',
  'Nicaragua','Niger','Nigeria','North Korea','North Macedonia','Norway','Oman',
  'Pakistan','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland',
  'Portugal','Qatar','Romania','Russia','Rwanda','Saudi Arabia','Senegal','Serbia',
  'Sierra Leone','Singapore','Slovakia','Slovenia','Somalia','South Africa','South Korea',
  'South Sudan','Spain','Sri Lanka','Sudan','Sweden','Switzerland','Syria','Taiwan',
  'Tajikistan','Tanzania','Thailand','Togo','Trinidad and Tobago','Tunisia','Turkey',
  'Turkmenistan','Uganda','Ukraine','United Arab Emirates','United Kingdom',
  'United States','Uruguay','Uzbekistan','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe',
  'Other'
]

export default function SignUp() {
  const r = useRouter()
  const [f, setF] = useState({
    email:'', password:'', display_name:'',
    nationality:'', birth_date:'', referral_source:'', gender:'undisclosed'
  })
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    const sb = supabase()
    const { data, error } = await sb.auth.signUp({
      email: f.email, password: f.password,
      options: { emailRedirectTo: `${location.origin}/auth/callback` }
    })
    if (error) { setErr(error.message); setLoading(false); return }
    if (data.user) {
      await sb.from('profiles').insert({
        id: data.user.id, email: f.email,
        display_name: f.display_name, nationality: f.nationality,
        gender: f.gender, birth_date: f.birth_date,
        referral_source: f.referral_source,
      })
      r.push('/my')
    }
    setLoading(false)
  }

  const input = "w-full bg-surface border border-ink/10 text-ink px-4 py-3 focus:border-primary outline-none sub-en"

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6 py-20">
      <form onSubmit={submit} className="w-full max-w-md space-y-4">
        <h1 className="headline-en text-5xl text-ink uppercase mb-8">Join KOJAEMCON</h1>

        <div>
          <label className="sub-en text-xs text-ink/50 uppercase tracking-wider mb-1 block">Display name *</label>
          <input className={input} placeholder="What should we call you?" required
                 onChange={e=>setF({...f, display_name:e.target.value})}/>
        </div>

        <div>
          <label className="sub-en text-xs text-ink/50 uppercase tracking-wider mb-1 block">Email *</label>
          <input className={input} type="email" placeholder="your@email.com" required
                 onChange={e=>setF({...f, email:e.target.value})}/>
        </div>

        <div>
          <label className="sub-en text-xs text-ink/50 uppercase tracking-wider mb-1 block">Password *</label>
          <input className={input} type="password" placeholder="At least 8 characters" required minLength={8}
                 onChange={e=>setF({...f, password:e.target.value})}/>
        </div>

        <div>
          <label className="sub-en text-xs text-ink/50 uppercase tracking-wider mb-1 block">Nationality *</label>
          <select className={input} required onChange={e=>setF({...f, nationality:e.target.value})}>
            <option value="">Select your country</option>
            {COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="sub-en text-xs text-ink/50 uppercase tracking-wider mb-1 block">Date of birth *</label>
          <input className={input} type="date" required
                 onChange={e=>setF({...f, birth_date:e.target.value})}/>
        </div>

        <div>
          <label className="sub-en text-xs text-ink/50 uppercase tracking-wider mb-1 block">Gender</label>
          <select className={input} onChange={e=>setF({...f, gender:e.target.value})}>
            <option value="undisclosed">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="sub-en text-xs text-ink/50 uppercase tracking-wider mb-1 block">How did you hear about us? *</label>
          <select className={input} required onChange={e=>setF({...f, referral_source:e.target.value})}>
            <option value="">Select one</option>
            {REFERRALS.map(r=><option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {err && <div className="text-red-400 sub-en text-sm">{err}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-bg py-4 sub-en uppercase font-bold tracking-wider hover:opacity-90 transition disabled:opacity-50">
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        <p className="text-center text-ink/40 sub-en text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-primary hover:underline">Log in</a>
        </p>
      </form>
    </div>
  )
}
