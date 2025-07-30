import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { ArticleService } from '@/lib/articles';
import { Article } from '@/lib/database.types';

async function LatestNewsData() {
  const articles = await ArticleService.getLatestArticles(5);

  return (
    <div className="space-y-8">
      {articles.map((article: Article) => (
        <article key={article.id} className="group">
          <Link href={`/article/${article.slug}`}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <Image
                  src={article.media_url || 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80'}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="space-y-3">
                <Badge>{article.categories[0]}</Badge>
                <h3 className="text-xl font-semibold leading-tight group-hover:text-primary">
                  {article.title}
                </h3>
                <p className="text-muted-foreground line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {/* Add author name here if available */}
                  <time dateTime={article.published_at as string}>
                    {new Date(article.published_at as string).toLocaleDateString()}
                  </time>
                </div>
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}

export function LatestNews() {
  return (
    <section aria-labelledby="latest-heading">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🕒 Latest News
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LatestNewsData />
        </CardContent>
      </Card>
    </section>
  );
}
