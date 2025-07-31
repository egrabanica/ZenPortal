'use client';

import { useState, useEffect } from 'react';
import { getMediaTypeFromFile, getMediaTypeFromUrl } from '@/lib/media-utils';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AuthService } from '@/lib/auth';
import { ArticleService } from '@/lib/articles';
import { StorageService } from '@/lib/storage';
import { getAllCategoryOptions } from '@/lib/database.types';
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

export default function NewArticle() {
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

  // Check admin access on component mount
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const adminProfile = await AuthService.requireAdmin();
        setIsAdmin(true);
        // Set default author name from the logged-in admin's profile
        if (adminProfile.full_name) {
          setAuthorName(adminProfile.full_name);
        } else {
          setAuthorName(adminProfile.email);
        }
      } catch (error: any) {
        toast({
          title: 'Access Denied',
          description: error.message || 'You must be an admin to access this page.',
          variant: 'destructive',
        });
        router.push('/admin/signin');
      }
    };

    checkAdminAccess();
  }, [router, toast]);

  const handleFileChange = (file: File | null) => {
    setMediaFile(file);
    // Clear URL when file is selected
    if (file) {
      setMediaUrl('');
    }
  };

  const handleUrlChange = (url: string) => {
    setMediaUrl(url);
    // Clear file when URL is entered
    if (url) {
      setMediaFile(null);
    }
  };

  const handleSave = async () => {
    console.log('🚀 Starting article save process...');
    console.log('Form data:', { title, content: content.substring(0, 100) + '...', categories, publishStatus, authorName });
    
    if (!title.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Title is required.',
        variant: 'destructive',
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Content is required.',
        variant: 'destructive',
      });
      return;
    }

    if (categories.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'At least one category must be selected.',
        variant: 'destructive',
      });
      return;
    }

    if (!authorName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Author name is required.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      console.log('✅ Validation passed, checking admin profile...');
      const adminProfile = await AuthService.requireAdmin();
      console.log('✅ Admin profile verified:', adminProfile.email);

      const slug = ArticleService.generateSlug(title);
      const excerpt = ArticleService.generateExcerpt(content);
      console.log('✅ Generated slug:', slug);
      console.log('✅ Generated excerpt:', excerpt.substring(0, 50) + '...');

      let finalMediaUrl = null;
      let mediaType: 'image' | 'video' | null = null;

      // Handle media URL (skip file upload for now to isolate the issue)
      if (mediaUrl && !mediaFile) {
        console.log('📷 Using provided media URL:', mediaUrl);
        finalMediaUrl = mediaUrl;
        mediaType = getMediaTypeFromUrl(mediaUrl);
      } else if (mediaFile) {
        console.log('📁 File upload requested, attempting upload...');
        try {
          finalMediaUrl = await StorageService.uploadFile(mediaFile);
          mediaType = getMediaTypeFromFile(mediaFile);
          console.log('✅ File uploaded successfully:', finalMediaUrl);
        } catch (uploadError: any) {
          console.error('❌ Upload failed:', uploadError);
          toast({
            title: 'Upload Error',
            description: uploadError.message + ' - Article will be saved without media.',
            variant: 'destructive',
          });
          // Continue without media instead of failing completely
          finalMediaUrl = null;
          mediaType = null;
        }
      }

      const newArticle = {
        title: title.trim(),
        content: content.trim(),
        categories,
        media_url: finalMediaUrl,
        media_type: mediaType,
        slug,
        excerpt,
        author_id: adminProfile.id,
        author_name: authorName.trim(),
        status: publishStatus,
      };

      console.log('📝 Creating article with data:', {
        ...newArticle,
        content: newArticle.content.substring(0, 100) + '...'
      });

      const createdArticle = await ArticleService.createArticle(newArticle);
      console.log('✅ Article created successfully:', createdArticle.id);

      toast({
        title: 'Success',
        description: publishStatus === 'published' 
          ? 'Article published successfully!' 
          : 'Article saved as draft.',
      });

      // Small delay before redirect to ensure the toast is visible
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 1000);
    } catch (error: any) {
      console.error('💥 Article creation failed:', {
        message: error.message,
        stack: error.stack,
        error
      });
      
      toast({
        title: 'Error',
        description: `Failed to ${publishStatus === 'published' ? 'publish' : 'save'} article: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Don't render the form if user is not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Checking access...</h2>
          <p className="text-muted-foreground">Please wait while we verify your permissions.</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto">
        <Link href="/admin/dashboard" className="text-sm text-muted-foreground hover:underline flex items-center gap-2 mb-4">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>Create New Article</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter article title"
                  required
                />
              </div>

              <RichEditor
                label="Content"
                value={content}
                onChange={setContent}
                placeholder="Write your article content here..."
              />

              <MediaInput
                label="Media (Image or Video)"
                file={mediaFile}
                url={mediaUrl}
                onFileChange={handleFileChange}
                onUrlChange={handleUrlChange}
              />

              <MultiSelect
                label="Categories"
                options={getAllCategoryOptions()}
                selected={categories}
                onChange={setCategories}
                placeholder="Select categories..."
              />

              <div className="space-y-2">
                <Label>Author</Label>
                <Input
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Enter author name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={publishStatus} onValueChange={(value) => setPublishStatus(value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Set status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">
                      <div className="flex items-center gap-2">
                        <Save size={16} />
                        <span>Draft</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="published">
                      <div className="flex items-center gap-2">
                        <Eye size={16} />
                        <span>Published</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={loading} className="w-full sm:w-auto">
                  {loading ? (
                    publishStatus === 'published' ? 'Publishing...' : 'Saving...'
                  ) : (
                    publishStatus === 'published' ? 'Publish Article' : 'Save as Draft'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
