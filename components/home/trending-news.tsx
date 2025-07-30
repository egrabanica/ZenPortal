import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import { ArticleService } from '@/lib/articles';

export async function TrendingNews() {
  const articles = await ArticleService.getLatestArticles(6);
  return (
    <section aria-labelledby="trending-heading">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trending Now
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link key={article.id} href={`/article/${article.slug}`}>
                <div className="group relative rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                  <div className="space-y-2">
                    <Badge>{article.categories[0]}</Badge>
                    <h3 className="font-semibold leading-tight group-hover:text-primary">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}