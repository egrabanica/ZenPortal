/*
 *   Copyright (c) 2025 
 *   All rights reserved.
 */
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <div className="relative overflow-hidden rounded-lg bg-card">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&q=80')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/25" />
      </div>
      <div className="relative px-6 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Your Source for Trusted News
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Get real-time updates on breaking news with our integrated fact-checking system. 
            Join our community of informed readers who value truth and transparency.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Button asChild size="lg">
              <Link href="/latest">Latest News</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/fact-check">Fact Check</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}