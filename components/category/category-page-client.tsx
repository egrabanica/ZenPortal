'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArticleImage } from '@/components/ui/article-image';
import { Article } from '@/lib/database.types';

interface CategoryPageClientProps {
  category: string;
}

export function CategoryPageClient({ category }: CategoryPageClientProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/articles?category=${encodeURIComponent(category)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        
        const data = await response.json();
        setArticles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [category]);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-video bg-muted rounded-t-lg" />
            <CardHeader>
              <div className="h-4 bg-muted rounded w-20 mb-2" />
              <div className="h-6 bg-muted rounded w-full" />
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full mb-2" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-2">Error loading articles</div>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-lg mb-2">No articles found</div>
        <p className="text-muted-foreground">
          There are no published articles in this category yet. Check back later for updates.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <Link key={article.id} href={`/article/${article.slug}`}>
          <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden h-full">
            {article.media_url && (
              <div className="aspect-video overflow-hidden">
                <ArticleImage
                  src={article.media_url}
                  alt={article.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                  mediaType={article.media_type}
                />
              </div>
            )}
            <CardHeader className="pb-2">
              <div className="flex flex-wrap gap-1 mb-2">
                {article.categories.slice(0, 2).map((cat) => (
                  <Badge key={cat} variant="secondary" className="text-xs">
                    {cat}
                  </Badge>
                ))}
                {article.categories.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{article.categories.length - 2}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
                {article.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {article.author_name || 'ZE News'}
                </span>
                <time dateTime={article.published_at || article.created_at}>
                  {new Date(article.published_at || article.created_at).toLocaleDateString()}
                </time>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
