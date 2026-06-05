"use client";

import Image from "next/image";

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: number;
  className?: string;
}

export default function Avatar({ name, src, size = 8, className = "" }: AvatarProps) {
  const sizeClass = `w-${size} h-${size}`;
  const px = size * 4;

  if (src) {
    return (
      <div className={`${sizeClass} rounded-full overflow-hidden shrink-0 ${className}`}>
        <Image
          src={src}
          alt={name}
          width={px}
          height={px}
          className="object-cover w-full h-full"
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-white/10 flex items-center justify-center shrink-0 text-white/60 text-xs font-bold ${className}`}
    >
      {name[0]?.toUpperCase()}
    </div>
  );
}
