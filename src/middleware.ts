import { NextRequest, NextResponse } from 'next/server'

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

const LIMIT = 100        // 요청 수 제한
const WINDOW_MS = 60000  // 1분

export function middleware(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const now = Date.now()

  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return NextResponse.next()
  }

  record.count += 1

  if (record.count > LIMIT) {
    return new NextResponse('Too many requests', {
      status: 429,
      headers: { 'Retry-After': '60' }
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
