/*
 *   Copyright (c) 2025 
 *   All rights reserved.
 */
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

export function BannerAd() {
  const { theme } = useTheme();
  const [imageSrc, setImageSrc] = useState('/2.png');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      // Set image based on theme - light for 2.png, dark for 1.png
      setImageSrc(theme === 'dark' ? '/1.png' : '/2.png');
    }
  }, [theme, mounted]);

  return (
    <div className="w-full py-8 px-4 text-center">
      <div className="mx-auto max-w-5xl">
        <div className="relative h-[200px] w-full overflow-hidden rounded-lg shadow-md">
          <Image
            src={imageSrc}
            alt="FIT - Centro para Treino e Transformação Pessoal - K2.0"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
