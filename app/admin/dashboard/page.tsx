'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { AuthService } from '@/lib/auth';
import { ArticleService } from '@/lib/articles';
import { Article, Profile } from '@/lib/database.types';
import Link from 'next/link';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  CopyIcon, 
  EyeIcon,
  LogOutIcon,
  BarChart3Icon,
  FileTextIcon,
  UserIcon,
  GraduationCap
} from 'lucide-react';

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    archived: 0
  });
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const adminProfile = await AuthService.requireAdmin();
        setProfile(adminProfile);
        
        const data = await ArticleService.getArticlesForAdmin();
        setArticles(data);
        
        // Calculate stats
        const newStats = {
          total: data.length,
          published: data.filter(a => a.status === 'published').length,
          draft: data.filter(a => a.status === 'draft').length,
          archived: data.filter(a => a.status === 'archived').length
        };
        setStats(newStats);
      } catch (error: any) {
        toast({
          title: 'Access Denied',
          description: error.message || 'You must be an admin to access this page.',
          variant: 'destructive',
        });
        router.push('/admin/signin');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, toast]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) return;

    try {
      console.log('🗑️ Deleting article via API:', id);
      
      // Use the API endpoint instead of direct service call
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete article');
      }

      console.log('✅ Article deleted successfully via API');
      
      // Refresh articles to get updated data
      const data = await ArticleService.getArticlesForAdmin();
      setArticles(data);
      
      // Update stats
      const newStats = {
        total: data.length,
        published: data.filter(a => a.status === 'published').length,
        draft: data.filter(a => a.status === 'draft').length,
        archived: data.filter(a => a.status === 'archived').length
      };
      setStats(newStats);
      
      toast({
        title: 'Success',
        description: 'Article deleted successfully.',
      });
    } catch (error: any) {
      console.error('❌ Error deleting article:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleRepost = async (id: string) => {
    try {
      await ArticleService.duplicateArticle(id);
      // Refresh articles
      const data = await ArticleService.getArticlesForAdmin();
      setArticles(data);
      toast({
        title: 'Success',
        description: 'Article duplicated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await AuthService.signOut();
      
      toast({
        title: 'Success',
        description: 'You have been signed out successfully.',
      });
      
      // Force a hard redirect to clear all state
      window.location.href = '/';
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      published: 'default' as const,
      draft: 'secondary' as const,
      archived: 'outline' as const
    };
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <Badge variant="outline">ZenNews CMS</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-4 w-4" />
                <span className="text-sm text-muted-foreground">
                  {profile?.full_name || profile?.email}
                </span>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">View Site</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOutIcon className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Articles</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <EyeIcon className="h-4 w-4 text-green-600" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">Published</p>
                  <p className="text-2xl font-bold text-green-600">{stats.published}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <PencilIcon className="h-4 w-4 text-yellow-600" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">Drafts</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <TrashIcon className="h-4 w-4 text-red-600" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">Archived</p>
                  <p className="text-2xl font-bold text-red-600">{stats.archived}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Articles Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Article Management</CardTitle>
                <Button asChild>
                  <Link href="/admin/articles/new">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    New Article
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Create, edit, and manage news articles. Track drafts and published content.
              </p>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/articles/new">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    New Article
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Course Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Course Management</CardTitle>
                <Button asChild>
                  <Link href="/courses/admin">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Manage Courses
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Create and manage educational courses with video modules for your audience.
              </p>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/courses/admin">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Create Course
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/courses">
                    View Courses
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Articles Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Recent Articles</CardTitle>
              <Button asChild variant="outline">
                <Link href="/admin/articles/new">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  New Article
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {articles.length === 0 ? (
              <div className="text-center py-8">
                <FileTextIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No articles found</p>
                <Button asChild>
                  <Link href="/admin/articles/new">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create your first article
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Title</th>
                      <th className="text-left py-3 px-4 font-medium">Categories</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Created</th>
                      <th className="text-right py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((article) => (
                      <tr key={article.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div>
                            <h3 className="font-medium">{article.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {article.excerpt}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {article.categories.slice(0, 2).map((category) => (
                              <Badge key={category} variant="outline" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                            {article.categories.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{article.categories.length - 2}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(article.status)}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {new Date(article.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                            >
                              <Link href={`/admin/articles/edit/${article.id}`}>
                                <PencilIcon className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRepost(article.id)}
                            >
                              <CopyIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(article.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
