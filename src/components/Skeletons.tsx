export function EventCardSkeleton() {
  return (
    <div style={{ background: '#FFFFFF', padding: '14px 16px', display: 'flex', gap: 12, borderBottom: '1px solid #F5F5F5' }}>
      <div className="skeleton" style={{ width: 96, height: 96, borderRadius: 12, flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="skeleton" style={{ width: 60, height: 18, borderRadius: 6 }} />
        <div className="skeleton" style={{ width: '85%', height: 20, borderRadius: 4 }} />
        <div className="skeleton" style={{ width: '60%', height: 14, borderRadius: 4 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <div className="skeleton" style={{ width: 60, height: 16, borderRadius: 4 }} />
          <div className="skeleton" style={{ width: 50, height: 24, borderRadius: 8 }} />
        </div>
      </div>
    </div>
  )
}

export function EventListSkeleton() {
  return <div>{[1,2,3,4,5].map(i => <EventCardSkeleton key={i} />)}</div>
}

export function PostSkeleton() {
  return (
    <div style={{ background: '#FFFFFF', padding: '16px', borderBottom: '1px solid #F5F5F5' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div className="skeleton" style={{ width: 32, height: 32, borderRadius: '50%' }} />
        <div className="skeleton" style={{ width: 80, height: 14, borderRadius: 4 }} />
      </div>
      <div className="skeleton" style={{ width: '75%', height: 18, borderRadius: 4, marginBottom: 8 }} />
      <div className="skeleton" style={{ width: '100%', height: 13, borderRadius: 4, marginBottom: 4 }} />
      <div className="skeleton" style={{ width: '80%', height: 13, borderRadius: 4 }} />
    </div>
  )
}

export function PostListSkeleton() {
  return <div>{[1,2,3].map(i => <PostSkeleton key={i} />)}</div>
}
