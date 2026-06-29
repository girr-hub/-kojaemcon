export default function RefundPolicyPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '120px 24px 80px' }}>
        {/* Eyebrow */}
        <div className="eyebrow">Policies</div>

        <h1 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 'clamp(40px, 6vw, 64px)', letterSpacing: '-0.055em', lineHeight: 0.88, color: '#0A0A0A', marginBottom: 24 }}>
          Refund{' '}
          <em style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(46px, 7vw, 74px)' }}>
            Policy
          </em>
        </h1>

        <p style={{ fontSize: 15, color: '#6B6B6B', lineHeight: 1.65, marginBottom: 48, maxWidth: 480 }}>
          We believe in fair and transparent refund policies. Please read carefully before registering for any event.
        </p>

        {/* Refund tiers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 48 }}>
          {[
            { label: '7+ days before event', pct: '100%', color: '#15803d', bg: '#dcfce7', border: '#86efac', desc: 'Full refund. No questions asked.' },
            { label: '3–6 days before event', pct: '50%', color: '#92400e', bg: '#fef3c7', border: '#fcd34d', desc: 'Partial refund. Processing fee applies.' },
            { label: '0–2 days before event', pct: '0%', color: '#dc2626', bg: '#fee2e2', border: '#fca5a5', desc: 'No refund. Same-day cancellations are not eligible.' },
            { label: 'No-show', pct: '0%', color: '#dc2626', bg: '#fee2e2', border: '#fca5a5', desc: 'No refund. Account warning issued.' },
          ].map(tier => (
            <div key={tier.label} style={{
              background: tier.bg, border: `1.5px solid ${tier.border}`,
              borderRadius: 12, padding: '20px 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
            }}>
              <div>
                <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 14, color: tier.color, letterSpacing: '-0.01em', marginBottom: 4 }}>
                  {tier.label}
                </div>
                <div style={{ fontSize: 12, color: tier.color, opacity: 0.7 }}>{tier.desc}</div>
              </div>
              <div style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 28, letterSpacing: '-0.04em', color: tier.color, flexShrink: 0 }}>
                {tier.pct}
              </div>
            </div>
          ))}
        </div>

        {/* No-show policy */}
        <div style={{ background: '#0A0A0A', borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <div style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 18, letterSpacing: '-0.03em', color: '#FFE500', marginBottom: 12 }}>
            No-Show Policy
          </div>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.75, marginBottom: 16 }}>
            KOJAEMCON takes no-shows seriously — especially for free events. When you register, you take a spot away from someone else who wanted to attend.
          </p>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'First no-show: Warning issued to your account',
              'Second no-show: 30-day registration suspension',
              'Third no-show: Permanent account ban from free events',
            ].map(item => (
              <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                <span style={{ color: '#FFE500', fontWeight: 800, flexShrink: 0 }}>→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* How to cancel */}
        <div style={{ background: '#F8F8F6', border: '1.5px solid #E8E8E4', borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 20, letterSpacing: '-0.03em', color: '#0A0A0A', marginBottom: 16 }}>
            How to Cancel
          </h2>
          <ol style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              'Go to My Page → My Tickets',
              'Select the event you want to cancel',
              'Click "Cancel Registration" button',
              'Refund will be processed within 3–5 business days',
            ].map((step, i) => (
              <li key={step} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 14, color: '#3A3A3A' }}>
                <span style={{ background: '#FFE500', border: '1.5px solid #0A0A0A', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11, flexShrink: 0 }}>
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Contact */}
        <div style={{ borderTop: '1px solid #E8E8E4', paddingTop: 32 }}>
          <p style={{ fontSize: 14, color: '#6B6B6B', lineHeight: 1.65 }}>
            Questions about your refund? Contact us at{' '}
            <a href="mailto:hello@kojaemcon.com" style={{ color: '#0A0A0A', fontWeight: 700 }}>
              hello@kojaemcon.com
            </a>
            {' '}— we typically respond within 24 hours.
          </p>
        </div>
      </div>
    </div>
  )
}
