import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { CategoryPageClient } from '@/components/category/category-page-client';

// Metadata for the page
export const metadata = {
  title: 'FactCheck Response - ZE News',
  description: 'Our responses to fact-check requests, providing verified information and corrections to misinformation.',
  keywords: 'fact check response, verified information, debunked claims, investigation results, clarifications',
};

function CategoryHeader() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <MessageSquare className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              FactCheck Response
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-6">
            Our responses to fact-check requests from the community. We investigate claims, 
            verify information, and provide clear, evidence-based answers.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Verified
            </Badge>
            <Badge variant="destructive" className="flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              Debunked
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Under Investigation
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

export default function FactCheckResponsePage() {
  return (
    <div className="min-h-screen bg-background">
      <CategoryHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Submit a Fact-Check Request
              </h2>
              <p className="text-muted-foreground mb-4">
                Have a claim you'd like us to investigate? Send us the details and we'll research it thoroughly.
              </p>
              <Button asChild>
                <Link href="/fact-check">Submit Request</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Suspense fallback={<LoadingSkeleton />}>
          <CategoryPageClient category="factcheck-response" />
        </Suspense>

        <div className="mt-12 text-center">
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">Our Fact-Checking Process</h3>
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <MessageSquare className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-medium">1. Request Received</h4>
                  <p className="text-sm text-muted-foreground">We receive and review your fact-check request</p>
                </div>
                <div className="text-center">
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h4 className="font-medium">2. Investigation</h4>
                  <p className="text-sm text-muted-foreground">Our team researches and verifies the claim</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-medium">3. Response Published</h4>
                  <p className="text-sm text-muted-foreground">We publish our findings with sources</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
