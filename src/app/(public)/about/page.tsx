export default function AboutPage() {
  return (
    <div className="bg-bg text-ink min-h-screen">
      <section className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        <p className="sub-en uppercase text-primary tracking-[0.3em] text-sm mb-4">About</p>
        <h1 className="headline-kr text-7xl md:text-9xl leading-none mb-2">ㅋㅈㅋ</h1>
        <p className="sub-en text-ink/50 tracking-widest text-lg mb-4">KOJAEMCON</p>
        <p className="sub-en text-ink/40 text-base mb-12">Korea Jaemi Contents — pronounced "Ko-jaem-con"</p>
        <div className="max-w-2xl space-y-4">
          <p className="text-xl md:text-2xl font-light leading-relaxed text-ink/90">
            <span className="text-primary font-bold">KOJAEMCON</span> is your go-to platform for finding the best events, experiences, and meetups in Korea — made specifically for foreigners.
          </p>
          <p className="text-lg text-ink/60 leading-relaxed">
            Whether you just landed in Seoul or have been living here for years, we bring you the most exciting things happening around you — all in one place.
          </p>
        </div>
      </section>

      <section className="border-t border-ink/10">
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="headline-en text-5xl md:text-6xl uppercase mb-6">
              KOREA<br/>JAEMI<br/>CONTENTS
            </h2>
            <p className="sub-en text-ink/60 text-lg leading-relaxed mb-4">
              The name says it all. <span className="text-white">Ko</span>rea + <span className="text-white">Jaemi</span> (재미, meaning "fun" in Korean) + <span className="text-white">Con</span>tents.
            </p>
            <p className="sub-en text-ink/60 text-lg leading-relaxed">
              We believe Korea is one of the most exciting places in the world — and we want everyone to experience it fully.
            </p>
          </div>
          <div className="space-y-6">
            {[
              { kr: '코', en: 'KO — Korea', desc: 'Everything happens right here in Korea' },
              { kr: '잼', en: 'JAEMI — Fun (재미)', desc: 'We only do things worth your time' },
              { kr: '컨', en: 'CON — Contents', desc: 'Real experiences, not just content' },
            ].map(item => (
              <div key={item.en} className="flex items-center gap-6 bg-surface p-6">
                <div className="headline-kr text-primary text-5xl w-16 shrink-0">{item.kr}</div>
                <div>
                  <div className="sub-en uppercase tracking-widest text-xs text-ink/50 mb-1">{item.en}</div>
                  <div className="text-lg">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="headline-en text-5xl uppercase mb-4">What We Do</h2>
          <p className="sub-en text-ink/50 mb-12 text-lg">From wild parties to cultural deep-dives — we've got you.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🎉', title: 'PARTY', desc: 'The best nightlife and social events in Korea, curated for the international crowd.' },
              { icon: '🗺', title: 'TOUR', desc: 'Explore Korea beyond the tourist spots. Real experiences, real locals, real fun.' },
              { icon: '💬', title: 'MEETUP', desc: 'Language exchanges, networking events, and community gatherings. Make friends here.' },
            ].map(item => (
              <div key={item.title} className="bg-bg p-8">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="headline-en text-3xl text-primary mb-3">{item.title}</h3>
                <p className="sub-en text-ink/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="headline-en text-4xl md:text-5xl uppercase mb-6">For Foreigners,<br/>By People Who Get It</h2>
        <p className="sub-en text-ink/60 text-lg leading-relaxed max-w-2xl mb-10">
          We know how hard it can be to find your scene in a new country. Language barriers, not knowing where to look, missing out on amazing things happening right around the corner. KOJAEMCON was built to fix that.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mb-16">
          {[
            '🌍 Events in English (and more)',
            '📍 Venues across Seoul & Korea',
            '🤝 Meet people from all over the world',
            '🎫 Easy booking, no hassle',
          ].map(item => (
            <div key={item} className="flex items-center gap-3 sub-en text-ink/70">
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-ink/10 bg-surface">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h2 className="headline-en text-5xl md:text-7xl uppercase mb-6">
            Got something<br/>going on?
          </h2>
          <p className="sub-en text-ink/60 text-lg mb-10 max-w-lg mx-auto">
            Running events for the international community in Korea? List your event on KOJAEMCON and reach thousands of foreigners looking for exactly what you're offering.
          </p>
          <a href="/host/new"
             className="inline-flex items-center gap-3 bg-primary text-bg px-10 py-5 sub-en uppercase font-bold tracking-wider text-lg hover:opacity-90 transition">
            Launch your event →
          </a>
        </div>
      </section>
    </div>
  )
}
