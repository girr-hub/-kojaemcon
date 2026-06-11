import { format, formatDistanceToNow, isPast } from 'date-fns';
import { ko } from 'date-fns/locale';

// ─── Date helpers ─────────────────────────────────────────────────────────────

export function formatDate(dateStr: string) {
  return format(new Date(dateStr), 'MMM d, yyyy · HH:mm');
}

export function formatDateShort(dateStr: string) {
  return format(new Date(dateStr), 'MMM d');
}

export function formatDateKr(dateStr: string) {
  return format(new Date(dateStr), 'M월 d일 HH:mm', { locale: ko });
}

export function timeAgo(dateStr: string) {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
}

export function isEventPast(endsAt: string | null, startsAt: string) {
  const checkDate = endsAt || startsAt;
  return isPast(new Date(checkDate));
}

// ─── Price helpers ────────────────────────────────────────────────────────────

export function formatKRW(amount: number) {
  if (amount === 0) return 'FREE';
  return `₩${amount.toLocaleString('ko-KR')}`;
}

// ─── String helpers ───────────────────────────────────────────────────────────

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

export function truncate(text: string, length = 120) {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + '…';
}

// ─── Class helper ─────────────────────────────────────────────────────────────

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

// ─── Category labels ──────────────────────────────────────────────────────────

export const CATEGORIES: Record<string, string> = {
  party: '🎉 Party',
  tour: '🗺 Tour',
  'language-exchange': '💬 Language Exchange',
  sports: '⚽ Sports',
  food: '🍜 Food & Drink',
  music: '🎵 Music',
  art: '🎨 Art & Culture',
  networking: '🤝 Networking',
  other: '✨ Other',
};

export function getCategoryLabel(cat: string | null) {
  if (!cat) return '';
  return CATEGORIES[cat] ?? cat;
}

// ─── Country codes ────────────────────────────────────────────────────────────

export function getCountryFlag(code: string) {
  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}
