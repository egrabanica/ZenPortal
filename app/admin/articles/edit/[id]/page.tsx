'use client';

import { useState, useEffect } from 'react';
import { getMediaTypeFromFile, getMediaTypeFromUrl } from '@/lib/media-utils';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AuthService } from '@/lib/auth';
import { ArticleService } from '@/lib/articles';
import { StorageService } from '@/lib/storage';
import { getAllCategoryOptions, Article } from '@/lib/database.types';
import RichEditor from '@/components/ui/rich-editor';
import { MediaInput } from '@/components/ui/media-input';
import { MultiSelect } from '@/components/ui/multi-select';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { ArrowLeft, Upload, Save, Eye } from 'lucide-react';

export default function EditArticle() {
  const [article, setArticle] = useState<Article | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [authorName, setAuthorName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [publishStatus, setPublishStatus] = useState<'draft' | 'published'>('draft');
  const router = useRouter();
  const { toast } = useToast();
  const { id } = useParams();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // First check admin access
        await AuthService.requireAdmin();
        setIsAdmin(true);
        
        const fetchedArticle = await ArticleService.getArticleById(id as string);
        if (fetchedArticle) {
          setArticle(fetchedArticle);
          setTitle(fetchedArticle.title);
          setContent(fetchedArticle.content);
          setCategories(fetchedArticle.categories);
          setMediaUrl(fetchedArticle.media_url || '');
          setAuthorName(fetchedArticle.author_name || '');
          setPublishStatus(fetchedArticle.status as any);
        }
      } catch (error: any) {
        console.error('Failed to fetch article', error);
        toast({
          title: 'Access Denied',
          description: error.message || 'You must be an admin to access this page.',
          variant: 'destructive',
        });
        router.push('/admin/signin');
      }
    };
    fetchArticle();
  }, [id, router, toast]);

  const handleSave = async () => {
    if (!article) return;

    setLoading(true);

    try {
      const slug = ArticleService.generateSlug(title);
      const excerpt = ArticleService.generateExcerpt(content);

      let finalMediaUrl = mediaUrl;

      if (mediaFile) {
        finalMediaUrl = await StorageService.uploadFile(mediaFile);
      }

      const updatedArticle = {
        title,
        content,
        categories,
        media_url: finalMediaUrl,
        media_type: mediaFile ? getMediaTypeFromFile(mediaFile) : (mediaUrl ? getMediaTypeFromUrl(mediaUrl) : null),
        author_name: authorName,
        slug,
        excerpt,
        status: publishStatus,
      };

      console.log('🔄 Updating article via API:', {
        id: article.id,
        categories: updatedArticle.categories,
        status: updatedArticle.status
      });

      // Use the API endpoint instead of direct service call
      const response = await fetch(`/api/articles/${article.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedArticle),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update article');
      }

      const result = await response.json();
      console.log('✅ Article updated successfully via API:', result);

      toast({
        title: 'Success',
        description: 'Article updated successfully.',
      });

      router.push('/admin/dashboard');
    } catch (error: any) {
      console.error('❌ Error updating article:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto">
        <Link href="/admin/dashboard" className="text-sm text-muted-foreground hover:underline flex items-center gap-2 mb-4">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>Edit Article</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter article title"
                />
              </div>

              <RichEditor
                label="Content"
                value={content}
                onChange={setContent}
              />

              <MediaInput
                label="Media"
                file={mediaFile}
                url={mediaUrl}
                onFileChange={setMediaFile}
                onUrlChange={setMediaUrl}
              />

              <MultiSelect
                label="Categories"
                options={getAllCategoryOptions()}
                selected={categories}
                onChange={setCategories}
              />

              <div className="space-y-2">
                <Label>Author</Label>
                <Input
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Enter author name"
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={publishStatus} onValueChange={(value) => setPublishStatus(value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Set status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
