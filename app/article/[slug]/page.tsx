import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { BannerAd } from '@/components/ads/banner-ad';
import { EUFundingBanner } from '@/components/ads/eu-funding-banner';
import { ArticleServerService } from '@/lib/articles-server';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { MediaDisplay } from '@/components/ui/media-display';

// Force dynamic rendering to prevent caching issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function ArticleData({ slug }: { slug: string }) {
  const article = await ArticleServerService.getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* EU Banner moved to the very top */}
        <EUFundingBanner />

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {article.categories.map(cat => (
              <Badge key={cat} className="capitalize">{cat}</Badge>
            ))}
          </div>
          <h1 className="text-4xl font-bold leading-tight">{article.title}</h1>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <time dateTime={article.published_at as string}>
              {new Date(article.published_at as string).toLocaleDateString()}
            </time>
          </div>
        </div>

        {article.media_url && (
          <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
            <MediaDisplay
              src={article.media_url}
              alt={article.title}
              className="w-full h-full"
              priority
              mediaType={article.media_type}
              controls={true}
            />
          </div>
        )}

        <div 
          className="prose dark:prose-invert max-w-full prose-lg prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-blockquote:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:text-foreground prose-a:text-primary hover:prose-a:text-primary/80"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <Card className="p-4">
          <div className="space-y-4">
            <h3 className="font-semibold">Share this article</h3>
            {/* Add sharing logic here if needed */}
          </div>
        </Card>

        <BannerAd />
      </div>
    </article>
  );
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ArticleData slug={slug} />;
}