'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function SponsorBanner({ position = 'home' }: { position?: string }) {
  const [banners, setBanners] = useState<any[]>([])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    supabase().from('sponsor_banners')
      .select('*')
      .eq('is_active', true)
      .eq('position', position)
      .order('sort_order')
      .then(({ data }) => setBanners(data ?? []))
  }, [position])

  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(() => setCurrent(i => (i + 1) % banners.length), 4000)
    return () => clearInterval(timer)
  }, [banners])

  if (banners.length === 0) return null

  const b = banners[current]

  return (
    <div style={{ background: '#FFFFFF', borderTop: '1px solid #F0F0F0', borderBottom: '1px solid #F0F0F0' }}>
      {/* AD 라벨 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 16px 0' }}>
        <span style={{ fontSize: 10, color: '#BBB', fontWeight: 600, letterSpacing: '0.08em', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>AD</span>
        {banners.length > 1 && (
          <div style={{ display: 'flex', gap: 3 }}>
            {banners.map((_, i) => (
              <div key={i} onClick={() => setCurrent(i)}
                style={{ width: i === current ? 12 : 4, height: 4, borderRadius: 2, background: i === current ? '#1A1A1A' : '#DDD', transition: 'all 0.3s', cursor: 'pointer' }} />
            ))}
          </div>
        )}
      </div>

      <a href={b.link_url} target="_blank" rel="noopener noreferrer"
        style={{ display: 'block', textDecoration: 'none', padding: '8px 16px 12px' }}>
        {b.image_url ? (
          <img src={b.image_url} alt={b.title}
            style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 8, display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: 80, borderRadius: 8, background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 700, fontSize: 14, color: '#333' }}>{b.title}</span>
            <span style={{ fontSize: 11, color: '#999' }}>→</span>
          </div>
        )}
      </a>
    </div>
  )
}
