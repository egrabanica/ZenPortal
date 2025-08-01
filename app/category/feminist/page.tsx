import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Users, Scale, Zap } from 'lucide-react';
import Link from 'next/link';
import { CategoryPageClient } from '@/components/category/category-page-client';

// Metadata for the page
export const metadata = {
  title: 'Feminist - ZE News',
  description: 'Exploring gender equality, women\'s rights, and feminist perspectives on current events and social issues.',
  keywords: 'feminist, gender equality, women rights, social justice, feminism, empowerment',
};

function CategoryHeader() {
  return (
    <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-12 w-12 text-pink-600 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Feminist
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-6">
            Exploring gender equality, women's rights, and feminist perspectives 
            on current events and social issues.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Scale className="h-3 w-3" />
              Equality
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              Rights
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Empowerment
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-6 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function FeministPage() {
  return (
    <div className="min-h-screen bg-background">
      <CategoryHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Card className="bg-pink-50 dark:bg-pink-950/20 border-pink-200 dark:border-pink-800">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-600" />
                Feminist Perspectives
              </h2>
              <p className="text-muted-foreground mb-4">
                Amplifying women's voices and exploring issues of gender equality, 
                social justice, and empowerment across all aspects of society.
              </p>
            </CardContent>
          </Card>
        </div>

        <Suspense fallback={<LoadingSkeleton />}>
          <CategoryPageClient category="feminist" />
        </Suspense>

        <div className="mt-12 text-center">
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">Our Focus Areas</h3>
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="bg-pink-100 dark:bg-pink-900/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Scale className="h-6 w-6 text-pink-600" />
                  </div>
                  <h4 className="font-medium">Gender Equality</h4>
                  <p className="text-sm text-muted-foreground">Fighting for equal rights and opportunities</p>
                </div>
                <div className="text-center">
                  <div className="bg-rose-100 dark:bg-rose-900/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Users className="h-6 w-6 text-rose-600" />
                  </div>
                  <h4 className="font-medium">Women's Rights</h4>
                  <p className="text-sm text-muted-foreground">Advocating for fundamental human rights</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Zap className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-medium">Empowerment</h4>
                  <p className="text-sm text-muted-foreground">Supporting women's leadership and independence</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
