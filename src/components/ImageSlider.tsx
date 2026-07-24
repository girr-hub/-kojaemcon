'use client'
import { useState } from 'react'

export default function ImageSlider({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0)

  if (!images || images.length === 0) return null

  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length)
  const next = () => setCurrent(i => (i + 1) % images.length)

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 1125, margin: '0 auto', userSelect: 'none' }}>
      {/* 메인 이미지 */}
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 12, background: '#F5F5F0' }}>
        <img
          key={current}
          src={images[current]}
          alt={`slide-${current + 1}`}
          style={{
            width: '100%',
            display: 'block',
            objectFit: 'cover',
            animation: 'fadeIn 0.25s ease',
          }}
        />

        {/* 이전/다음 버튼 */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                width: 40, height: 40, borderRadius: '50%',
                background: 'rgba(0,0,0,0.45)', border: 'none',
                color: '#fff', fontSize: 18, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(4px)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.7)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.45)')}
            >
              ‹
            </button>
            <button
              onClick={next}
              style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                width: 40, height: 40, borderRadius: '50%',
                background: 'rgba(0,0,0,0.45)', border: 'none',
                color: '#fff', fontSize: 18, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(4px)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.7)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.45)')}
            >
              ›
            </button>
          </>
        )}

        {/* 이미지 카운터 */}
        {images.length > 1 && (
          <div style={{
            position: 'absolute', bottom: 12, right: 14,
            background: 'rgba(0,0,0,0.5)', color: '#fff',
            fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100,
            backdropFilter: 'blur(4px)',
            fontFamily: 'PretendardVariable, Pretendard, sans-serif',
          }}>
            {current + 1} / {images.length}
          </div>
        )}
      </div>

      {/* 닷 인디케이터 */}
      {images.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 12 }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? 20 : 6,
                height: 6, borderRadius: 3,
                background: i === current ? '#E9C000' : '#D0D0C8',
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'all 0.2s cubic-bezier(0.32, 0.72, 0, 1)',
              }}
            />
          ))}
        </div>
      )}

      {/* 썸네일 스트립 */}
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 12, overflowX: 'auto', paddingBottom: 4 }}>
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                flexShrink: 0, width: 72, height: 72,
                borderRadius: 8, overflow: 'hidden', padding: 0, border: 'none', cursor: 'pointer',
                outline: i === current ? '2.5px solid #E9C000' : '2px solid transparent',
                transition: 'outline 0.15s',
                opacity: i === current ? 1 : 0.6,
              }}
            >
              <img src={url} alt={`thumb-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
