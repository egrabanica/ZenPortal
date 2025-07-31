'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AuthService } from '@/lib/auth';
import { ArticleService } from '@/lib/articles';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useToast } from '@/hooks/use-toast';

export default function DatabaseTest() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const addResult = (test: string, status: 'success' | 'error' | 'info', message: string, data?: any) => {
    setResults(prev => [...prev, { test, status, message, data, timestamp: new Date().toISOString() }]);
  };

  const runDiagnostics = async () => {
    setResults([]);
    setLoading(true);

    try {
      // Test 1: Authentication
      addResult('Authentication', 'info', 'Testing authentication...');
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (user) {
          addResult('Authentication', 'success', `Authenticated as: ${user.email}`, { userId: user.id });
        } else {
          addResult('Authentication', 'error', 'No authenticated user');
          return;
        }
      } catch (error: any) {
        addResult('Authentication', 'error', `Auth error: ${error.message}`);
        return;
      }

      // Test 2: Profile check
      addResult('Profile', 'info', 'Checking user profile...');
      try {
        const profile = await AuthService.getCurrentProfile();
        if (profile) {
          addResult('Profile', 'success', `Profile found: ${profile.email} (${profile.role})`, profile);
        } else {
          addResult('Profile', 'error', 'No profile found');
        }
      } catch (error: any) {
        addResult('Profile', 'error', `Profile error: ${error.message}`);
      }

      // Test 3: Admin check
      addResult('Admin Access', 'info', 'Checking admin permissions...');
      try {
        const adminProfile = await AuthService.requireAdmin();
        addResult('Admin Access', 'success', `Admin verified: ${adminProfile.email}`, adminProfile);
      } catch (error: any) {
        addResult('Admin Access', 'error', `Admin check failed: ${error.message}`);
      }

      // Test 4: Raw database connection
      addResult('Database Connection', 'info', 'Testing raw database connection...');
      try {
        const { data, error } = await supabase.from('articles').select('count').limit(1);
        if (error) throw error;
        addResult('Database Connection', 'success', 'Database connection successful');
      } catch (error: any) {
        addResult('Database Connection', 'error', `Database error: ${error.message}`);
      }

      // Test 5: Article fetching
      addResult('Article Fetching', 'info', 'Testing article fetching...');
      try {
        const articles = await ArticleService.getArticlesForAdmin();
        addResult('Article Fetching', 'success', `Found ${articles.length} articles`, articles.slice(0, 3));
      } catch (error: any) {
        addResult('Article Fetching', 'error', `Article fetch error: ${error.message}`);
      }

      // Test 6: Test article creation
      addResult('Article Creation Test', 'info', 'Testing article creation...');
      try {
        const testArticle = {
          title: 'Test Article ' + Date.now(),
          content: 'This is a test article content for diagnostics.',
          categories: ['general'],
          slug: 'test-article-' + Date.now(),
          excerpt: 'Test excerpt',
          author_id: (await supabase.auth.getUser()).data.user?.id || '',
          author_name: 'Test Author',
          status: 'draft' as const,
          media_url: null,
          media_type: null,
        };

        const createdArticle = await ArticleService.createArticle(testArticle);
        addResult('Article Creation Test', 'success', 'Test article created successfully', createdArticle);

        // Test 7: Test article deletion
        addResult('Article Deletion Test', 'info', 'Testing article deletion...');
        try {
          await ArticleService.deleteArticle(createdArticle.id);
          addResult('Article Deletion Test', 'success', 'Test article deleted successfully');
        } catch (deleteError: any) {
          addResult('Article Deletion Test', 'error', `Delete error: ${deleteError.message}`);
        }

      } catch (createError: any) {
        addResult('Article Creation Test', 'error', `Create error: ${createError.message}`);
      }

      // Test 8: RLS Policy test
      addResult('RLS Policy Test', 'info', 'Testing Row Level Security policies...');
      try {
        const { data, error } = await supabase.rpc('get_rls_policies', { table_name: 'articles' });
        if (error) {
          addResult('RLS Policy Test', 'error', `RLS query error: ${error.message}`);
        } else {
          addResult('RLS Policy Test', 'info', 'RLS policies retrieved', data);
        }
      } catch (error: any) {
        addResult('RLS Policy Test', 'error', `RLS test error: ${error.message}`);
      }

    } catch (error: any) {
      addResult('General Error', 'error', `Unexpected error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Supabase Database Diagnostics</CardTitle>
          <p className="text-muted-foreground">
            This tool will test your Supabase connection, authentication, and database operations.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button onClick={runDiagnostics} disabled={loading}>
              {loading ? 'Running Diagnostics...' : 'Run Diagnostics'}
            </Button>

            {results.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Results:</h3>
                {results.map((result, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start gap-3">
                      <Badge className={getStatusColor(result.status)}>
                        {result.status}
                      </Badge>
                      <div className="flex-1">
                        <h4 className="font-medium">{result.test}</h4>
                        <p className="text-sm text-muted-foreground">{result.message}</p>
                        {result.data && (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-sm text-blue-600">
                              View Details
                            </summary>
                            <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                              {JSON.stringify(result.data, null, 2)}
                            </pre>
                          </details>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
