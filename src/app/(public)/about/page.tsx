export default function AboutPage() {
  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ background: '#12161A', padding: '96px 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Ghost */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, fontSize: 320, color: 'rgba(233,192,0,0.04)', lineHeight: 0.85, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span>ㅋ</span><span>ㅈ</span><span>ㅋ</span>
          </div>
        </div>
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
            <div style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, color: '#E9C000', lineHeight: 0.85, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 56 }}>ㅋ</span>
              <span style={{ fontSize: 68, marginLeft: 8 }}>ㅈ</span>
              <span style={{ fontSize: 56 }}>ㅋ</span>
            </div>
            <div style={{ width: 1, height: 100, background: 'rgba(233,192,0,0.3)' }} />
            <div style={{ fontFamily: 'Righteous, sans-serif', fontSize: 48, color: '#E9C000', lineHeight: 1.05 }}>
              KO<br />GEM<br />CON
            </div>
          </div>
          <h1 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 400, color: '#E7E7E7', marginBottom: 12 }}>
            Find your <span style={{ color: '#E9C000', fontWeight: 700 }}>Gems</span> in Korea
          </h1>
          <p style={{ fontSize: 16, color: '#888' }}>Events, tours & meetups for <strong style={{ color: '#E7E7E7' }}>foreigners</strong> in Korea</p>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: '#E9C000' }} />
      </section>

      {/* Brand meaning */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9A9A9A', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 20, height: 2, background: '#E9C000', display: 'inline-block' }} />
              Brand Story
            </p>
            <h2 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 44px)', color: '#12161A', lineHeight: 1.1, marginBottom: 24 }}>
              What is<br />KOGEMCON?
            </h2>
            <p style={{ fontSize: 15, color: '#6B6B6B', lineHeight: 1.8, marginBottom: 20 }}>
              <strong style={{ color: '#12161A' }}>KOGEMCON</strong>은 한국에서 활동하는 외국인들을 위한 이벤트 플랫폼이에요.
            </p>
            <p style={{ fontSize: 15, color: '#6B6B6B', lineHeight: 1.8 }}>
              <strong style={{ color: '#E9C000' }}>Gem</strong>은 한국에서의 <strong style={{ color: '#12161A' }}>보석같은 시간</strong>을 의미해요. 파티, 투어, 언어교환, 문화 행사까지 — 한국에서의 빛나는 순간들을 함께 만들어가요.
            </p>
          </div>

          {/* KO GEM CON breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {[
              { kr: 'ㅋ', en: 'KO', full: 'Korea', color: '#E9C000', desc: '한국, 그 자체' },
              { kr: 'ㅈ', en: 'GEM', full: 'Gem — 보석같은 시간', color: '#E9C000', desc: '한국에서의 빛나는 순간들' },
              { kr: 'ㅋ', en: 'CON', full: 'Contents', color: '#E9C000', desc: '진짜 경험, 진짜 콘텐츠' },
            ].map(item => (
              <div key={item.en} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '20px 24px', background: '#F5F5F0', borderRadius: 12 }}>
                <span style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, fontSize: 48, color: item.color, lineHeight: 1, width: 52, flexShrink: 0 }}>{item.kr}</span>
                <div>
                  <p style={{ fontFamily: 'Righteous, sans-serif', fontSize: 22, color: '#12161A', marginBottom: 2 }}>{item.en}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#3A3A3A', marginBottom: 2 }}>{item.full}</p>
                  <p style={{ fontSize: 12, color: '#9A9A9A' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we do */}
      <section style={{ background: '#F5F5F0', padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9A9A9A', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 20, height: 2, background: '#E9C000', display: 'inline-block' }} />
            What We Do
          </p>
          <h2 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 'clamp(24px, 3.5vw, 36px)', color: '#12161A', marginBottom: 40 }}>
            Korea&apos;s #1 platform for the international community
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {[
              { icon: '🎉', title: 'PARTY', desc: 'The best nightlife and social events, curated for the international crowd.' },
              { icon: '🗺', title: 'TOUR', desc: 'Explore Korea beyond the tourist spots. Real experiences, real locals.' },
              { icon: '💬', title: 'MEETUP', desc: 'Language exchanges, networking, community gatherings. Make friends here.' },
              { icon: '🎓', title: 'LANGUAGE', desc: '한국어 배우고 싶어? Korean culture & language events for all levels.' },
            ].map(item => (
              <div key={item.title} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 24px', border: '1px solid #E8E8E4' }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{item.icon}</div>
                <h3 style={{ fontFamily: 'Righteous, sans-serif', fontSize: 20, color: '#E9C000', marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: '#6B6B6B', lineHeight: 1.65 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For foreigners */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px' }}>
        <h2 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 'clamp(22px, 3.5vw, 36px)', color: '#12161A', marginBottom: 16 }}>
          For Foreigners,<br />by People Who Get It
        </h2>
        <p style={{ fontSize: 15, color: '#6B6B6B', lineHeight: 1.8, maxWidth: 560, marginBottom: 32 }}>
          Language barriers, not knowing where to look, missing out on amazing things happening right around the corner — KOGEMCON was built to fix that.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 48 }}>
          {['🌍 Events in English (and more)', '📍 Seoul, Busan & beyond', '🤝 30+ nationalities', '🎫 Easy booking, no hassle'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#3A3A3A', padding: '12px 16px', background: '#F5F5F0', borderRadius: 10 }}>
              {item}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ background: '#E9C000', borderRadius: 20, padding: '48px 40px', textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 28, color: '#12161A', marginBottom: 10 }}>
            Got something going on?
          </h3>
          <p style={{ fontSize: 15, color: 'rgba(18,22,26,0.65)', marginBottom: 24 }}>
            Running events for the international community in Korea?<br />List your event on KOGEMCON.
          </p>
          <a href="/host/new" style={{ background: '#12161A', color: '#E9C000', fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontSize: 15, fontWeight: 700, padding: '13px 32px', borderRadius: 100, textDecoration: 'none', display: 'inline-block' }}>
            Launch your event →
          </a>
        </div>
      </section>
    </div>
  )
}
