'use client'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function PageTracker() {
  const pathname = usePathname()
  const startTime = useRef(Date.now())
  const sessionId = useRef(Math.random().toString(36).slice(2))

  useEffect(() => {
    startTime.current = Date.now()

    return () => {
      const duration = Math.round((Date.now() - startTime.current) / 1000)
      if (duration < 2) return // 2초 미만 무시

      fetch('/api/track-visit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ page: pathname, duration_seconds: duration, session_id: sessionId.current }),
        keepalive: true,
      }).catch(() => {})
    }
  }, [pathname])

  return null
}
