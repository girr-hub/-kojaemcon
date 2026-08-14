'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

const CANCEL_REASONS = [
  'Schedule conflict',
  'Found another event',
  'Changed my mind',
  'Health / personal reasons',
  'Weather concerns',
  'Other',
]

const TABS = [
  { id: 'tickets', label: 'My Tickets', emoji: '🎫' },
  { id: 'profile', label: 'Profile', emoji: '👤' },
  { id: 'events', label: 'Hosted', emoji: '🎪' },
]

export default function MyPageClient({ user, tickets, hosted, profile }: {
  user: any; tickets: any[]; hosted: any[]; profile: any
}) {
  const [activeTab, setActiveTab] = useState<'tickets' | 'profile' | 'events'>('tickets')
  const [ticketList, setTicketList] = useState(tickets)
  const [cancelTarget, setCancelTarget] = useState<any>(null)
  const [cancelReason, setCancelReason] = useState('')
  const [customReason, setCustomReason] = useState('')
  const [cancelling, setCancelling] = useState(false)
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '')
  const [bio, setBio] = useState(profile?.bio ?? '')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? '')
  const [uploading, setUploading] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savedProfile, setSavedProfile] = useState(false)

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const sb = supabase()
    const ext = file.name.split('.').pop()
    const path = `${user.id}/${Date.now()}.${ext}`
    const { error: upErr } = await sb.storage.from('avatars').upload(path, file, { upsert: true })
    if (upErr) { alert(upErr.message); setUploading(false); return }
    const { data: pub } = sb.storage.from('avatars').getPublicUrl(path)
    setAvatarUrl(pub.publicUrl)
    setUploading(false)
  }

  const saveProfile = async () => {
    setSavingProfile(true)
    const sb = supabase()
    const { error } = await sb.from('profiles').update({ display_name: displayName, bio, avatar_url: avatarUrl }).eq('id', user.id)
    setSavingProfile(false)
    if (!error) { setSavedProfile(true); setTimeout(() => setSavedProfile(false), 2500) }
    else alert('Could not save: ' + error.message)
  }

  const submitCancel = async () => {
    if (!cancelTarget) return
    const reason = cancelReason === 'Other' ? customReason : cancelReason
    setCancelling(true)
    const res = await fetch('/api/orders/cancel', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ order_id: cancelTarget.id, reason }),
    }).then(r => r.json())
    setCancelling(false)
    if (res.ok) {
      setTicketList(prev => prev.filter(t => t.id !== cancelTarget.id))
      setCancelTarget(null); setCancelReason(''); setCustomReason('')
    } else alert(res.error || 'Could not cancel')
  }

  const activeTickets = ticketList.filter(t => t.status !== 'cancelled')
  const cancelledTickets = ticketList.filter(t => t.status === 'cancelled')

  return (
    <div style={{ background: '#F7F7F7', minHeight: '100vh' }}>

      {/* 프로필 헤더 */}
      <div style={{ background: '#FFFFFF', padding: '20px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#E9C000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#1A1A1A' }}>
                {(profile?.display_name || user?.email || '?')[0].toUpperCase()}
              </div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 17, color: '#1A1A1A', letterSpacing: '-0.03em' }}>
              {profile?.display_name || 'My Page'}
            </p>
            <p style={{ fontSize: 13, color: '#9A9A9A', marginTop: 2 }}>{user?.email}</p>
          </div>
          <button onClick={() => setActiveTab('profile')}
            style={{ padding: '7px 14px', borderRadius: 8, background: '#F7F7F7', border: '1px solid #E8E8E4', fontSize: 13, fontWeight: 600, color: '#1A1A1A', cursor: 'pointer', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
            Edit
          </button>
        </div>

        {/* 탭 */}
        <div style={{ display: 'flex', borderBottom: '1px solid #F0F0F0' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              style={{ flex: 1, padding: '12px 0', fontSize: 13, fontWeight: activeTab === tab.id ? 800 : 500, color: activeTab === tab.id ? '#1A1A1A' : '#9A9A9A', background: 'none', border: 'none', cursor: 'pointer', borderBottom: activeTab === tab.id ? '2px solid #E9C000' : '2px solid transparent', fontFamily: 'PretendardVariable, Pretendard, sans-serif', transition: 'all 0.15s' }}>
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div style={{ padding: '16px 16px 100px' }}>

        {/* 티켓 탭 */}
        {activeTab === 'tickets' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activeTickets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎫</div>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 6 }}>No tickets yet</p>
                <p style={{ fontSize: 14, color: '#9A9A9A', marginBottom: 20 }}>Join an event and your tickets will appear here.</p>
                <Link href="/events" style={{ background: '#E9C000', color: '#1A1A1A', padding: '12px 24px', borderRadius: 10, fontWeight: 800, fontSize: 14, textDecoration: 'none', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>Find Events →</Link>
              </div>
            ) : (
              activeTickets.map(ticket => (
                <div key={ticket.id} style={{ background: '#FFFFFF', borderRadius: 14, overflow: 'hidden', border: '1px solid #F0F0F0' }}>
                  {ticket.events?.cover_image_url && (
                    <img src={ticket.events.cover_image_url} alt="" style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                  )}
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <h3 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 15, color: '#1A1A1A', letterSpacing: '-0.03em', flex: 1, marginRight: 8 }}>
                        {ticket.events?.title}
                      </h3>
                      <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: ticket.status === 'paid' ? '#DCFCE7' : '#DBEAFE', color: ticket.status === 'paid' ? '#15803D' : '#1D4ED8', flexShrink: 0 }}>
                        {ticket.status === 'paid' ? 'Paid' : 'Free'}
                      </span>
                    </div>
                    {ticket.events?.starts_at && (
                      <p style={{ fontSize: 13, color: '#6B6B6B', marginBottom: 4 }}>
                        📅 {new Date(ticket.events.starts_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' })}
                      </p>
                    )}
                    {ticket.events?.venue_name && (
                      <p style={{ fontSize: 13, color: '#6B6B6B', marginBottom: 12 }}>📍 {ticket.events.venue_name}</p>
                    )}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link href={`/events/${ticket.events?.slug}`}
                        style={{ flex: 1, display: 'block', textAlign: 'center', padding: '10px', borderRadius: 10, background: '#F7F7F7', color: '#1A1A1A', fontWeight: 700, fontSize: 13, textDecoration: 'none', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
                        View Event
                      </Link>
                      <button onClick={() => setCancelTarget(ticket)}
                        style={{ padding: '10px 16px', borderRadius: 10, background: '#FFF0F0', color: '#DC2626', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* 취소된 티켓 */}
            {cancelledTickets.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#9A9A9A', marginBottom: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Cancelled</p>
                {cancelledTickets.map(ticket => (
                  <div key={ticket.id} style={{ background: '#FFFFFF', borderRadius: 14, padding: '14px 16px', border: '1px solid #F0F0F0', opacity: 0.6, marginBottom: 10 }}>
                    <p style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 700, fontSize: 14, color: '#6B6B6B' }}>{ticket.events?.title}</p>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#DC2626', background: '#FEE2E2', padding: '2px 8px', borderRadius: 4 }}>Cancelled</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 프로필 탭 */}
        {activeTab === 'profile' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* 아바타 */}
            <div style={{ background: '#FFFFFF', borderRadius: 14, padding: '20px 16px', border: '1px solid #F0F0F0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ position: 'relative' }}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#E9C000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, color: '#1A1A1A' }}>
                    {(profile?.display_name || '?')[0].toUpperCase()}
                  </div>
                )}
              </div>
              <label style={{ padding: '8px 20px', borderRadius: 8, background: '#F7F7F7', border: '1px solid #E8E8E4', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#1A1A1A', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
                {uploading ? 'Uploading...' : 'Change Photo'}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
              </label>
            </div>

            {/* 정보 입력 */}
            <div style={{ background: '#FFFFFF', borderRadius: 14, padding: '16px', border: '1px solid #F0F0F0', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#9A9A9A', display: 'block', marginBottom: 6 }}>Display Name</label>
                <input value={displayName} onChange={e => setDisplayName(e.target.value)}
                  className="input-base" placeholder="How others see you" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#9A9A9A', display: 'block', marginBottom: 6 }}>Bio</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)}
                  className="input-base" rows={3} style={{ resize: 'none' }} placeholder="Tell us about yourself..." />
              </div>
              <div style={{ paddingTop: 4, borderTop: '1px solid #F0F0F0' }}>
                <p style={{ fontSize: 12, color: '#9A9A9A', marginBottom: 2 }}>Email</p>
                <p style={{ fontSize: 14, color: '#1A1A1A', fontWeight: 600 }}>{user?.email}</p>
              </div>
              <div style={{ paddingTop: 4, borderTop: '1px solid #F0F0F0' }}>
                <p style={{ fontSize: 12, color: '#9A9A9A', marginBottom: 2 }}>Nationality</p>
                <p style={{ fontSize: 14, color: '#1A1A1A', fontWeight: 600 }}>{profile?.nationality || '-'}</p>
              </div>
              <button onClick={saveProfile} disabled={savingProfile}
                style={{ width: '100%', padding: '13px', borderRadius: 12, background: '#E9C000', color: '#1A1A1A', border: 'none', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
                {savedProfile ? 'Saved! ✓' : savingProfile ? 'Saving...' : 'Save Profile'}
              </button>
            </div>

            {/* 로그아웃 */}
            <div style={{ background: '#FFFFFF', borderRadius: 14, border: '1px solid #F0F0F0', overflow: 'hidden' }}>
              <button onClick={async () => { await supabase().auth.signOut(); window.location.href = '/' }}
                style={{ width: '100%', padding: '16px', background: 'none', border: 'none', color: '#DC2626', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'PretendardVariable, Pretendard, sans-serif', textAlign: 'left' }}>
                Log out
              </button>
            </div>
          </div>
        )}

        {/* 호스팅 탭 */}
        {activeTab === 'events' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {hosted?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎪</div>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 6 }}>No events hosted yet</p>
                <p style={{ fontSize: 14, color: '#9A9A9A', marginBottom: 20 }}>Share your passion with the community!</p>
                <Link href="/host/new" style={{ background: '#E9C000', color: '#1A1A1A', padding: '12px 24px', borderRadius: 10, fontWeight: 800, fontSize: 14, textDecoration: 'none', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>Host an Event →</Link>
              </div>
            ) : (
              hosted?.map((event: any) => (
                <div key={event.id} style={{ background: '#FFFFFF', borderRadius: 14, padding: '14px 16px', border: '1px solid #F0F0F0' }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {event.cover_image_url && (
                      <img src={event.cover_image_url} alt="" style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 4 }}>{event.title}</p>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                        background: event.status === 'published' ? '#DCFCE7' : event.status === 'closed' ? '#F3F4F6' : '#FEF9C3',
                        color: event.status === 'published' ? '#15803D' : event.status === 'closed' ? '#6B7280' : '#854D0E' }}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* 취소 모달 */}
      {cancelTarget && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={() => setCancelTarget(null)} />
          <div style={{ position: 'relative', background: '#fff', borderRadius: '20px 20px 0 0', padding: '24px 20px 40px', width: '100%', maxWidth: 430, zIndex: 10 }} className="sheet-enter">
            <div style={{ width: 36, height: 4, borderRadius: 2, background: '#E0E0E0', margin: '0 auto 20px' }} />
            <h3 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 18, color: '#1A1A1A', marginBottom: 6 }}>Cancel Ticket</h3>
            <p style={{ fontSize: 14, color: '#6B6B6B', marginBottom: 16 }}>{cancelTarget.events?.title}</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', marginBottom: 10 }}>Why are you cancelling?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {CANCEL_REASONS.map(r => (
                <button key={r} type="button" onClick={() => setCancelReason(r)}
                  style={{ padding: '12px 14px', borderRadius: 10, border: `1.5px solid ${cancelReason === r ? '#1A1A1A' : '#F0F0F0'}`, background: cancelReason === r ? '#1A1A1A' : '#FFFFFF', color: cancelReason === r ? '#fff' : '#1A1A1A', fontSize: 14, fontWeight: 600, cursor: 'pointer', textAlign: 'left', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
                  {r}
                </button>
              ))}
            </div>
            {cancelReason === 'Other' && (
              <textarea className="input-base" placeholder="Tell us more (optional)" rows={3}
                style={{ resize: 'none', marginBottom: 16 }} value={customReason} onChange={e => setCustomReason(e.target.value)} />
            )}
            <div style={{ background: '#FFFBEA', borderRadius: 10, padding: '12px 14px', marginBottom: 20, border: '1px solid #F5E87C' }}>
              <p style={{ fontSize: 12, color: '#7A6100', lineHeight: 1.6 }}>
                Refunds: 100% (7+ days before), 50% (3–6 days), 0% (0–2 days or no-show)
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setCancelTarget(null); setCancelReason(''); setCustomReason('') }}
                style={{ flex: 1, padding: '13px', borderRadius: 12, border: '1.5px solid #E0E0E0', background: '#fff', color: '#1A1A1A', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
                Keep ticket
              </button>
              <button onClick={submitCancel} disabled={cancelling || !cancelReason}
                style={{ flex: 1, padding: '13px', borderRadius: 12, background: '#DC2626', color: '#fff', border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer', opacity: (cancelling || !cancelReason) ? 0.5 : 1, fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
                {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
