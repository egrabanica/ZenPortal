import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { BannerAd } from '@/components/ads/banner-ad';
import { ArticleService } from '@/lib/articles';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { ArticleImage } from '@/components/ui/article-image';

export async function generateStaticParams() {
  // Fetch all published articles to generate static pages
  const articles = await ArticleService.getLatestArticles(100); 

  return articles.map((article) => ({
    slug: article.slug,
  }));
}

async function ArticleData({ slug }: { slug: string }) {
  const article = await ArticleService.getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          {article.categories.map(cat => (
            <Badge key={cat} className="capitalize mr-2">{cat}</Badge>
          ))}
          <h1 className="text-4xl font-bold leading-tight">{article.title}</h1>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {/* Add author name here if available */}
            <time dateTime={article.published_at as string}>
              {new Date(article.published_at as string).toLocaleDateString()}
            </time>
          </div>
        </div>

        {article.media_url && (
          <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
            <ArticleImage
              src={article.media_url}
              alt={article.title}
              className=""
              priority
              mediaType={article.media_type}
            />
          </div>
        )}

        <BannerAd />

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
      </div>
    </article>
  );
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ArticleData slug={slug} />;
}
