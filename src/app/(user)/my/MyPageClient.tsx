'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

const INTEREST_CATEGORIES = [
  {
    label: '🏃 Sports & Fitness',
    items: ['Running', 'Gym', 'Yoga', 'Swimming', 'Cycling', 'Hiking', 'Football', 'Basketball', 'Tennis', 'Martial Arts', 'Climbing', 'Surfing'],
  },
  {
    label: '🎨 Creative & Hobbies',
    items: ['Photography', 'Drawing', 'Painting', 'Music', 'Dancing', 'Writing', 'DIY / Crafts', 'Fashion', 'Film making', 'Pottery', 'Singing'],
  },
  {
    label: '🌱 Lifestyle',
    items: ['Plant parent', 'Cooking', 'Baking', 'Coffee lover', 'Wine & cocktails', 'Reading', 'Meditation', 'Skincare', 'Minimalism', 'Journaling'],
  },
  {
    label: '🌍 Travel & Culture',
    items: ['Backpacking', 'K-Culture', 'Language learning', 'History', 'Museums', 'Street food', 'Architecture', 'Road trips'],
  },
  {
    label: '🎮 Entertainment',
    items: ['Gaming', 'Anime', 'K-drama', 'Movies', 'Live music', 'Festivals', 'Stand-up comedy', 'Podcasts', 'Board games'],
  },
  {
    label: '💼 Professional Interests',
    items: ['Tech', 'Design', 'Marketing', 'Education', 'Finance', 'Healthcare', 'Law', 'Startup culture', 'Freelancing'],
  },
  {
    label: '🌤 Personality & Vibe',
    items: ['Summer person ☀️', 'Winter person ❄️', 'Morning person', 'Night owl', 'Introvert', 'Extrovert', 'Homebody', 'Adventure seeker', 'Foodie', 'Planner', 'Spontaneous'],
  },
]

export default function MyPageClient({ user, tickets, hosted, profile }: {
  user: any; tickets: any[]; hosted: any[]; profile: any
}) {
  const [activeTab, setActiveTab] = useState<'tickets' | 'events' | 'interests'>('tickets')

  // Parse existing interests safely
  const parseInterests = (): string[] => {
    try {
      const raw = profile?.referral_source
      if (!raw) return []
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
      return parsed?.interests ?? []
    } catch {
      return []
    }
  }

  const [interests, setInterests] = useState<string[]>(parseInterests())
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const toggleInterest = (item: string) => {
    setInterests(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    )
  }

  const saveInterests = async () => {
    setSaving(true)
    const sb = supabase()
    const { error } = await sb.from('profiles').update({
      referral_source: JSON.stringify({ interests }),
    }).eq('id', user.id)
    setSaving(false)
    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } else {
      alert('Could not save: ' + error.message)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '100px 24px 80px' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 'clamp(36px,6vw,48px)', letterSpacing: '-0.055em', color: '#0A0A0A', marginBottom: 6 }}>
            My Page
          </h1>
          <p style={{ fontSize: 14, color: '#9A9A9A' }}>
            Welcome back, <strong style={{ color: '#0A0A0A' }}>{profile?.display_name || user.email}</strong>
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 3, marginBottom: 32, background: '#F8F8F6', padding: 4, borderRadius: 12, border: '1.5px solid #E8E8E4', width: 'fit-content', flexWrap: 'wrap' }}>
          {[
            { id: 'tickets', label: `🎫 Tickets (${tickets.length})` },
            { id: 'events', label: `📅 My Events (${hosted.length})` },
            { id: 'interests', label: `✨ Interests (${interests.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none',
                background: activeTab === tab.id ? '#0A0A0A' : 'transparent',
                color: activeTab === tab.id ? '#FFFFFF' : '#6B6B6B',
                transition: 'all 0.15s', whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tickets */}
        {activeTab === 'tickets' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {tickets.length === 0 && (
              <div style={{ textAlign: 'center', padding: '64px 24px' }}>
                <p style={{ fontSize: 40, marginBottom: 16 }}>🎫</p>
                <h3 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 20, color: '#0A0A0A', marginBottom: 8 }}>No tickets yet</h3>
                <p style={{ fontSize: 14, color: '#9A9A9A', marginBottom: 24 }}>Find an event you love and grab a spot.</p>
                <Link href="/events" className="btn-primary" style={{ textDecoration: 'none' }}>Explore events →</Link>
              </div>
            )}
            {tickets.map((t: any) => (
              <div key={t.id} style={{ display: 'flex', gap: 16, background: '#F8F8F6', border: '1.5px solid #E8E8E4', borderRadius: 14, overflow: 'hidden', flexWrap: 'wrap' }}>
                {t.events?.cover_image_url && (
                  <img src={t.events.cover_image_url} style={{ width: 120, height: 120, objectFit: 'cover', flexShrink: 0 }} alt={t.events.title} />
                )}
                <div style={{ padding: '16px 16px 16px 0', flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9A9A9A', marginBottom: 4 }}>
                    {t.events?.category}
                  </div>
                  <h3 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em', color: '#0A0A0A', marginBottom: 6 }}>
                    {t.events?.title}
                  </h3>
                  <p style={{ fontSize: 12, color: '#9A9A9A', marginBottom: 12 }}>
                    {new Date(t.events?.starts_at).toLocaleString()}
                  </p>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className="badge badge-green">✓ {t.status === 'free_confirmed' ? 'Registered' : 'Paid'}</span>
                    <Link href={`/events/${t.events?.slug}`} style={{ fontSize: 12, color: '#6B6B6B', textDecoration: 'underline' }}>View event</Link>
                    <Link href={`/chat/${t.events?.id}`} style={{ fontSize: 12, color: '#FFE500', background: '#0A0A0A', padding: '4px 10px', borderRadius: 100, textDecoration: 'none', fontWeight: 700 }}>
                      Chat →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hosted events */}
        {activeTab === 'events' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
              <p style={{ fontSize: 14, color: '#6B6B6B' }}>Events you&apos;ve created</p>
              <Link href="/host/new" className="btn-primary" style={{ textDecoration: 'none', padding: '9px 18px', fontSize: 13 }}>
                + New event
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
              {hosted.map((e: any) => (
                <div key={e.id} style={{ background: '#F8F8F6', border: '1.5px solid #E8E8E4', borderRadius: 14, overflow: 'hidden' }}>
                  {e.cover_image_url && <img src={e.cover_image_url} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} alt={e.title} />}
                  <div style={{ padding: 16 }}>
                    <span className={`badge ${e.status === 'published' ? 'badge-yellow' : 'badge-outline'}`} style={{ marginBottom: 8, display: 'inline-block' }}>
                      {e.status}
                    </span>
                    <h3 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 15, color: '#0A0A0A', marginBottom: 4 }}>{e.title}</h3>
                  </div>
                </div>
              ))}
              {hosted.length === 0 && (
                <p style={{ fontSize: 14, color: '#9A9A9A' }}>No events yet. Launch your first one!</p>
              )}
            </div>
          </div>
        )}

        {/* Interests */}
        {activeTab === 'interests' && (
          <div>
            <p style={{ fontSize: 14, color: '#6B6B6B', marginBottom: 32, maxWidth: 480 }}>
              Select your interests, hobbies, and personality traits. We&apos;ll use this to recommend events you&apos;ll actually love.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {INTEREST_CATEGORIES.map(cat => (
                <div key={cat.label}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0A0A0A', marginBottom: 12 }}>{cat.label}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {cat.items.map(item => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleInterest(item)}
                        style={{
                          padding: '8px 14px', borderRadius: 100, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                          background: interests.includes(item) ? '#FFE500' : '#F8F8F6',
                          color: '#0A0A0A',
                          border: interests.includes(item) ? '1.5px solid #0A0A0A' : '1.5px solid #E8E8E4',
                          transition: 'all 0.15s',
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              position: 'sticky', bottom: 16, marginTop: 40,
              background: '#fff', border: '1.5px solid #E8E8E4', borderRadius: 16,
              padding: 16, display: 'flex', alignItems: 'center', gap: 12,
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            }}>
              <button
                onClick={saveInterests}
                disabled={saving}
                className="btn-primary"
                style={{ padding: '12px 28px', fontSize: 14 }}
              >
                {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save my interests'}
              </button>
              <span style={{ fontSize: 13, color: '#9A9A9A' }}>
                {interests.length} selected
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
