'use client'
import { useEffect } from 'react'

export default function PixelTracker({ event, params }: { event: string; params?: Record<string, any> }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', event, params ?? {})
    }
  }, [event])
  return null
}
