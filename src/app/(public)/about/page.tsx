import Link from 'next/link'

// ── PARTY wordmark SVG
const PartySVG = () => (
  <svg width="111" height="26" viewBox="0 0 111 26" fill="none" xmlns="http://www.w3.org/2000/svg" style={{maxWidth:'100%'}}>
    <path d="M5.04492 5.04492V15.1348H10.0898C10.7812 15.1348 11.4316 15.0059 12.041 14.748C12.6504 14.4785 13.1836 14.1152 13.6406 13.6582C14.0977 13.2012 14.4551 12.668 14.7129 12.0586C14.9824 11.4375 15.1172 10.7812 15.1172 10.0898C15.1172 9.39844 14.9824 8.74805 14.7129 8.13867C14.4551 7.51758 14.0977 6.97852 13.6406 6.52148C13.1836 6.06445 12.6504 5.70703 12.041 5.44922C11.4316 5.17969 10.7812 5.04492 10.0898 5.04492H5.04492ZM5.04492 25.207H0V0H10.0898C11.0156 0 11.9062 0.123047 12.7617 0.369141C13.6172 0.603516 14.4141 0.943359 15.1523 1.38867C15.9023 1.82227 16.582 2.34961 17.1914 2.9707C17.8125 3.58008 18.3398 4.25977 18.7734 5.00977C19.2188 5.75977 19.5586 6.5625 19.793 7.41797C20.0391 8.27344 20.1621 9.16406 20.1621 10.0898C20.1621 11.4727 19.8984 12.7793 19.3711 14.0098C18.8438 15.2285 18.123 16.2949 17.209 17.209C16.2949 18.123 15.2227 18.8438 13.9922 19.3711C12.7734 19.8984 11.4727 20.1621 10.0898 20.1621H5.04492V25.207ZM37.9688 15.1348V10.0898C37.9688 9.39844 37.834 8.74805 37.5645 8.13867C37.3066 7.51758 36.9492 6.97852 36.4922 6.52148C36.0352 6.06445 35.4961 5.70703 34.875 5.44922C34.2656 5.17969 33.6152 5.04492 32.9238 5.04492C32.2324 5.04492 31.5762 5.17969 30.9551 5.44922C30.3457 5.70703 29.8125 6.06445 29.3555 6.52148C28.8984 6.97852 28.5352 7.51758 28.2656 8.13867C28.0078 8.74805 27.8789 9.39844 27.8789 10.0898V15.1348H37.9688ZM43.0137 25.207H37.9688V20.1621H27.8789V25.207H22.8516V10.0898C22.8516 8.69531 23.1152 7.38867 23.6426 6.16992C24.1699 4.93945 24.8848 3.86719 25.7871 2.95312C26.7012 2.03906 27.7676 1.31836 28.9863 0.791016C30.2168 0.263672 31.5293 0 32.9238 0C34.3184 0 35.625 0.263672 36.8438 0.791016C38.0742 1.31836 39.1465 2.03906 40.0605 2.95312C40.9746 3.86719 41.6953 4.93945 42.2227 6.16992C42.75 7.38867 43.0137 8.69531 43.0137 10.0898V25.207ZM52.4355 5.04492V15.1348H57.4805C58.1719 15.1348 58.8223 15.0059 59.4316 14.748C60.041 14.4785 60.5742 14.1152 61.0312 13.6582C61.4883 13.2012 61.8457 12.668 62.1035 12.0586C62.373 11.4375 62.5078 10.7812 62.5078 10.0898C62.5078 9.39844 62.373 8.74805 62.1035 8.13867C61.8457 7.51758 61.4883 6.97852 61.0312 6.52148C60.5742 6.06445 60.041 5.70703 59.4316 5.44922C58.8223 5.17969 58.1719 5.04492 57.4805 5.04492H52.4355ZM52.4355 25.207H47.3906V0H57.4805C58.4062 0 59.2969 0.123047 60.1523 0.369141C61.0078 0.603516 61.8047 0.943359 62.543 1.38867C63.293 1.82227 63.9727 2.34961 64.582 2.9707C65.2031 3.58008 65.7305 4.25977 66.1641 5.00977C66.6094 5.75977 66.9492 6.5625 67.1836 7.41797C67.4297 8.27344 67.5527 9.16406 67.5527 10.0898C67.5527 10.957 67.4414 11.8008 67.2188 12.6211C67.0078 13.4414 66.6973 14.2207 66.2871 14.959C65.8887 15.6973 65.3965 16.377 64.8105 16.998C64.2246 17.6191 63.5684 18.1582 62.8418 18.6152L65.6367 25.207H60.2754L58.0781 20.127L52.4355 20.1621V25.207ZM81.0352 25.207H76.0078V5.04492H68.4316V0H88.5938V5.04492H81.0352V25.207ZM102.604 25.207H97.5762V17.3145C96.4629 17.0332 95.4375 16.582 94.5 15.9609C93.5742 15.3398 92.7773 14.6016 92.1094 13.7461C91.4414 12.8789 90.9199 11.9238 90.5449 10.8809C90.1816 9.82617 90 8.71875 90 7.55859V0H95.0449V7.55859C95.0449 8.25 95.1738 8.90625 95.4316 9.52734C95.7012 10.1367 96.0645 10.6699 96.5215 11.127C96.9785 11.584 97.5117 11.9473 98.1211 12.2168C98.7422 12.4746 99.3984 12.6035 100.09 12.6035C100.781 12.6035 101.432 12.4746 102.041 12.2168C102.662 11.9473 103.201 11.584 103.658 11.127C104.115 10.6699 104.473 10.1367 104.73 9.52734C105 8.90625 105.135 8.25 105.135 7.55859V0H110.162V7.55859C110.162 8.71875 109.975 9.82617 109.6 10.8809C109.236 11.9238 108.721 12.8789 108.053 13.7461C107.385 14.6016 106.588 15.3398 105.662 15.9609C104.736 16.582 103.717 17.0332 102.604 17.3145V25.207Z" fill="black"/>
  </svg>
)

// ── TOUR wordmark SVG
const TourSVG = () => (
  <svg width="95" height="27" viewBox="0 0 95 27" fill="none" xmlns="http://www.w3.org/2000/svg" style={{maxWidth:'100%'}}>
    <path d="M12.6035 25.5234H7.57617V5.36133H0V0.316406H20.1621V5.36133H12.6035V25.5234ZM46.7578 13.0254C46.7578 14.2207 46.5996 15.375 46.2832 16.4883C45.9785 17.5898 45.5449 18.627 44.9824 19.5996C44.4199 20.5605 43.7402 21.4395 42.9434 22.2363C42.1465 23.0332 41.2676 23.7188 40.3066 24.293C39.3457 24.8555 38.3086 25.2891 37.1953 25.5938C36.082 25.9102 34.9277 26.0684 33.7324 26.0684C32.5371 26.0684 31.3828 25.9102 30.2695 25.5938C29.168 25.2891 28.1309 24.8555 27.1582 24.293C26.1973 23.7188 25.3184 23.0332 24.5215 22.2363C23.7246 21.4395 23.0391 20.5605 22.4648 19.5996C21.9023 18.627 21.4629 17.5898 21.1465 16.4883C20.8418 15.375 20.6895 14.2207 20.6895 13.0254C20.6895 11.8301 20.8418 10.6758 21.1465 9.5625C21.4629 8.44922 21.9023 7.41211 22.4648 6.45117C23.0391 5.49023 23.7246 4.61133 24.5215 3.81445C25.3184 3.01758 26.1973 2.33789 27.1582 1.77539C28.1309 1.21289 29.168 0.779297 30.2695 0.474609C31.3828 0.158203 32.5371 0 33.7324 0C34.9277 0 36.082 0.158203 37.1953 0.474609C38.3086 0.779297 39.3457 1.21289 40.3066 1.77539C41.2676 2.33789 42.1465 3.01758 42.9434 3.81445C43.7402 4.61133 44.4199 5.49023 44.9824 6.45117C45.5449 7.41211 45.9785 8.44922 46.2832 9.5625C46.5996 10.6758 46.7578 11.8301 46.7578 13.0254ZM41.748 13.0254C41.748 11.9238 41.5371 10.8867 41.1152 9.91406C40.6934 8.92969 40.1191 8.08008 39.3926 7.36523C38.6777 6.63867 37.8281 6.06445 36.8438 5.64258C35.8711 5.2207 34.834 5.00977 33.7324 5.00977C32.6191 5.00977 31.5762 5.2207 30.6035 5.64258C29.6309 6.06445 28.7812 6.63867 28.0547 7.36523C27.3281 8.08008 26.7539 8.92969 26.332 9.91406C25.9102 10.8867 25.6992 11.9238 25.6992 13.0254C25.6992 14.127 25.9102 15.1641 26.332 16.1367C26.7539 17.0977 27.3281 17.9414 28.0547 18.668C28.7812 19.3945 29.6309 19.9688 30.6035 20.3906C31.5762 20.8125 32.6191 21.0234 33.7324 21.0234C34.834 21.0234 35.8711 20.8125 36.8438 20.3906C37.8281 19.9688 38.6777 19.3945 39.3926 18.668C40.1191 17.9414 40.6934 17.0977 41.1152 16.1367C41.5371 15.1641 41.748 14.127 41.748 13.0254ZM69.9609 15.4512C69.9609 16.8457 69.6973 18.1582 69.1699 19.3887C68.6426 20.6074 67.9219 21.6738 67.0078 22.5879C66.0938 23.4902 65.0215 24.2051 63.791 24.7324C62.5723 25.2598 61.2656 25.5234 59.8711 25.5234C58.4766 25.5234 57.1641 25.2598 55.9336 24.7324C54.7148 24.2051 53.6484 23.4902 52.7344 22.5879C51.832 21.6738 51.1172 20.6074 50.5898 19.3887C50.0625 18.1582 49.7988 16.8457 49.7988 15.4512V0.316406H54.8262V15.4512C54.8262 16.1426 54.9551 16.793 55.2129 17.4023C55.4824 18.0117 55.8457 18.5449 56.3027 19.002C56.7598 19.459 57.293 19.8223 57.9023 20.0918C58.5234 20.3496 59.1797 20.4785 59.8711 20.4785C60.5625 20.4785 61.2129 20.3496 61.8223 20.0918C62.4434 19.8223 62.9824 19.459 63.4395 19.002C63.8965 18.5449 64.2539 18.0117 64.5117 17.4023C64.7812 16.793 64.916 16.1426 64.916 15.4512V0.316406H69.9609V15.4512ZM79.3828 5.36133V15.4512H84.4277C85.1191 15.4512 85.7695 15.3223 86.3789 15.0645C86.9883 14.7949 87.5215 14.4316 87.9785 13.9746C88.4355 13.5176 88.793 12.9844 89.0508 12.375C89.3203 11.7539 89.4551 11.0977 89.4551 10.4062C89.4551 9.71484 89.3203 9.06445 89.0508 8.45508C88.793 7.83398 88.4355 7.29492 87.9785 6.83789C87.5215 6.38086 86.9883 6.02344 86.3789 5.76562C85.7695 5.49609 85.1191 5.36133 84.4277 5.36133H79.3828ZM79.3828 25.5234H74.3379V0.316406H84.4277C85.3535 0.316406 86.2441 0.439453 87.0996 0.685547C87.9551 0.919922 88.752 1.25977 89.4902 1.70508C90.2402 2.13867 90.9199 2.66602 91.5293 3.28711C92.1504 3.89648 92.6777 4.57617 93.1113 5.32617C93.5566 6.07617 93.8965 6.87891 94.1309 7.73438C94.377 8.58984 94.5 9.48047 94.5 10.4062C94.5 11.2734 94.3887 12.1172 94.166 12.9375C93.9551 13.7578 93.6445 14.5371 93.2344 15.2754C92.8359 16.0137 92.3438 16.6934 91.7578 17.3145C91.1719 17.9355 90.5156 18.4746 89.7891 18.9316L92.584 25.5234H87.2227L85.0254 20.4434L79.3828 20.4785V25.5234Z" fill="black"/>
  </svg>
)

// ── MEETUP wordmark
const MeetupSVG = () => (
  <svg width="80" height="14" viewBox="0 0 137 26" fill="none" xmlns="http://www.w3.org/2000/svg" style={{maxWidth:'100%'}}>
    <path d="M25.1895 25.5586H20.1621V7.55859C20.1621 7.20703 20.0918 6.87891 19.9512 6.57422C19.8223 6.26953 19.6406 6.00586 19.4062 5.7832C19.1836 5.54883 18.9199 5.36719 18.6152 5.23828C18.3105 5.10938 17.9824 5.04492 17.6309 5.04492C17.2793 5.04492 16.9512 5.10938 16.6465 5.23828C16.3418 5.36719 16.0723 5.54883 15.8379 5.7832C15.6152 6.00586 15.4395 6.26953 15.3105 6.57422C15.1816 6.87891 15.1172 7.20703 15.1172 7.55859V25.5586H10.0723V7.55859C10.0723 7.20703 10.0078 6.87891 9.87891 6.57422C9.75 6.26953 9.56836 6.00586 9.33398 5.7832C9.11133 5.54883 8.84766 5.36719 8.54297 5.23828C8.23828 5.10938 7.91016 5.04492 7.55859 5.04492C7.20703 5.04492 6.87891 5.10938 6.57422 5.23828C6.26953 5.36719 6 5.54883 5.76562 5.7832C5.54297 6.00586 5.36719 6.26953 5.23828 6.57422C5.10938 6.87891 5.04492 7.20703 5.04492 7.55859V25.5586H0V7.55859C0 6.51562 0.193359 5.53711 0.580078 4.62305C0.978516 3.69727 1.51758 2.89453 2.19727 2.21484C2.88867 1.52344 3.69141 0.984375 4.60547 0.597656C5.53125 0.199219 6.51562 0 7.55859 0C8.49609 0 9.39844 0.169922 10.2656 0.509766C11.1328 0.837891 11.9121 1.31836 12.6035 1.95117C13.2949 1.31836 14.0684 0.837891 14.9238 0.509766C15.791 0.169922 16.6934 0 17.6309 0C18.6738 0 19.6523 0.199219 20.5664 0.597656C21.4922 0.984375 22.2949 1.52344 22.9746 2.21484C23.666 2.89453 24.2051 3.69727 24.5918 4.62305C24.9902 5.53711 25.1895 6.51562 25.1895 7.55859V25.5586Z" fill="black"/>
  </svg>
)

// ── LANGUAGE wordmark (abbreviated)
const LanguageSVG = () => (
  <svg width="90" height="14" viewBox="0 0 183 27" fill="none" xmlns="http://www.w3.org/2000/svg" style={{maxWidth:'100%'}}>
    <path d="M17.6484 25.4883H0V0.28125H5.04492V20.4434H17.6484V25.4883Z" fill="black"/>
  </svg>
)

// ── Circle card background (Rectangle 19-25 = #FFFBE7 with black border)
const CircleCard = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    width: 'clamp(110px,18vw,200px)', height: 'clamp(110px,18vw,200px)',
    borderRadius: '50%', background: '#FFFBE7', border: '1px solid #12161A',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: 'clamp(12px,2vw,24px)',
  }}>
    {children}
  </div>
)

// ── "Check out Events" button (Rectangle_26: black rounded rect)
const EventsButton = () => (
  <Link href="/events" style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    background: '#12161A', color: '#FFFFFF', borderRadius: 12,
    padding: '14px 40px', minWidth: 240,
    fontFamily: 'PretendardVariable, Pretendard, sans-serif',
    fontSize: 15, fontWeight: 700, textDecoration: 'none',
  }}>
    Check out Events
  </Link>
)

// ── Vector-1: event card shape (yellow+black)
const EventCardShape = () => (
  <svg width="151" height="125" viewBox="0 0 151 125" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', bottom: -20, right: -20, opacity: 0.15 }}>
    <path opacity="0.37" d="M150.5 66.3984V124.5H3.46094V66.3984H150.5ZM45.3926 99.6426H108.568V91.2549H45.3926V99.6426ZM114.971 0.5V16.6055H120.412V0.5H150.5V59.4883H120.412V45.1562H114.971V59.4883H84.8828V0.5H114.971ZM81.2178 0.5V31.5625H71.333L71.6367 32.2617L83.4717 59.4883H48.4561L42.5098 43.999L42.043 42.7832L41.5762 43.999L35.6299 59.4883H0.766602L12.7451 32.2637L13.0537 31.5625H3.3125V0.5H81.2178Z" fill="#FFD201" stroke="black"/>
  </svg>
)

// ── World globe
const WorldIcon = () => (
  <svg width="90" height="90" viewBox="0 0 189 189" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M94.5 0C42.3075 0 0 42.3093 0 94.5011C0 146.693 42.3075 189 94.5 189C146.692 189 189 146.691 189 94.5011C189 42.3115 146.692 0 94.5 0ZM31.3895 160.267C13.261 142.902 3.04451 118.884 3.38732 93.6974C6.78827 96.9008 10.7999 98.9396 15.3474 99.4822L24.297 100.547C30.713 101.512 37.1811 103.096 41.5969 107.919C42.8774 109.317 43.0204 111.052 42.1372 112.707L40.2211 116.296C38.5615 119.404 39.5127 123.118 42.135 125.466C43.6379 126.812 45.4428 127.663 47.2999 128.719L51.827 131.289C54.4378 132.772 55.5321 135.873 54.6422 138.763L53.0007 144.1C51.8315 147.903 51.0187 151.592 51.3547 155.606C51.7589 160.451 53.2255 164.894 55.4254 169.194L60.5019 179.117C49.6179 174.772 39.7965 168.318 31.3895 160.267Z" fill="black"/>
  </svg>
)

// ── Ticket
const TicketIcon = () => (
  <svg width="90" height="110" viewBox="0 0 208 261" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M137.284 248.426L140.58 241.362C138.581 240.438 137.736 238.119 138.647 236.172C139.558 234.226 141.864 233.381 143.816 234.285L147.164 227.254C145.166 226.324 144.321 224.011 145.232 222.058C146.142 220.112 148.455 219.267 150.408 220.178L153.756 213.147C151.751 212.21 150.906 209.897 151.816 207.957C152.721 206.005 155.04 205.159 156.986 206.07L160.334 199.039C158.395 198.128 157.549 195.927 158.323 194.02C152.19 189.191 149.943 180.614 153.382 173.229L49.9655 125.029C45.9491 133.645 35.7017 137.374 27.0859 133.363L1.30371 188.621C9.91305 192.637 13.6411 202.873 9.61821 211.489L113.042 259.689C116.501 252.265 124.586 248.465 132.272 250.136C133.228 248.347 135.417 247.58 137.284 248.419V248.426Z" stroke="black" strokeWidth="3" strokeMiterlimit="10"/>
    <path d="M49.0616 145.518C46.6701 144.404 43.82 145.446 42.7062 147.831L22.4408 191.275C21.327 193.66 22.3622 196.51 24.7471 197.624L113.946 239.2C116.338 240.314 119.188 239.278 120.308 236.887L140.573 193.443C141.687 191.058 140.646 188.201 138.261 187.087L49.0616 145.518Z" stroke="black" strokeWidth="3" strokeMiterlimit="10"/>
  </svg>
)

// ── Handshake
const HandshakeIcon = () => (
  <svg width="90" height="62" viewBox="0 0 186 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M95.9771 130C91.0687 130 86.2978 128.642 82.2608 125.032L79.8344 121.626L78.256 122.96C74.5919 125.36 70.0425 126.167 66.2606 124.008C62.5221 121.874 60.4795 117.712 61.5441 112.837C57.787 110.169 55.1476 107.118 49.4678 111.038C46.4596 108.06 45.4755 103.718 46.8063 99.5438C41.9164 99.6183 38.8835 95.8655 36.8347 95.8655C34.2288 92.7889 33.4984 88.7508 34.8168 84.9051C29.8527 85.0291 26.8879 83.6707 24.7586 81.2081C22.0785 78.1005 21.3605 73.957 22.8212 70.0429L0 45.3121C1.02735 40.3249 5.36013 30.909 22.6479 9.94942C38.0355 1.53831 49.932 3.80237 57.7496 10.8364C69.3615 17.182 84.9471 25.5311 84.9471 25.5311L112.931 8.55377C125.069 6.47585 138.463 5.17324 149.506 1.06693C158.289 1.67478 169.956 12.7966 180.869 28.9178C185.474 52.3772 183.394 59.5601 150.855 80.7305C152.285 84.4833 149.097 91.3189 133.629 108.687C116.583 119.579 105.807 118.059 106.382 121.601C99.9882 129.057 96.0019 130 95.9771 130Z" fill="black"/>
  </svg>
)

// ── Korea map
const KoreaIcon = () => (
  <svg width="60" height="90" viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 4C16 7 9 14 6 23C3 31 4 40 9 49C13 58 15 65 17 73C19 79 22 85 27 88C33 92 40 90 45 84C51 77 53 68 56 58C60 47 62 36 60 26C57 14 46 6 35 3C31 2 26 3 22 4Z" stroke="black" strokeWidth="2" fill="none"/>
    <circle cx="22" cy="40" r="2.5" fill="#E9C000"/>
    <circle cx="38" cy="50" r="2.5" fill="#E9C000"/>
    <circle cx="30" cy="30" r="2" fill="#E9C000"/>
  </svg>
)

export default function AboutPage() {
  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>

      {/* ── Section 1: About intro — cream bg ── */}
      <section style={{ background: '#F5F5E8', padding: 'clamp(48px,8vw,96px) clamp(24px,6vw,80px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,5vw,80px)', alignItems: 'center' }}>
          <div>
            <div style={{ marginBottom: 32 }}>
              <svg width="130" height="32" viewBox="0 0 110 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M-0.000156242 27.28L9.59984 0H16.8798L26.4798 27.28H20.5998L18.7198 21.76H7.75984L5.87984 27.28H-0.000156242ZM9.19984 16.88H17.2798L13.6798 6.4C13.4798 5.76 13.3598 5.32 13.2798 4.92H13.1998C13.1198 5.32 12.9998 5.76 12.7998 6.4L9.19984 16.88ZM40.7967 27.72C37.8367 27.72 35.7567 26.48 34.7567 24.44L34.4367 27.28H29.3567V0H34.8767V11.12C35.9167 9.2 37.9567 8.04 40.7967 8.04C44.9567 8.04 49.2767 11.32 49.2767 17.88C49.2767 24.44 44.9567 27.72 40.7967 27.72ZM39.2367 22.92C41.8767 22.92 43.8367 21 43.8367 17.88C43.8367 14.76 41.8767 12.84 39.2367 12.84C37.1167 12.84 34.8367 14.36 34.8367 17.88C34.8367 21.4 37.1167 22.92 39.2367 22.92ZM61.5086 27.72C55.5486 27.72 51.3486 23.48 51.3486 17.88C51.3486 12.28 55.5486 8.04 61.5086 8.04C67.4686 8.04 71.6686 12.28 71.6686 17.88C71.6686 23.48 67.4686 27.72 61.5086 27.72ZM61.5086 22.96C64.2686 22.96 66.2286 20.88 66.2286 17.88C66.2286 14.88 64.2686 12.8 61.5086 12.8C58.7486 12.8 56.7886 14.88 56.7886 17.88C56.7886 20.88 58.7486 22.96 61.5086 22.96ZM83.6914 27.72C77.9314 27.68 74.7714 24.08 74.7714 19V8.48H80.2914V18.6C80.2914 21.24 81.4514 22.88 83.6914 22.92C86.1314 22.96 87.1714 21.32 87.1714 18.64V8.48H92.6914V19.04C92.6914 23.88 88.9714 27.76 83.6914 27.72ZM105.762 27.6C101.362 27.6 98.4417 24.96 98.4417 19.88V12.8H95.0017V8.48H98.4417V2.08H103.962V8.48H109.482V12.8H103.962V19.12C103.962 21.48 104.762 22.72 107.282 22.72L108.922 22.68V27.12C107.802 27.44 106.882 27.6 105.762 27.6Z" fill="#12161A"/>
              </svg>
            </div>
            <p style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontSize: 14, color: '#3A3A3A', marginBottom: 14 }}>안녕!</p>
            <p style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontSize: 15, color: '#12161A', lineHeight: 1.8, marginBottom: 18 }}>
              <strong>KOGEMCON</strong> is your go-to platform for finding the best events, experiences, and meetups in Korea — made specifically for foreigners.
            </p>
            <p style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontSize: 15, color: '#3A3A3A', lineHeight: 1.8 }}>
              Whether you just landed in Seoul or have been living here for years, we bring you the most exciting things happening around you — all in one place.
            </p>
          </div>

          {/* ㅋㅈㅋ logo block */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ background: '#E9C000', width: 'clamp(120px,18vw,190px)', height: 'clamp(44px,6.5vw,70px)', display: 'flex', alignItems: 'center', paddingLeft: 14 }}>
                <span style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, fontSize: 'clamp(28px,5vw,54px)', color: '#12161A', lineHeight: 1 }}>ㅋ</span>
              </div>
              <div style={{ background: '#E9C000', width: 'clamp(138px,20vw,218px)', height: 'clamp(54px,7.5vw,82px)', display: 'flex', alignItems: 'center', paddingLeft: 14 }}>
                <span style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, fontSize: 'clamp(34px,6vw,66px)', color: '#12161A', lineHeight: 1 }}>ㅈ</span>
              </div>
              <div style={{ background: '#E9C000', width: 'clamp(120px,18vw,190px)', height: 'clamp(80px,11vw,110px)', display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 14 }}>
                <span style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, fontSize: 'clamp(28px,5vw,54px)', color: '#12161A', lineHeight: 1 }}>ㅋ</span>
                <div style={{ fontFamily: 'Righteous, sans-serif', fontSize: 'clamp(13px,2vw,22px)', color: '#12161A', lineHeight: 1.1 }}>KO<br/>GEM<br/>CON</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Korea Gem Contents — yellow ── */}
      <section style={{ background: '#E9C000', padding: 'clamp(48px,8vw,96px) 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 'clamp(24px,4vw,40px)', color: '#12161A', marginBottom: 16 }}>Korea Gem Contents</h2>
          <p style={{ fontSize: 15, color: '#12161A', lineHeight: 1.75, marginBottom: 6, fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
            The name says it all. Korea + Jaemi (재미, meaning &quot;fun&quot; in Korean) + Contents.
          </p>
          <p style={{ fontSize: 15, color: '#12161A', lineHeight: 1.75, marginBottom: 52, fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
            We believe Korea is one of the most exciting places in the world — and we want everyone to experience it fully.
          </p>

          {/* 3 circle cards using Rectangle (FFFBE7 + black border) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(12px,3vw,32px)', maxWidth: 680, margin: '0 auto 52px' }}>
            {[
              { title: 'KO — Korea', desc: 'Everything happens right here in Korea' },
              { title: 'GEM — Fun (재미)', desc: 'We only do things worth your time' },
              { title: 'CON — Contents', desc: 'Real experiences, not just content' },
            ].map(item => (
              <div key={item.title} style={{ display: 'flex', justifyContent: 'center' }}>
                <CircleCard>
                  <p style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 700, fontSize: 'clamp(9px,1.4vw,12px)', color: '#12161A', textDecoration: 'underline', textAlign: 'center', marginBottom: 6 }}>{item.title}</p>
                  <p style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontSize: 'clamp(9px,1.3vw,11px)', color: '#12161A', textAlign: 'center', lineHeight: 1.5 }}>{item.desc}</p>
                </CircleCard>
              </div>
            ))}
          </div>

          {/* Big KO GEM CON */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', maxWidth: 700, margin: '0 auto' }}>
            {['KO', 'GEM', 'CON'].map(w => (
              <div key={w} style={{ textAlign: 'center' }}>
                <span style={{ fontFamily: 'Righteous, sans-serif', fontSize: 'clamp(48px,9vw,104px)', fontWeight: 700, color: '#12161A', letterSpacing: '-0.02em' }}>{w}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vertical line divider */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0', background: '#FFFFFF' }}>
        <svg width="1" height="80" viewBox="0 0 1 136" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="0.5" y1="0" x2="0.5" y2="136" stroke="black"/>
        </svg>
      </div>

      {/* ── Section 3: What We Do — yellow ── */}
      <section style={{ background: '#E9C000', padding: 'clamp(40px,6vw,72px) 0 0' }}>
        <div style={{ textAlign: 'center', padding: '0 24px 36px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <svg width="231" height="28" viewBox="0 0 231 28" fill="none" xmlns="http://www.w3.org/2000/svg" style={{maxWidth:'100%'}}>
              <path d="M7.9601 27.28L9.76846e-05 2.76566e-05H5.7601L9.9201 15.84C10.3601 17.56 10.7601 19.56 10.8801 20.36H10.9601C11.0801 19.56 11.2801 18.28 11.9601 15.76L16.3201 2.76566e-05H23.6001L27.9601 15.76C28.6801 18.32 28.8801 19.56 29.0001 20.36H29.0801C29.2001 19.56 29.5201 17.64 30.0001 15.84L34.1601 2.76566e-05H39.9201L31.9601 27.28H25.7601L20.6401 8.20003C20.2401 6.72003 20.0801 5.88003 20.0001 4.76003H19.9201C19.8401 5.88003 19.6801 6.72003 19.2801 8.20003L14.1601 27.28H7.9601ZM43.0232 27.28V2.76566e-05H48.5432V11.04C49.6632 9.28003 51.7832 8.04003 54.3032 8.04003C58.1032 8.04003 61.3832 10.52 61.3832 16.32V27.28H55.8632V17.2C55.8632 13.92 54.1432 12.92 52.3832 12.92C49.8232 12.92 48.5432 14.96 48.5432 17.68V27.28H43.0232ZM73.4979 27.72C69.2579 27.72 64.8979 24.44 64.8979 17.88C64.8979 11.32 69.2579 8.04003 73.4979 8.04003C76.5379 8.04003 78.6179 9.32003 79.6179 11.4L80.0979 8.48003H84.7779V27.28H79.8979L79.5779 24.44C78.5779 26.48 76.4979 27.72 73.4979 27.72ZM75.0579 22.92C77.2179 22.92 79.4979 21.4 79.4979 17.88C79.4979 14.6 77.1379 12.84 75.0579 12.84C72.2979 12.84 70.3379 14.88 70.3379 17.88C70.3379 21 72.3379 22.92 75.0579 22.92ZM98.3345 27.6C93.9345 27.6 91.0145 24.96 91.0145 19.88V12.8H87.5745V8.48003H91.0145V2.08003H96.5345V8.48003H102.054V12.8H96.5345V19.12C96.5345 21.48 97.3345 22.72 99.8545 22.72L101.494 22.68V27.12C100.374 27.44 99.4545 27.6 98.3345 27.6ZM120.812 27.28L112.852 2.76566e-05H118.612L122.772 15.84C123.212 17.56 123.612 19.56 123.732 20.36H123.812C123.932 19.56 124.132 18.28 124.812 15.76L129.172 2.76566e-05H136.452L140.812 15.76C141.532 18.32 141.732 19.56 141.852 20.36H141.932C142.052 19.56 142.372 17.64 142.852 15.84L147.012 2.76566e-05H152.772L144.812 27.28H138.612L133.492 8.20003C133.092 6.72003 132.932 5.88003 132.852 4.76003H132.772C132.692 5.88003 132.532 6.72003 132.132 8.20003L127.012 27.28H120.812ZM161.652 27.72C155.692 27.72 151.812 23.52 151.812 17.88C151.812 12.28 155.812 8.04003 161.492 8.04003C167.172 8.04003 171.092 12.28 171.092 17.88L171.052 19.68H156.932C157.532 22.08 159.212 23.28 161.532 23.28C163.652 23.28 164.772 22.76 165.532 21.6H170.532C169.332 25.96 165.372 27.72 161.652 27.72ZM156.892 16H166.052C165.692 13.96 163.772 12.52 161.492 12.52C159.092 12.52 157.412 13.92 156.892 16ZM184.234 27.28V2.76566e-05H193.474C201.874 2.76566e-05 207.594 6.00003 207.594 13.64C207.594 21.28 201.874 27.28 193.474 27.28H184.234ZM189.834 21.96H193.874C198.634 21.96 201.914 18.24 201.914 13.64C201.914 9.04003 198.634 5.32003 193.874 5.32003H189.834V21.96ZM220.253 27.72C214.293 27.72 210.093 23.48 210.093 17.88C210.093 12.28 214.293 8.04003 220.253 8.04003C226.213 8.04003 230.413 12.28 230.413 17.88C230.413 23.48 226.213 27.72 220.253 27.72ZM220.253 22.96C223.013 22.96 224.973 20.88 224.973 17.88C224.973 14.88 223.013 12.8 220.253 12.8C217.493 12.8 215.533 14.88 215.533 17.88C215.533 20.88 217.493 22.96 220.253 22.96Z" fill="#12161A"/>
            </svg>
          </div>
          <p style={{ fontSize: 15, color: '#12161A', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>Korea&apos;s #1 platform for the international community</p>
          <p style={{ fontSize: 15, color: '#12161A', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>From wild parties to cultural deep-dives — we&apos;ve got you.</p>
        </div>

        {/* 4-col grid with real SVG wordmarks */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            { label: <PartySVG />, desc: 'The best nightlife and social events, curated for the international crowd.' },
            { label: <TourSVG />, desc: 'Explore Korea beyond the tourist spots. Real experiences, real locals.' },
            { label: <MeetupSVG />, desc: 'Language exchanges, networking, community gatherings. Make friends here.' },
            { label: <LanguageSVG />, desc: '한국어 배우고 싶어?\nKorean culture & language events for all levels.' },
          ].map((item, i) => (
            <div key={i} style={{
              padding: 'clamp(20px,3vw,36px) clamp(14px,2vw,24px)',
              background: '#FFFFFF',
              borderTop: '1.5px solid #12161A',
              borderRight: i < 3 ? '1.5px solid #12161A' : 'none',
              borderLeft: i === 0 ? '1.5px solid #12161A' : 'none',
              minHeight: 200, position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ marginBottom: 20 }}>{item.label}</div>
              <p style={{ fontSize: 13, color: '#3A3A3A', lineHeight: 1.75, fontFamily: 'PretendardVariable, Pretendard, sans-serif', whiteSpace: 'pre-line' }}>{item.desc}</p>
              {i === 2 && <svg style={{position:'absolute',bottom:-10,right:-10,opacity:0.12,pointerEvents:'none'}} width="148" height="125" viewBox="0 0 148 125" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M81.46 60.6357V92.2549H147.5V124.5H0.5V92.2549H39.7109V60.6357H81.46ZM141.751 0.5V28.0527L136.934 76.332H94.749L96.9033 55.459L96.9609 54.9082H6.39648V30.79H99.1172V24.6182H6.39648V0.5H141.751Z" fill="#FFD201" stroke="black"/></svg>}
              {i === 3 && <svg style={{position:'absolute',bottom:-10,right:-10,opacity:0.12,pointerEvents:'none'}} width="148" height="125" viewBox="0 0 148 125" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M42.249 72.3086V92.2549H147.5V124.5H0.5V72.3086H42.249ZM95.3164 0.5V17.9346H104.277V0.5H146.026V85.3447H104.277V47.9629H93.0137L92.9619 48.4043L90.9502 65.3984H48.4814L50.9102 47.4961L50.9863 46.9287H0.5V26.7998H53.126V20.6289H0.5V0.5H95.3164Z" fill="#FFD201" stroke="black"/></svg>}
              {(i === 0 || i === 1) && <EventCardShape />}
            </div>
          ))}
        </div>

        {/* Check out Events — Rectangle_26 style */}
        <div style={{ textAlign: 'center', padding: 'clamp(32px,5vw,56px) 24px' }}>
          <EventsButton />
        </div>
      </section>

      {/* ── Section 4: For Foreigners — white ── */}
      <section style={{ background: '#FFFFFF', padding: 'clamp(48px,8vw,96px) clamp(24px,6vw,80px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,5vw,80px)', alignItems: 'start' }}>
          <div>
            <h2 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 'clamp(22px,3.5vw,38px)', color: '#12161A', lineHeight: 1.15, marginBottom: 24 }}>
              For Foreigners,<br />By People Who Get It
            </h2>
            <p style={{ fontSize: 15, color: '#6B6B6B', lineHeight: 1.8, fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
              Language barriers, not knowing where to look, missing out on amazing things happening right around the corner — KOGEMCON was built to fix that.
            </p>
          </div>

          {/* 2x2 icon grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '1.5px solid #E8E8E4' }}>
            {[
              { icon: <WorldIcon />, label: 'EVENTS IN ENGLISH (AND MORE)' },
              { icon: <KoreaIcon />, label: 'SEOUL, BUSAN & BEYOND' },
              { icon: <TicketIcon />, label: 'EASY BOOKING, NO HASSLE' },
              { icon: <HandshakeIcon />, label: '30+ NATIONALITIES' },
            ].map((item, i) => (
              <div key={item.label} style={{
                padding: 'clamp(20px,3vw,32px) clamp(14px,2vw,24px)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, textAlign: 'center',
                borderRight: i % 2 === 0 ? '1.5px solid #E8E8E4' : 'none',
                borderBottom: i < 2 ? '1.5px solid #E8E8E4' : 'none',
              }}>
                {item.icon}
                <p style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 700, fontSize: 10, color: '#12161A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: Got Something Going On — dark ── */}
      <section style={{ background: '#12161A', padding: 'clamp(64px,10vw,120px) 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, fontSize: 'clamp(28px,5vw,52px)', color: '#FFFFFF', textTransform: 'uppercase', lineHeight: 1.1, marginBottom: 24 }}>
            GOT SOMETHING<br />GOING ON?
          </h2>
          <p style={{ fontSize: 15, color: '#B0B0B0', lineHeight: 1.8, marginBottom: 36, fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
            Running events for the international community in Korea?<br />
            List your event on KOGEMCON and reach thousands of foreigners<br />
            looking for exactly what you&apos;re offering.
          </p>
          <Link href="/host/new" style={{ background: '#E9C000', color: '#12161A', fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontSize: 15, fontWeight: 700, padding: '14px 40px', borderRadius: 100, textDecoration: 'none', display: 'inline-block' }}>
            Launch Your Event
          </Link>
        </div>
      </section>
    </div>
  )
}
