/*
 *   Copyright (c) 2025 
 *   All rights reserved.
 */
export function BannerAd() {
  return (
    <div className="w-full bg-muted/50 p-4 text-center rounded-lg">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm text-muted-foreground">Advertisement</p>
        <div className="h-[90px] flex items-center justify-center border border-border rounded">
          <span className="text-muted-foreground">Banner Ad Space</span>
        </div>
      </div>
    </div>
  );
}