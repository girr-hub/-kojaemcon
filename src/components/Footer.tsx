import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: '#12161A' }}>
      <div style={{ height: 4, background: '#E9C000' }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 40, marginBottom: 48 }}>

          {/* Logo block */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, color: '#E9C000', lineHeight: 0.85, display: 'flex', flexDirection: 'column', fontSize: 0 }}>
                <span style={{ fontSize: 18 }}>ㅋ</span>
                <span style={{ fontSize: 22, marginLeft: 3 }}>ㅈ</span>
                <span style={{ fontSize: 18 }}>ㅋ</span>
              </div>
              <span style={{ fontFamily: 'Righteous, sans-serif', fontSize: 22, color: '#E9C000', letterSpacing: '0.01em', lineHeight: 1 }}>
                KOGEMCON
              </span>
            </div>
            <p style={{ fontSize: 12, color: '#888', lineHeight: 1.7, maxWidth: 200 }}>
              Find your <span style={{ color: '#E9C000' }}>Gems</span> in Korea.<br />
              Events, tours & meetups<br />for foreigners.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <a href="https://instagram.com/kogemcon" target="_blank" rel="noopener noreferrer"
                style={{ width: 36, height: 36, borderRadius: 10, background: '#1e2328', border: '1px solid #2a2f35', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, textDecoration: 'none' }}>📸</a>
              <a href="https://kogemcon.vercel.app" target="_blank" rel="noopener noreferrer"
                style={{ width: 36, height: 36, borderRadius: 10, background: '#1e2328', border: '1px solid #2a2f35', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, textDecoration: 'none' }}>🔗</a>
            </div>
          </div>

          {/* Nav */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555', marginBottom: 16 }}>Events</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['All Events', '/events'], ['Community', '/community'], ['Host an Event', '/host/new'], ['Talent', '/talent']].map(([l, h]) => (
                <Link key={l} href={h} style={{ fontSize: 13, color: '#B0B0B0', textDecoration: 'none' }} className="hover:text-[#E7E7E7]">{l}</Link>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555', marginBottom: 16 }}>Company</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['About', '/about'], ['Collab', '/collab'], ['Contact', '/cs'], ['Refund Policy', '/refund-policy']].map(([l, h]) => (
                <Link key={l} href={h} style={{ fontSize: 13, color: '#B0B0B0', textDecoration: 'none' }} className="hover:text-[#E7E7E7]">{l}</Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #2a2f35', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>KOGEMCON by GIRR</p>
            <p style={{ fontSize: 11, color: '#3a3a3a', lineHeight: 1.7 }}>
              인터넷신문사업자 · 정기간행물<br />
              제호: eyesmag · 발행인: GIRR · 편집인: GIRR
            </p>
          </div>
          <p style={{ fontSize: 12, color: '#3a3a3a' }}>© 2026 KOGEMCON. All rights reserved.</p>
          <div style={{ marginTop: 16, fontSize: 11, color: '#3a3a3a', lineHeight: 1.8 }}>
            <p style={{ fontWeight: 700, color: '#555', marginBottom: 4 }}>주식회사 기르 (Girr. Inc.)</p>
            <p>대표자: 이미현 · 전화: 010-9616-1894 · 이메일: girr.official@gmail.com</p>
            <p>본점: 서울특별시 동작구 흑석로84 108관 201호</p>
            <p>강남지점: 서울특별시 강남구 테헤란로 114길 20 6층</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
