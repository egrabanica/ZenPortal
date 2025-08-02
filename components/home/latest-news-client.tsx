'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Article } from '@/lib/database.types';
import { useArticleActions } from '@/lib/hooks/use-article-actions';
import { PencilIcon, TrashIcon, CopyIcon, EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react';

interface LatestNewsClientProps {
  initialArticles: Article[];
}

export function LatestNewsClient({ initialArticles }: LatestNewsClientProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement>(null);
  const { isAdmin, handleEdit, handleDelete, handlePublishToggle, handleDuplicate } = useArticleActions();

  const refreshArticles = async () => {
    try {
      // Refresh the articles list after any action
      const response = await fetch('/api/articles/latest?limit=10');
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
        setHasMore(data.length === 10);
      }
    } catch (error) {
      console.error('Failed to refresh articles:', error);
    }
  };

  const loadMoreArticles = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/articles/latest?limit=10&offset=${articles.length}`);
      if (response.ok) {
        const newArticles = await response.json();
        if (newArticles.length === 0) {
          setHasMore(false);
        } else {
          setArticles(prev => [...prev, ...newArticles]);
          setHasMore(newArticles.length === 10);
        }
      }
    } catch (error) {
      console.error('Failed to load more articles:', error);
    } finally {
      setLoading(false);
    }
  }, [articles.length, loading, hasMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreArticles();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loadMoreArticles, hasMore, loading]);

  const onActionSuccess = () => {
    refreshArticles();
  };

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
                    className="object-cover transition-transform group-hover:scale-105"
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
          
          {/* Admin Actions - Only visible to admins */}
          {isAdmin && (
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    handleEdit(article.id);
                  }}
                  title="Edit article"
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePublishToggle(article.id, article.status, () => {
                      const newStatus = article.status === 'published' ? 'draft' : 'published';
                      if (newStatus === 'draft') {
                        // If unpublishing, remove from published articles list
                        setArticles((prev) => prev.filter(a => a.id !== article.id));
                      } else {
                        // If publishing, update the status in the local state
                        setArticles((prev) => prev.map(a => 
                          a.id === article.id ? { ...a, status: newStatus } : a
                        ));
                      }
                      onActionSuccess();
                    });
                  }}
                  title={article.status === 'published' ? 'Unpublish article' : 'Publish article'}
                >
                  {article.status === 'published' ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDuplicate(article.id, () => {
                      // Don't add duplicated article to state since it's created as draft
                      // Just refresh to maintain consistent state
                      onActionSuccess();
                    });
                  }}
                  title="Duplicate article"
                >
                  <CopyIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(article.id, () => {
                      setArticles((prev) => prev.filter(a => a.id !== article.id));
                      onActionSuccess();
                    });
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  title="Delete article"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </article>
      ))}
          </div>
          
          {/* Loading indicator for infinite scroll */}
          {loading && (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2 text-muted-foreground">Loading more articles...</span>
            </div>
          )}
          
          {/* Intersection observer target */}
          <div ref={observerRef} className="h-4" />
          
          {/* End of articles message */}
          {!hasMore && articles.length > 0 && (
            <div className="text-center py-4 text-muted-foreground">
              You've reached the end of the articles.
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
