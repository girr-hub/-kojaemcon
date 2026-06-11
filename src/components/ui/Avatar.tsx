import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
}

export default function Avatar({ src, name, size = 36, className }: AvatarProps) {
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  if (src) {
    return (
      <Image
        src={src}
        alt={name ?? 'avatar'}
        width={size}
        height={size}
        className={cn('rounded-full object-cover', className)}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-primary flex items-center justify-center text-black font-bold',
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initial}
    </div>
  );
}
