/*
 *   Copyright (c) 2026 
 *   All rights reserved.
 */
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

export function EUFundingBanner() {
  const { theme } = useTheme();
  const [imageSrc, setImageSrc] = useState('/eulight.jpg');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setImageSrc(theme === 'dark' ? '/eudark.jpg' : '/eulight.jpg');
    }
  }, [theme, mounted]);

  return (
    <div className="w-full">
      <div className="relative w-full h-[120px] overflow-hidden">
        <Image
          src={imageSrc}
          alt="Funded by the European Union"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
