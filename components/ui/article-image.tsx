'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ArticleImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function ArticleImage({ src, alt, className, priority }: ArticleImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Fallback image URL
  const fallbackImage = 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80';

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackImage);
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className={className}
      priority={priority}
      onError={handleError}
      unoptimized // This bypasses Next.js image optimization for external URLs
    />
  );
}
