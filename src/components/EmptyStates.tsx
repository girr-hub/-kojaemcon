import Link from 'next/link'

export function EmptyState({ icon, title, desc, action }: { icon: string; title: string; desc: string; action?: { label: string; href: string } }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', textAlign: 'center' }}>
      <div style={{ width: 80, height: 80, borderRadius: 24, background: '#F7F7F7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 16px' }}>{icon}</div>
      <p style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 17, color: '#1A1A1A', marginBottom: 6 }}>{title}</p>
      <p style={{ fontSize: 14, color: '#9A9A9A', lineHeight: 1.6, marginBottom: 20 }}>{desc}</p>
      {action && (
        <Link href={action.href} style={{ background: '#E9C000', color: '#1A1A1A', padding: '12px 28px', borderRadius: 12, fontWeight: 800, fontSize: 14, textDecoration: 'none', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
          {action.label}
        </Link>
      )}
    </div>
  )
}

export function NoEvents() {
  return <EmptyState icon="🎪" title="No events yet" desc="Be the first to know when something exciting drops!" action={{ label: 'Browse All Events', href: '/events' }} />
}

export function NoTickets() {
  return <EmptyState icon="🎫" title="No tickets yet" desc="Join an event and your tickets will appear here." action={{ label: 'Find Events', href: '/events' }} />
}

export function NoPosts() {
  return <EmptyState icon="💬" title="No posts yet" desc="Be the first to share something with the community!" />
}

export function NoResults({ query }: { query: string }) {
  return <EmptyState icon="🔍" title={`No results for "${query}"`} desc="Try different keywords or browse by category." />
}

export function NoMagazine() {
  return <EmptyState icon="📮" title="Nothing here yet" desc="Check back soon for news and updates!" />
}
