'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  categories: string[];
  published_at: string;
}

interface SearchDialogProps {
  trigger?: React.ReactNode;
}

export function SearchDialog({ trigger }: SearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      console.log('Searching for:', searchQuery);
      // Search through articles
      const response = await fetch(`/api/articles?search=${encodeURIComponent(searchQuery)}&limit=10`);
      
      if (response.ok) {
        const articles = await response.json();
        console.log('Search results:', articles);
        setResults(articles);
      } else {
        console.error('Search API error:', response.status, response.statusText);
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleResultClick = () => {
    setOpen(false);
    setQuery('');
    setResults([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Search Articles</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for articles, topics, or keywords..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <div className="text-center py-4 text-muted-foreground">
                Searching...
              </div>
            )}
            
            {!loading && query && results.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No results found for "{query}"
              </div>
            )}
            
            {!loading && results.length > 0 && (
              <div className="space-y-3">
                {results.map((result) => (
                  <Link
                    key={result.id}
                    href={`/article/${result.slug}`}
                    onClick={handleResultClick}
                    className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium line-clamp-2 mb-1">
                          {result.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {result.excerpt}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {result.categories.slice(0, 2).map((category) => (
                            <Badge key={category} variant="secondary" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                          <span className="text-xs text-muted-foreground">
                            {new Date(result.published_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
            
            {!query && (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Start typing to search through articles...</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
