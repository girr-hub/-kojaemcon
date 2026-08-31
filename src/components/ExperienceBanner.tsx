'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ExperienceBanner() {
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    supabase().from('experience_events')
      .select('id, title, description, images, location')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data, error }) => { console.log('experience:', data, error); setItems(data ?? []) })
  }, [])

  if (items.length === 0) return (
    <div style={{ padding: '24px 16px', textAlign: 'center', color: '#9A9A9A', fontSize: 13 }}>
      No experiences yet
    </div>
  )

  return (
    <div>
      {items.map(e => (
        <Link key={e.id} href={`/experience/${e.id}`} style={{ textDecoration: 'none', display: 'block', borderBottom: '1px solid #F2F2F2' }}>
          <div style={{ padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            {e.images?.[0] ? (
              <img src={e.images[0]} alt={e.title} style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
            ) : (
              <div style={{ width: 80, height: 80, borderRadius: 8, background: '#F0F0F0', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🌟</div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 4, letterSpacing: '-0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title}</h3>
              <p style={{ fontSize: 12, color: '#999', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any, lineHeight: 1.5 }}>{e.description}</p>
              {e.location && <p style={{ fontSize: 12, color: '#BBB', marginTop: 4 }}>📍 {e.location}</p>}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
