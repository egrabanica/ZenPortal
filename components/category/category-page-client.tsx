'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArticleImage } from '@/components/ui/article-image';
import { Article } from '@/lib/database.types';
import { Loader2 } from 'lucide-react';

interface CategoryPageClientProps {
  category: string;
}

export function CategoryPageClient({ category }: CategoryPageClientProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchArticles = async (isLoadMore = false) => {
    try {
      if (!isLoadMore) {
        setLoading(true);
        setError(null);
        setOffset(0);
      } else {
        setLoadingMore(true);
      }

      const currentOffset = isLoadMore ? offset : 0;
      const response = await fetch(`/api/articles?category=${encodeURIComponent(category)}&limit=50&offset=${currentOffset}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch articles: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (isLoadMore) {
        setArticles(prev => [...prev, ...data]);
        setOffset(prev => prev + data.length);
      } else {
        setArticles(data);
        setOffset(data.length);
      }
      
      setHasMore(data.length === 50); // If we got exactly 50, there might be more
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const loadArticles = async () => {
      if (isMounted) {
        await fetchArticles();
      }
    };
    
    loadArticles();
    
    return () => {
      isMounted = false;
    };
  }, [category]); // eslint-disable-line react-hooks/exhaustive-deps

  const onActionSuccess = () => {
    fetchArticles(); // Refresh articles after any admin action
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchArticles(true);
    }
  };

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
        <article key={article.id} className="group relative">
          <Link href={`/article/${article.slug}`}>
            <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden h-full">
              {article.media_url && (
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <ArticleImage
                    src={article.media_url}
                    alt={article.title}
                    className="group-hover:scale-105 transition-transform duration-200"
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
        </article>
      ))}
      
      {/* Load More Button */}
      {hasMore && (
        <div className="col-span-full flex justify-center mt-8">
          <Button 
            onClick={loadMore} 
            disabled={loadingMore}
            variant="outline"
            size="lg"
            className="min-w-[200px]"
          >
            {loadingMore ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading more...
              </>
            ) : (
              'Load More Articles'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
