'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Article } from '@/lib/database.types';
import { useArticleActions } from '@/lib/hooks/use-article-actions';
import { PencilIcon, TrashIcon, CopyIcon, EyeIcon, EyeOffIcon } from 'lucide-react';

interface LatestNewsClientProps {
  initialArticles: Article[];
}

export function LatestNewsClient({ initialArticles }: LatestNewsClientProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const { isAdmin, handleEdit, handleDelete, handlePublishToggle, handleDuplicate } = useArticleActions();

  const refreshArticles = async () => {
    try {
      // Refresh the articles list after any action
      const response = await fetch('/api/articles/latest?limit=5');
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      }
    } catch (error) {
      console.error('Failed to refresh articles:', error);
    }
  };

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
                    handlePublishToggle(article.id, article.status, onActionSuccess);
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
                    handleDuplicate(article.id, onActionSuccess);
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
                    handleDelete(article.id, onActionSuccess);
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
        </CardContent>
      </Card>
    </section>
  );
}
