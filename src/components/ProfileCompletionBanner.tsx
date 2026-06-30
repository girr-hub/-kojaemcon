'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say']

export default function ProfileCompletionBanner({ user, profile, onComplete }: {
  user: any; profile: any; onComplete: () => void
}) {
  const [gender, setGender] = useState(profile?.gender ?? '')
  const [birthYear, setBirthYear] = useState(profile?.birth_year?.toString() ?? '')
  const [saving, setSaving] = useState(false)

  // 이미 입력되어 있으면 표시 안 함
  if (profile?.gender && profile?.birth_year) return null

  const save = async () => {
    if (!gender || !birthYear) { alert('Please fill in both fields'); return }
    setSaving(true)
    const sb = supabase()
    const { error } = await sb.from('profiles').update({
      gender,
      birth_year: parseInt(birthYear),
    }).eq('id', user.id)
    setSaving(false)
    if (!error) onComplete()
    else alert('Could not save: ' + error.message)
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 80 }, (_, i) => currentYear - 15 - i)

  return (
    <div style={{
      background: '#F8F8F6', border: '1.5px solid #D4B33A', borderRadius: 14,
      padding: 20, marginBottom: 28,
    }}>
      <p style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 14, color: '#0A0A0A', marginBottom: 4 }}>
        Complete your profile
      </p>
      <p style={{ fontSize: 12, color: '#6B6B6B', marginBottom: 16 }}>
        Help us recommend better events for you. This info stays private.
      </p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <select
          className="input-base"
          style={{ width: 'auto', minWidth: 140 }}
          value={gender}
          onChange={e => setGender(e.target.value)}
        >
          <option value="">Gender</option>
          {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <select
          className="input-base"
          style={{ width: 'auto', minWidth: 120 }}
          value={birthYear}
          onChange={e => setBirthYear(e.target.value)}
        >
          <option value="">Birth year</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <button onClick={save} disabled={saving} className="btn-primary" style={{ padding: '10px 20px', fontSize: 13 }}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}
