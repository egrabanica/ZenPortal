import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, Search, FileCheck, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { CategoryPageClient } from '@/components/category/category-page-client';

// Metadata for the page
export const metadata = {
  title: 'Fact Check - ZE News',
  description: 'Verifying claims, debunking misinformation, and providing accurate information with evidence-based reporting.',
  keywords: 'fact check, verification, misinformation, truth, evidence, investigation',
};

function CategoryHeader() {
  return (
    <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-green-600 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Fact Check
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-6">
            Verifying claims, debunking misinformation, and providing accurate 
            information with evidence-based reporting.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Search className="h-3 w-3" />
              Investigation
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <FileCheck className="h-3 w-3" />
              Verification
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Truth
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

export default function FactCheckPage() {
  return (
    <div className="min-h-screen bg-background">
      <CategoryHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Truth and Verification
              </h2>
              <p className="text-muted-foreground mb-4">
                In an age of misinformation, we investigate claims, verify facts, and 
                provide evidence-based reporting to help you understand the truth.
              </p>
              <Button asChild>
                <Link href="/fact-check">Request Fact Check</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Suspense fallback={<LoadingSkeleton />}>
          <CategoryPageClient category="fact-check" />
        </Suspense>

        <div className="mt-12 text-center">
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">Our Fact-Checking Process</h3>
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Search className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-medium">Investigation</h4>
                  <p className="text-sm text-muted-foreground">Thorough research and source verification</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <FileCheck className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-medium">Verification</h4>
                  <p className="text-sm text-muted-foreground">Cross-referencing multiple reliable sources</p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 dark:bg-orange-900/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                  </div>
                  <h4 className="font-medium">Reporting</h4>
                  <p className="text-sm text-muted-foreground">Clear, evidence-based conclusions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
