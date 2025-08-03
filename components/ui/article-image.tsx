'use client';

import { useState } from 'react';
import Image from 'next/image';
import { isVideoUrl } from '@/lib/media-utils';

interface ArticleImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  mediaType?: 'image' | 'video' | null;
}

export function ArticleImage({ src, alt, className, priority, mediaType }: ArticleImageProps) {
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

  // Determine if this should be treated as a video
  const isVideo = mediaType === 'video' || (mediaType === null && isVideoUrl(src));

  if (isVideo) {
    return (
      <video
        controls
        className={className}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      >
        <source src={src} type="video/mp4" />
        <source src={src} type="video/webm" />
        <source src={src} type="video/ogg" />
        Your browser does not support the video tag.
      </video>
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className={`object-contain ${className}`}
      priority={priority}
      onError={handleError}
      unoptimized // This bypasses Next.js image optimization for external URLs
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
