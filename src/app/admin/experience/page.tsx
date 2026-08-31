import { supabaseAdmin } from '@/lib/supabase/server'

export default async function ExperienceAdminPage() {
  const admin = supabaseAdmin()
  const { data: applications } = await admin
    .from('experience_applications')
    .select('*, experience_events(title, location)')
    .order('created_at', { ascending: false })

  const { data: events } = await admin
    .from('experience_events')
    .select('id, title, status, capacity, created_at')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, fontSize: 24, color: '#1A1A1A', letterSpacing: '-0.04em', marginBottom: 24 }}>체험단 관리</h1>

      {/* 이벤트 목록 */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontWeight: 700, fontSize: 16, color: '#1A1A1A', marginBottom: 12, fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>등록된 체험단 ({events?.length ?? 0})</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {events?.map(e => (
            <div key={e.id} style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>{e.title}</p>
                <p style={{ fontSize: 12, color: '#9A9A9A', marginTop: 2 }}>모집 {e.capacity}명 · {new Date(e.created_at).toLocaleDateString('ko-KR')}</p>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: e.status === 'published' ? '#DCFCE7' : '#F3F4F6', color: e.status === 'published' ? '#15803D' : '#6B7280' }}>
                {e.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 신청 목록 */}
      <div>
        <h2 style={{ fontWeight: 700, fontSize: 16, color: '#1A1A1A', marginBottom: 12, fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>신청 현황 ({applications?.length ?? 0})</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F7F7F7' }}>
                {['체험단', '실명', '은행', '계좌번호', '전화', '희망날짜', '장소', 'SNS', '동행인', '신청일', '상태'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: '#6B6B6B', fontSize: 11, whiteSpace: 'nowrap', borderBottom: '1px solid #E8E8E8' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {applications?.map(a => (
                <tr key={a.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                  <td style={{ padding: '10px 12px', color: '#1A1A1A', fontWeight: 600, fontSize: 12, whiteSpace: 'nowrap' }}>{(a.experience_events as any)?.title}</td>
                  <td style={{ padding: '10px 12px', color: '#1A1A1A', fontWeight: 600 }}>{a.real_name}</td>
                  <td style={{ padding: '10px 12px', color: '#6B6B6B' }}>{a.bank_name}</td>
                  <td style={{ padding: '10px 12px', color: '#6B6B6B' }}>{a.account_number}</td>
                  <td style={{ padding: '10px 12px', color: '#6B6B6B', whiteSpace: 'nowrap' }}>{a.account_phone}</td>
                  <td style={{ padding: '10px 12px', color: '#6B6B6B', whiteSpace: 'nowrap' }}>{a.preferred_date}</td>
                  <td style={{ padding: '10px 12px', color: '#6B6B6B', maxWidth: 150 }}>{a.preferred_location}</td>
                  <td style={{ padding: '10px 12px', color: '#6B6B6B' }}>{a.sns_accounts || '-'}</td>
                  <td style={{ padding: '10px 12px', color: '#6B6B6B', textAlign: 'center' }}>{a.companions}</td>
                  <td style={{ padding: '10px 12px', color: '#6B6B6B', whiteSpace: 'nowrap' }}>{new Date(a.created_at).toLocaleDateString('ko-KR')}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: a.status === 'approved' ? '#DCFCE7' : a.status === 'rejected' ? '#FEE2E2' : '#FEF9C3', color: a.status === 'approved' ? '#15803D' : a.status === 'rejected' ? '#DC2626' : '#854D0E' }}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!applications || applications.length === 0) && (
            <p style={{ textAlign: 'center', padding: '32px', color: '#9A9A9A', fontSize: 14 }}>신청이 없어요</p>
          )}
        </div>
      </div>
    </div>
  )
}
