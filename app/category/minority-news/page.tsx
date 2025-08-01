import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Heart, Megaphone, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { CategoryPageClient } from '@/components/category/category-page-client';

// Metadata for the page
export const metadata = {
  title: 'Minority News - ZE News',
  description: 'Stay informed with the latest news and stories from minority communities and perspectives.',
  keywords: 'minority news, diversity, inclusion, community voices, ethnic communities, social justice',
};

function CategoryHeader() {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <Users className="h-12 w-12 text-purple-600 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Minority News
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-6">
            Stay informed with the latest news and stories from minority communities 
            and diverse perspectives that matter.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              Community
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Megaphone className="h-3 w-3" />
              Voices
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              Stories
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

export default function MinorityNewsPage() {
  return (
    <div className="min-h-screen bg-background">
      <CategoryHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Diverse Community Coverage
              </h2>
              <p className="text-muted-foreground mb-4">
                Amplifying voices from minority communities and sharing stories that promote 
                understanding, diversity, and inclusion.
              </p>
            </CardContent>
          </Card>
        </div>

        <Suspense fallback={<LoadingSkeleton />}>
          <CategoryPageClient category="minority-news" />
        </Suspense>

        <div className="mt-12 text-center">
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">Our Focus Areas</h3>
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Heart className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-medium">Community Stories</h4>
                  <p className="text-sm text-muted-foreground">Personal experiences and community highlights</p>
                </div>
                <div className="text-center">
                  <div className="bg-pink-100 dark:bg-pink-900/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Megaphone className="h-6 w-6 text-pink-600" />
                  </div>
                  <h4 className="font-medium">Advocacy & Rights</h4>
                  <p className="text-sm text-muted-foreground">Social justice and equality initiatives</p>
                </div>
                <div className="text-center">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <BookOpen className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h4 className="font-medium">Cultural Heritage</h4>
                  <p className="text-sm text-muted-foreground">Celebrating traditions and cultural diversity</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
