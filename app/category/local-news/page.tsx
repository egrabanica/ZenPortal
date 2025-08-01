import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Calendar, Building, Megaphone } from 'lucide-react';
import Link from 'next/link';
import { CategoryPageClient } from '@/components/category/category-page-client';

// Metadata for the page
export const metadata = {
  title: 'Local News - ZE News',
  description: 'Your source for local community news, events, and stories that matter to your neighborhood.',
  keywords: 'local news, community, neighborhood, local events, city news, town news',
};

function CategoryHeader() {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <MapPin className="h-12 w-12 text-green-600 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Local News
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-6">
            Your source for local community news, events, and stories that matter 
            to your neighborhood.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Events
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Building className="h-3 w-3" />
              City Council
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Megaphone className="h-3 w-3" />
              Community
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

export default function LocalNewsPage() {
  return (
    <div className="min-h-screen bg-background">
      <CategoryHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                Local Community Coverage
              </h2>
              <p className="text-muted-foreground mb-4">
                Stay connected with what's happening in your community. From city council 
                meetings to local events, we keep you informed.
              </p>
            </CardContent>
          </Card>
        </div>

        <Suspense fallback={<LoadingSkeleton />}>
          <CategoryPageClient category="local-news" />
        </Suspense>

        <div className="mt-12 text-center">
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">Local Coverage Areas</h3>
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-medium">Community Events</h4>
                  <p className="text-sm text-muted-foreground">Local festivals, meetings, and activities</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-medium">City Government</h4>
                  <p className="text-sm text-muted-foreground">Council meetings and municipal updates</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Megaphone className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-medium">Community Issues</h4>
                  <p className="text-sm text-muted-foreground">Local concerns and neighborhood news</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
