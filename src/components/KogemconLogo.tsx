// KOGEMCON Logo Component
// Usage: <KogemconLogo size="sm" | "md" | "lg" | "xl" theme="dark" | "light" | "yellow" />

type LogoSize = 'sm' | 'md' | 'lg' | 'xl'
type LogoTheme = 'dark' | 'light' | 'yellow'

const SIZES = {
  sm: { symbol: 32, text: 11, gap: 8 },
  md: { symbol: 48, text: 14, gap: 10 },
  lg: { symbol: 64, text: 18, gap: 12 },
  xl: { symbol: 96, text: 26, gap: 16 },
}

export default function KogemconLogo({
  size = 'md',
  theme = 'dark',
  showSlogan = false,
  className = '',
}: {
  size?: LogoSize
  theme?: LogoTheme
  showSlogan?: boolean
  className?: string
}) {
  const s = SIZES[size]

  const symbolColor = theme === 'yellow' ? '#12161A' : '#E9C000'
  const textColor = theme === 'light' ? '#12161A' : theme === 'yellow' ? '#12161A' : '#FFFFFF'
  const sloganColor = theme === 'light' ? '#6B6B6B' : 'rgba(255,255,255,0.6)'

  return (
    <div className={className} style={{ display: 'flex', alignItems: 'center', gap: s.gap }}>
      {/* ㅋㅈㅋ Symbol */}
      <div style={{
        width: s.symbol,
        fontFamily: 'PretendardVariable, Pretendard, sans-serif',
        fontWeight: 900,
        fontSize: s.symbol,
        color: symbolColor,
        lineHeight: 1,
        letterSpacing: '-0.05em',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: s.symbol * 0.38, lineHeight: 1.1 }}>ㅋ</span>
        <span style={{ fontSize: s.symbol * 0.44, lineHeight: 1.0 }}>ㅈ</span>
        <span style={{ fontSize: s.symbol * 0.38, lineHeight: 1.1 }}>ㅋ</span>
      </div>

      {/* KOGEMCON text */}
      <div>
        <div style={{
          fontFamily: 'Righteous, sans-serif',
          fontWeight: 700,
          fontSize: s.text,
          color: textColor,
          lineHeight: 1.15,
          letterSpacing: '0.02em',
        }}>
          KO<br />GEM<br />CON
        </div>
        {showSlogan && (
          <p style={{
            fontFamily: 'PretendardVariable, Pretendard, sans-serif',
            fontSize: s.text * 0.7,
            color: sloganColor,
            marginTop: 6,
            lineHeight: 1.4,
          }}>
            Find your <span style={{ color: '#E9C000', fontWeight: 700 }}>Gems</span> in Korea
          </p>
        )}
      </div>
    </div>
  )
}
