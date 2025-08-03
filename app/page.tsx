import { Suspense } from 'react';
import { Hero } from '@/components/home/hero';
import { HomeCategoryClient } from '@/components/home/home-category-client';
import { CategoryGrid } from '@/components/home/category-grid';
import { NewsletterCTA } from '@/components/home/newsletter-cta';
import { Loading } from '@/components/ui/loading';
import { BannerAd } from '@/components/ads/banner-ad';
import { SidebarAd } from '@/components/ads/sidebar-ad';

// Force dynamic rendering to prevent caching issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <Hero />
      <BannerAd />
      <div className="grid lg:grid-cols-3 gap-8" id="latest-news-section">
        <div className="lg:col-span-2">
          <Suspense fallback={<Loading />}>
            <HomeCategoryClient category="home" />
          </Suspense>
        </div>
        <aside className="space-y-8">
          <CategoryGrid />
          <SidebarAd />
          <NewsletterCTA />
        </aside>
      </div>
    </div>
  );
}
