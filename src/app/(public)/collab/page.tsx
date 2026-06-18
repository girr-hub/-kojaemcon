export default function CollabPage() {
  return (
    <div className="bg-bg text-ink min-h-screen">
      {/* 히어로 */}
      <section className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        <p className="sub-en uppercase text-primary tracking-[0.3em] text-sm mb-4">Partnership</p>
        <h1 className="headline-en text-7xl md:text-9xl leading-none mb-6">LET'S WORK<br/>TOGETHER</h1>
        <p className="sub-en text-ink/60 text-xl max-w-2xl leading-relaxed">
          KOJAEMCON is Korea&apos;s go-to platform for the international community. 
          We&apos;re open to all kinds of collaborations — from event hosting to brand partnerships.
        </p>
      </section>

      {/* 협업 유형 */}
      <section className="border-t border-ink/10">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="headline-en text-5xl uppercase mb-12">How We Can Work Together</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: '🎪',
                title: 'Event Hosting & Co-hosting',
                desc: 'Planning an event for foreigners in Korea? Partner with us to reach thousands of potential attendees. We handle promotion, ticketing, and community outreach.',
                items: ['Event listing & promotion', 'Ticket sales management', 'Community reach 5,000+', 'Social media coverage'],
              },
              {
                icon: '💼',
                title: 'Sponsorship & Advertising',
                desc: "Want to reach Korea&apos;s international community? KOJAEMCON connects your brand with foreigners living in Korea — a highly engaged, spending demographic.",
                items: ['Banner & logo placement', 'Sponsored event packages', 'Newsletter features', 'Social media mentions'],
              },
              {
                icon: '📱',
                title: 'Media & Influencer Collaboration',
                desc: 'Are you a content creator, YouTuber, or media outlet covering life in Korea? Let&apos;s create content together and share our audiences.',
                items: ['Content collaboration', 'Event coverage', 'Cross-promotion', 'Interview features'],
              },
              {
                icon: '🤝',
                title: 'Business Partnership',
                desc: 'Restaurants, bars, tour companies, language schools — if your business serves the foreign community in Korea, let&apos;s build something together.',
                items: ['Venue partnerships', 'Service promotions', 'Package deals', 'Referral programs'],
              },
            ].map(item => (
              <div key={item.title} className="bg-surface p-8">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="headline-en text-2xl text-primary uppercase mb-3">{item.title}</h3>
                <p className="sub-en text-ink/60 leading-relaxed mb-6">{item.desc}</p>
                <ul className="space-y-2">
                  {item.items.map(i => (
                    <li key={i} className="flex items-center gap-2 sub-en text-sm text-ink/70">
                      <span className="text-primary">→</span> {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 통계 */}
      <section className="bg-surface">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="headline-en text-4xl uppercase mb-12 text-center">Why Partner With Us</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { num: '5,000+', label: 'Community Members' },
              { num: '50+', label: 'Events Hosted' },
              { num: '30+', label: 'Nationalities' },
              { num: '90%', label: 'Repeat Attendees' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="headline-en text-5xl text-primary mb-2">{stat.num}</div>
                <div className="sub-en text-ink/50 uppercase text-xs tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 연락처 폼 */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="headline-en text-5xl uppercase mb-4">Get In Touch</h2>
        <p className="sub-en text-ink/50 mb-10 text-lg">
          Tell us about your idea and we'll get back to you within 48 hours.
        </p>
        <form action="mailto:hello@kojaemcon.com" method="POST" encType="text/plain" className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="sub-en uppercase text-xs text-ink/50 tracking-wider mb-2 block">Your name *</label>
              <input name="name" required
                     className="w-full bg-surface border border-ink/10 text-ink px-4 py-3 outline-none focus:border-primary sub-en"
                     placeholder="John Doe"/>
            </div>
            <div>
              <label className="sub-en uppercase text-xs text-ink/50 tracking-wider mb-2 block">Email *</label>
              <input name="email" type="email" required
                     className="w-full bg-surface border border-ink/10 text-ink px-4 py-3 outline-none focus:border-primary sub-en"
                     placeholder="hello@company.com"/>
            </div>
          </div>
          <div>
            <label className="sub-en uppercase text-xs text-ink/50 tracking-wider mb-2 block">Company / Organization</label>
            <input name="company"
                   className="w-full bg-surface border border-ink/10 text-ink px-4 py-3 outline-none focus:border-primary sub-en"
                   placeholder="Your company name"/>
          </div>
          <div>
            <label className="sub-en uppercase text-xs text-ink/50 tracking-wider mb-2 block">Type of collaboration *</label>
            <select name="type" required
                    className="w-full bg-surface border border-ink/10 text-ink px-4 py-3 outline-none focus:border-primary sub-en">
              <option value="">Select one</option>
              <option value="event">Event Hosting / Co-hosting</option>
              <option value="sponsor">Sponsorship / Advertising</option>
              <option value="media">Media / Influencer</option>
              <option value="business">Business Partnership</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="sub-en uppercase text-xs text-ink/50 tracking-wider mb-2 block">Tell us about your idea *</label>
            <textarea name="message" required rows={6}
                      className="w-full bg-surface border border-ink/10 text-ink px-4 py-3 outline-none focus:border-primary sub-en resize-none"
                      placeholder="Describe your collaboration idea, goals, and timeline..."/>
          </div>
          <button type="submit"
                  className="w-full bg-primary text-bg py-4 sub-en uppercase font-bold tracking-wider hover:opacity-90 transition">
            Send proposal →
          </button>
          <p className="text-center text-ink/30 sub-en text-xs">
            Or email us directly at <span className="text-primary">hello@kojaemcon.com</span>
          </p>
        </form>
      </section>
    </div>
  )
}
