import { Suspense } from 'react';
import { Hero } from '@/components/home/hero';
import { TrendingNews } from '@/components/home/trending-news';
import { LatestNews } from '@/components/home/latest-news';
import { CategoryGrid } from '@/components/home/category-grid';
import { NewsletterCTA } from '@/components/home/newsletter-cta';
import { Loading } from '@/components/ui/loading';
import { BannerAd } from '@/components/ads/banner-ad';
import { SidebarAd } from '@/components/ads/sidebar-ad';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <Hero />
      <BannerAd />
      <Suspense fallback={<Loading />}>
        <TrendingNews />
      </Suspense>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Suspense fallback={<Loading />}>
            <LatestNews />
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