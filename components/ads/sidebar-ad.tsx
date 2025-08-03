/*
 *   Copyright (c) 2025 
 *   All rights reserved.
 */
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

export function SidebarAd() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration flash by not changing image until mounted
  const imageSrc = mounted && theme === 'dark' ? '/sidebardark.png' : '/sidebarlight.png';

  return (
    <div className="w-full p-4 text-center rounded-lg">
      <div className="relative h-[300px] w-full overflow-hidden rounded-lg">
        <Image
          src={imageSrc}
          alt="FIT - Centro para Treino e Transformação Pessoal - K2.0"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
