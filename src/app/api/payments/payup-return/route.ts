import { NextResponse } from 'next/server'
import { approvePayment } from '../payup-confirm/route'

// 모바일: 인증 완료 후 returnUrl로 POST
export async function POST(req: Request) {
  let transactionId = '', orderNumber = '', amount = ''

  const contentType = req.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    const body = await req.json()
    transactionId = body.transactionId
    orderNumber = body.orderNumber
    amount = body.amount
  } else {
    const text = await req.text()
    const params = new URLSearchParams(text)
    transactionId = params.get('transactionId') || ''
    orderNumber = params.get('orderNumber') || ''
    amount = params.get('amount') || ''
  }

  const result = await approvePayment(transactionId, orderNumber, amount)

  if (result.ok) {
    return NextResponse.redirect(new URL(`/payment-success?order=${orderNumber}`, req.url))
  } else {
    return NextResponse.redirect(new URL(`/payment-fail?error=${encodeURIComponent(result.error || '결제 실패')}`, req.url))
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const transactionId = url.searchParams.get('transactionId') || ''
  const orderNumber = url.searchParams.get('orderNumber') || ''
  const amount = url.searchParams.get('amount') || ''

  const result = await approvePayment(transactionId, orderNumber, amount)

  if (result.ok) {
    return NextResponse.redirect(new URL(`/payment-success?order=${orderNumber}`, req.url))
  } else {
    return NextResponse.redirect(new URL(`/payment-fail?error=${encodeURIComponent(result.error || '결제 실패')}`, req.url))
  }
}
