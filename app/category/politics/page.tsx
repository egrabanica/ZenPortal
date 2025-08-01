import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Globe2, Vote, Scale, Users } from 'lucide-react';
import Link from 'next/link';
import { CategoryPageClient } from '@/components/category/category-page-client';

// Metadata for the page
export const metadata = {
  title: 'Politics - ZE News',
  description: 'Stay informed with the latest political news, analysis, and developments from local to international levels.',
  keywords: 'politics, elections, government, policy, political analysis, voting, democracy',
};

function CategoryHeader() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <Globe2 className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Politics
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-6">
            Stay informed with the latest political news, analysis, and developments 
            from local to international levels.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Vote className="h-3 w-3" />
              Elections
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Scale className="h-3 w-3" />
              Policy
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              Government
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

export default function PoliticsPage() {
  return (
    <div className="min-h-screen bg-background">
      <CategoryHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Globe2 className="h-5 w-5 text-blue-600" />
                Political Coverage
              </h2>
              <p className="text-muted-foreground mb-4">
                From local elections to international affairs, we provide comprehensive 
                political analysis and breaking news coverage.
              </p>
            </CardContent>
          </Card>
        </div>

        <Suspense fallback={<LoadingSkeleton />}>
          <CategoryPageClient category="politics" />
        </Suspense>

        <div className="mt-12 text-center">
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">Political Coverage Areas</h3>
              <div className="grid md:grid-cols-4 gap-4 mt-4">
                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Vote className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-medium">Elections</h4>
                  <p className="text-sm text-muted-foreground">Campaign coverage and election analysis</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Scale className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-medium">Policy</h4>
                  <p className="text-sm text-muted-foreground">Government policies and legislation</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-medium">Government</h4>
                  <p className="text-sm text-muted-foreground">Government actions and decisions</p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 dark:bg-orange-900/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Globe2 className="h-6 w-6 text-orange-600" />
                  </div>
                  <h4 className="font-medium">International</h4>
                  <p className="text-sm text-muted-foreground">Global politics and diplomacy</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
