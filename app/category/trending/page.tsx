import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Megaphone, Users, Vote, Calendar, Target } from 'lucide-react';
import Link from 'next/link';
import { CategoryPageClient } from '@/components/category/category-page-client';

// Metadata for the page
export const metadata = {
  title: 'Campaign News - ZE News',
  description: 'Stay informed about the latest political campaigns, election coverage, and campaign developments.',
  keywords: 'campaign news, political campaigns, elections, campaign coverage, political news, campaign updates',
};

function CategoryHeader() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <Megaphone className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Campaign News
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-6">
            Stay informed about the latest political campaigns, election coverage, and campaign developments.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Vote className="h-3 w-3" />
              Elections
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              Candidates
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              Campaign Trail
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

export default function TrendingPage() {
  return (
    <div className="min-h-screen bg-background">
      <CategoryHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-blue-600" />
                Campaign Coverage
              </h2>
              <p className="text-muted-foreground mb-4">
                Comprehensive coverage of political campaigns, from candidate announcements to 
                election results and everything in between.
              </p>
            </CardContent>
          </Card>
        </div>

        <Suspense fallback={<LoadingSkeleton />}>
          <CategoryPageClient category="campaign" />
        </Suspense>

        <div className="mt-12 text-center">
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">Campaign Coverage Areas</h3>
              <div className="grid md:grid-cols-4 gap-4 mt-4">
                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Vote className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-medium">Elections</h4>
                  <p className="text-sm text-muted-foreground">Election coverage and results</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-medium">Candidates</h4>
                  <p className="text-sm text-muted-foreground">Candidate profiles and updates</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-medium">Campaign Trail</h4>
                  <p className="text-sm text-muted-foreground">Campaign events and rallies</p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 dark:bg-orange-900/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Calendar className="h-6 w-6 text-orange-600" />
                  </div>
                  <h4 className="font-medium">Schedule</h4>
                  <p className="text-sm text-muted-foreground">Important campaign dates</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
