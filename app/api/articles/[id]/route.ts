import { ArticleServerService as ArticleService } from '@/lib/articles-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const article = await ArticleService.getArticleById(id);
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error: any) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authorization using server-side auth
    const { AuthServerService } = await import('@/lib/auth-server');
    await AuthServerService.requireAdmin();
    
    const { id } = await params;
    const updates = await request.json();
    
    console.log('📝 Updating article:', id, 'with data:', {
      ...updates,
      content: updates.content?.substring(0, 100) + '...'
    });
    
    const updatedArticle = await ArticleService.updateArticle(id, updates);
    
    console.log('✅ Article updated successfully:', {
      id: updatedArticle.id,
      title: updatedArticle.title,
      status: updatedArticle.status,
      categories: updatedArticle.categories
    });
    
    return NextResponse.json(updatedArticle);
  } catch (error: any) {
    console.error('❌ Error updating article:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update article' },
      { status: error.message?.includes('Admin') ? 403 : 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authorization using server-side auth
    const { AuthServerService } = await import('@/lib/auth-server');
    await AuthServerService.requireAdmin();
    
    const { id } = await params;
    const updates = await request.json();
    
    console.log('🔄 Patching article:', id, 'with updates:', updates);
    
    const updatedArticle = await ArticleService.updateArticle(id, updates);
    
    console.log('✅ Article patched successfully:', {
      id: updatedArticle.id,
      title: updatedArticle.title,
      status: updatedArticle.status
    });
    
    return NextResponse.json(updatedArticle);
  } catch (error: any) {
    console.error('❌ Error patching article:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to patch article' },
      { status: error.message?.includes('Admin') ? 403 : 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authorization using server-side auth
    const { AuthServerService } = await import('@/lib/auth-server');
    await AuthServerService.requireAdmin();
    
    const { id } = await params;
    
    console.log('🗑️ Deleting article:', id);
    
    await ArticleService.deleteArticle(id);
    
    console.log('✅ Article deleted successfully:', id);
    
    const response = NextResponse.json({ success: true, message: 'Article deleted successfully' });
    
    // Add cache control headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error: any) {
    console.error('❌ Error deleting article:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete article' },
      { status: error.message?.includes('Admin') ? 403 : 500 }
    );
  }
}
