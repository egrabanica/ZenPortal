'use client';

import { useState } from 'react';
import Image from 'next/image';
import { isVideoUrl } from '@/lib/media-utils';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from './button';

interface MediaDisplayProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  mediaType?: 'image' | 'video' | null;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
}

export function MediaDisplay({ 
  src, 
  alt, 
  className = '', 
  priority = false, 
  mediaType = null,
  controls = true,
  autoPlay = false,
  muted = true,
  loop = false,
  poster
}: MediaDisplayProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);

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

  const handlePlayPause = (video: HTMLVideoElement) => {
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleMuteToggle = (video: HTMLVideoElement) => {
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  if (isVideo) {
    return (
      <div className={`relative ${className}`}>
        <video
          controls={controls}
          autoPlay={autoPlay}
          muted={isMuted}
          loop={loop}
          poster={poster}
          className="w-full h-full object-contain rounded-lg"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => {
            console.error('Video failed to load:', src);
            handleError();
          }}
        >
          <source src={src} type="video/mp4" />
          <source src={src} type="video/webm" />
          <source src={src} type="video/ogg" />
          <p>Your browser does not support the video tag.</p>
        </video>
        
        {/* Custom video controls overlay */}
        {!controls && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={(e) => {
                  const video = e.currentTarget.parentElement?.parentElement?.querySelector('video') as HTMLVideoElement;
                  if (video) handlePlayPause(video);
                }}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={(e) => {
                  const video = e.currentTarget.parentElement?.parentElement?.querySelector('video') as HTMLVideoElement;
                  if (video) handleMuteToggle(video);
                }}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fallback to image display
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
