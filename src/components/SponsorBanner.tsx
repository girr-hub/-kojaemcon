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
    <a href={b.link_url} target="_blank" rel="noopener noreferrer"
      style={{ display: 'block', textDecoration: 'none', background: '#FFFFFF', borderBottom: '1px solid #F2F2F2' }}>
      <div style={{ padding: '10px 16px', position: 'relative' }}>
        {b.image_url ? (
          <img src={b.image_url} alt={b.title} style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 8, display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: 80, borderRadius: 8, background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 700, fontSize: 14, color: '#555' }}>{b.title}</span>
          </div>
        )}
        <span style={{ position: 'absolute', top: 16, right: 22, background: 'rgba(0,0,0,0.35)', borderRadius: 4, padding: '2px 6px', fontSize: 10, color: '#fff', fontWeight: 600 }}>AD</span>
        {banners.length > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 8 }}>
            {banners.map((_, i) => (
              <div key={i} style={{ width: i === current ? 14 : 5, height: 5, borderRadius: 3, background: i === current ? '#1A1A1A' : '#DDD', transition: 'all 0.3s' }} />
            ))}
          </div>
        )}
      </div>
    </a>
  )
}
