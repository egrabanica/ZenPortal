'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Article } from '@/lib/database.types';
import { Loader2 } from 'lucide-react';

interface HomeCategoryClientProps {
  category: string;
}

export function HomeCategoryClient({ category }: HomeCategoryClientProps) {
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🕒 Latest News
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2 text-muted-foreground">Loading articles...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🕒 Latest News
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-red-500 mb-2">Error loading articles</div>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (articles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🕒 Latest News
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-muted-foreground text-lg mb-2">No articles found</div>
            <p className="text-muted-foreground">
              There are no published articles with the 'Home' category assigned yet.
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Only articles specifically categorized as 'Home' will appear on the homepage.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <section aria-labelledby="latest-heading">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🕒 Latest News
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {articles.map((article: Article) => (
              <article key={article.id} className="group relative">
                <Link href={`/article/${article.slug}`}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="relative aspect-video overflow-hidden rounded-lg">
                      {article.media_type === 'video' ? (
                        <video controls className="w-full h-full object-cover rounded-lg">
                          <source src={article.media_url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <Image
                          src={article.media_url || 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80'}
                          alt={article.title}
                          fill
                          className="object-contain transition-transform group-hover:scale-105"
                        />
                      )}
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
                        <time dateTime={article.published_at as string}>
                          {new Date(article.published_at as string).toLocaleDateString()}
                        </time>
                      </div>
                    </div>
                  </div>
                </Link>
                
              </article>
            ))}
            
            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-8">
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
        </CardContent>
      </Card>
    </section>
  );
}
