import ExperienceBanner from '@/components/ExperienceBanner'
import Link from 'next/link'

export default function ExperiencePage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{
        background: 'rgba(248,248,248,0.94)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        padding: '14px 16px',
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <h1 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--text)', letterSpacing: '-0.05em' }}>
          Experience
        </h1>
        <Link href="/experience/new"
          style={{ background: '#111', color: 'var(--gold)', fontSize: 12, fontWeight: 800, padding: '7px 14px', borderRadius: 8, textDecoration: 'none', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
          + Host
        </Link>
      </div>
      <div style={{ background: '#FFFFFF', marginTop: 8 }}>
        <ExperienceBanner showAll />
      </div>
    </div>
  )
}
