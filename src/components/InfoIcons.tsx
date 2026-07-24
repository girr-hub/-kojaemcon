// 코잼컨 About 페이지 "For Foreigners, By People Who Get It" 섹션에서 쓰는
// 라인아트 아이콘 4종. 디자인 목업에 실제 벡터 파일이 없어서 동일한 톤(1.5px 스트로크,
// 라운드 캡, 잉크 컬러)으로 새로 그린 대체 아이콘입니다. 필요시 자유롭게 교체하세요.

interface IconProps {
  className?: string;
}

const common = {
  width: 40,
  height: 40,
  viewBox: "0 0 40 40",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// EVENTS IN ENGLISH (AND MORE)
export function GlobeIcon({ className }: IconProps) {
  return (
    <svg {...common} className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="15" />
      <ellipse cx="20" cy="20" rx="6.5" ry="15" />
      <line x1="5" y1="20" x2="35" y2="20" />
      <path d="M8 12c3 2 21 2 24 0" />
      <path d="M8 28c3-2 21-2 24 0" />
    </svg>
  );
}

// SEOUL, BUSAN & BEYOND
export function MapPinIcon({ className }: IconProps) {
  return (
    <svg {...common} className={className} aria-hidden="true">
      <path d="M20 5c6.1 0 11 4.8 11 10.8C31 24 20 35 20 35S9 24 9 15.8C9 9.8 13.9 5 20 5z" />
      <circle cx="20" cy="15.5" r="4" />
    </svg>
  );
}

// EASY BOOKING, NO HASSLE
export function TicketIcon({ className }: IconProps) {
  return (
    <svg {...common} className={className} aria-hidden="true">
      <path d="M6 15a3 3 0 000 6v4a2 2 0 002 2h24a2 2 0 002-2v-4a3 3 0 000-6v-4a2 2 0 00-2-2H8a2 2 0 00-2 2v4z" />
      <line x1="23" y1="10" x2="23" y2="14" strokeDasharray="2 3" />
      <line x1="23" y1="19" x2="23" y2="23" strokeDasharray="2 3" />
      <line x1="23" y1="28" x2="23" y2="32" strokeDasharray="2 3" />
    </svg>
  );
}

// 30+ NATIONALITIES
export function HandshakeIcon({ className }: IconProps) {
  return (
    <svg {...common} className={className} aria-hidden="true">
      <path d="M4 18l7-6 6 4 3-2 6 5" />
      <path d="M4 18l6 6 2-2" />
      <path d="M36 18l-6 7-2.5-2" />
      <path d="M17 16l5 5-3 3-6-5" />
      <path d="M23 15l4 4-3 3" />
    </svg>
  );
}
