'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

export default function SearchBar({ placeholder = 'Search events...' }: { placeholder?: string }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)
  const timerRef = useRef<any>(null)

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      setLoading(true)
      const { data } = await supabase().from('events')
        .select('id, title, slug, cover_image_url, starts_at, is_free, price_krw, status')
        .in('status', ['published', 'closed'])
        .ilike('title', `%${query}%`)
        .limit(6)
      setResults(data ?? [])
      setLoading(false)
    }, 300)
    return () => clearTimeout(timerRef.current)
  }, [query])

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#F7F7F7', borderRadius: 12, padding: '10px 14px', border: '1.5px solid transparent', transition: 'all 0.15s' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9A9A9A" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input value={query} onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder={placeholder}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontSize: 15, color: '#1A1A1A' }} />
        {query && <button onClick={() => setQuery('')} style={{ background: '#E0E0E0', border: 'none', borderRadius: '50%', width: 18, height: 18, cursor: 'pointer', fontSize: 11, color: '#6B6B6B' }}>×</button>}
      </div>
      {focused && query.trim() && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 9999, background: '#FFFFFF', borderRadius: 14, marginTop: 6, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid #F0F0F0', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '16px', textAlign: 'center', fontSize: 13, color: '#9A9A9A' }}>Searching...</div>
          ) : results.length === 0 ? (
            <div style={{ padding: '20px 16px', textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: '#9A9A9A' }}>No results for "{query}"</p>
            </div>
          ) : results.map(event => (
            <Link key={event.id} href={`/events/${event.slug}`}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', textDecoration: 'none', borderBottom: '1px solid #F5F5F5' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: '#F7F7F7' }}>
                {event.cover_image_url ? <img src={event.cover_image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🎪</div>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 700, fontSize: 14, color: '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.title}</p>
                <p style={{ fontSize: 12, color: '#9A9A9A' }}>{event.is_free ? 'Free' : `₩${Number(event.price_krw).toLocaleString()}`}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
