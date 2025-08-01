'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { AuthService } from '@/lib/auth';
import { useState, useEffect } from 'react';

export function useArticleActions() {
  const { toast } = useToast();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        await AuthService.requireAdmin();
        setIsAdmin(true);
      } catch (error) {
        setIsAdmin(false);
      }
    };
    checkAdminStatus();
  }, []);

  const handleEdit = (articleId: string) => {
    if (!isAdmin) {
      toast({
        title: 'Access Denied',
        description: 'You must be an admin to edit articles.',
        variant: 'destructive',
      });
      return;
    }
    router.push(`/admin/articles/edit/${articleId}`);
  };

  const handleDelete = async (articleId: string, onSuccess?: () => void) => {
    if (!isAdmin) {
      toast({
        title: 'Access Denied',
        description: 'You must be an admin to delete articles.',
        variant: 'destructive',
      });
      return;
    }

    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return;
    }

    try {
      console.log('🗑️ Deleting article via API:', articleId);
      
      const response = await fetch(`/api/articles/${articleId}`, {
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
      
      toast({
        title: 'Success',
        description: 'Article deleted successfully.',
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('❌ Error deleting article:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handlePublishToggle = async (
    articleId: string, 
    currentStatus: string, 
    onSuccess?: () => void
  ) => {
    if (!isAdmin) {
      toast({
        title: 'Access Denied',
        description: 'You must be an admin to publish/unpublish articles.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      console.log(`🔄 Toggling article status from ${currentStatus} to ${newStatus}:`, articleId);
      
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update article status');
      }

      console.log('✅ Article status updated successfully via API');
      
      toast({
        title: 'Success',
        description: `Article ${newStatus === 'published' ? 'published' : 'unpublished'} successfully.`,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('❌ Error updating article status:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDuplicate = async (articleId: string, onSuccess?: () => void) => {
    if (!isAdmin) {
      toast({
        title: 'Access Denied',
        description: 'You must be an admin to duplicate articles.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { ArticleService } = await import('@/lib/articles');
      await ArticleService.duplicateArticle(articleId);
      
      toast({
        title: 'Success',
        description: 'Article duplicated successfully.',
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return {
    isAdmin,
    handleEdit,
    handleDelete,
    handlePublishToggle,
    handleDuplicate,
  };
}
