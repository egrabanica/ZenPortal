'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Clock, User, Globe2 } from 'lucide-react';
import { ArticleImage } from '@/components/ui/article-image';
import { Article } from '@/lib/database.types';

export default function PoliticsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoliticsArticles = async () => {
      try {
        const response = await fetch('/api/articles?category=politics');
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error('Error fetching politics articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPoliticsArticles();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Globe2 className="h-8 w-8 text-blue-500" />
          <h1 className="text-4xl font-bold">Politics</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Stay informed with the latest political news, analysis, and developments from local to international levels.
        </p>
      </div>

      {articles.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Globe2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Politics Articles Yet</h3>
            <p className="text-muted-foreground">
              Check back soon for the latest political news and analysis.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Card key={article.id} className="h-full hover:shadow-lg transition-shadow">
              <div className="relative">
                {article.media_url && (
                  <ArticleImage
                    src={article.media_url}
                    alt={article.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                )}
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    Politics
                  </Badge>
                  {article.categories
                    .filter(cat => cat !== 'politics')
                    .slice(0, 2)
                    .map((category) => (
                      <Badge key={category} variant="secondary" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                </div>
                <CardTitle className="line-clamp-2">
                  <Link 
                    href={`/article/${article.slug}`} 
                    className="hover:text-blue-600 transition-colors"
                  >
                    {article.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground line-clamp-3 text-sm">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{article.author_name || 'ZenNews'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(article.created_at)}</span>
                  </div>
                </div>

                <Link 
                  href={`/article/${article.slug}`}
                  className="inline-block text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                >
                  Read Full Article →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Political Categories</h2>
        <div className="flex flex-wrap justify-center gap-3">
          <Badge variant="outline" className="px-4 py-2">Local Politics</Badge>
          <Badge variant="outline" className="px-4 py-2">National Politics</Badge>
          <Badge variant="outline" className="px-4 py-2">International</Badge>
          <Badge variant="outline" className="px-4 py-2">Elections</Badge>
          <Badge variant="outline" className="px-4 py-2">Policy</Badge>
        </div>
      </div>
    </div>
  );
}
