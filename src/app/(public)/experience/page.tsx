import ExperienceBanner from '@/components/ExperienceBanner'
import Link from 'next/link'

export default function ExperiencePage() {
  return (
    <div style={{ background: '#F5F5F5', minHeight: '100vh' }}>
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #F0F0F0', padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, fontSize: 20, color: '#1A1A1A', letterSpacing: '-0.04em' }}>
              Experience
            </h1>
            <p style={{ fontSize: 13, color: '#999', marginTop: 2 }}>Experiences for foreigners in Korea</p>
          </div>
          <Link href="/experience/new"
            style={{ background: '#1A1A1A', color: '#E9C000', fontSize: 13, fontWeight: 700, padding: '8px 14px', borderRadius: 8, textDecoration: 'none', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
            + Host
          </Link>
        </div>
      </div>
      <div style={{ background: '#FFFFFF', marginTop: 8 }}>
        <ExperienceBanner showAll />
      </div>
    </div>
  )
}
