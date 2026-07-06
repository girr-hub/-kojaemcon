import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: '#12161A', borderTop: '1px solid #2a2f35', marginTop: 80 }}>
      {/* Yellow top bar */}
      <div style={{ height: 4, background: '#E9C000' }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr', gap: 48, marginBottom: 48, flexWrap: 'wrap' }}>
          {/* Logo */}
          <div>
            <div style={{ fontFamily: 'Righteous, sans-serif', fontSize: 28, color: '#E9C000', lineHeight: 1.1, marginBottom: 12 }}>
              KO<br/>GEM<br/>CON
            </div>
            <p style={{ fontSize: 12, color: '#888', lineHeight: 1.6, maxWidth: 180 }}>
              Find your Gems in Korea.<br/>Events, tours & meetups for foreigners.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <a href="https://instagram.com/kojaemcon" target="_blank" rel="noopener noreferrer"
                style={{ width: 36, height: 36, borderRadius: 10, background: '#1e2328', border: '1px solid #2a2f35', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, textDecoration: 'none' }}>
                📸
              </a>
              <a href="https://kojaemcon.vercel.app" target="_blank" rel="noopener noreferrer"
                style={{ width: 36, height: 36, borderRadius: 10, background: '#1e2328', border: '1px solid #2a2f35', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, textDecoration: 'none' }}>
                🔗
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: 16 }}>Navigation</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['Events', '/events'], ['About', '/about'], ['Collab', '/collab'], ['Community', '/community'], ['Talent', '/talent']].map(([l, h]) => (
                <Link key={h} href={h} style={{ fontSize: 14, color: '#B0B0B0', textDecoration: 'none' }} className="hover:text-[#E7E7E7]">{l}</Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: 16 }}>Support</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['Contact Us', '/cs'], ['Refund Policy', '/refund-policy'], ['Host an Event', '/host/new'], ['FAQ', '/cs']].map(([l, h]) => (
                <Link key={l} href={h} style={{ fontSize: 14, color: '#B0B0B0', textDecoration: 'none' }} className="hover:text-[#E7E7E7]">{l}</Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: 16 }}>Legal</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['Refund Policy', '/refund-policy']].map(([l, h]) => (
                <Link key={l} href={h} style={{ fontSize: 14, color: '#B0B0B0', textDecoration: 'none' }} className="hover:text-[#E7E7E7]">{l}</Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #2a2f35', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ fontSize: 12, color: '#888' }}>KOGEMCON by GIRR</p>
            <p style={{ fontSize: 11, color: '#555', marginTop: 2 }}>
              인터넷신문사업자 · 정기간행물 · 제호: eyesmag · 발행인: GIRR · 편집인: GIRR
            </p>
          </div>
          <p style={{ fontSize: 12, color: '#555' }}>© 2026 KOGEMCON. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
