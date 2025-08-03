import { ArticleServerService as ArticleService } from '@/lib/articles-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const status = searchParams.get('status') || 'published';

    let articles;

    if (search) {
      // Handle search functionality
      const limitNum = limit ? parseInt(limit) : 10;
      const offsetNum = offset ? parseInt(offset) : 0;
      articles = await ArticleService.searchArticles(search, limitNum, offsetNum);
    } else if (category) {
      const limitNum = limit ? parseInt(limit) : 50;
      const offsetNum = offset ? parseInt(offset) : 0;
      
      // All categories, including 'home', now require the specific category to be in the article's categories array
      // This means articles will only appear on the homepage if they have 'home' in their categories
      articles = await ArticleService.getPublishedArticlesByCategory(category, limitNum, offsetNum);
    } else {
      const limitNum = limit ? parseInt(limit) : 10;
      const offsetNum = offset ? parseInt(offset) : 0;
      articles = await ArticleService.getLatestArticles(limitNum, offsetNum);
    }

    // Filter by status if needed
    const filteredArticles = articles.filter(article => article.status === status);

    // Add cache control headers to prevent caching issues
    const response = NextResponse.json(filteredArticles);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error: any) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin authorization using server-side auth
    const { AuthServerService } = await import('@/lib/auth-server');
    await AuthServerService.requireAdmin();
    
    const articleData = await request.json();
    console.log('📝 API: Creating article with categories:', articleData.categories);
    
    const createdArticle = await ArticleService.createArticle(articleData);
    
    console.log('✅ API: Article created successfully:', {
      id: createdArticle.id,
      title: createdArticle.title,
      categories: createdArticle.categories,
      status: createdArticle.status
    });
    
    return NextResponse.json(createdArticle, { status: 201 });
  } catch (error: any) {
    console.error('❌ Error creating article:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create article' },
      { status: error.message?.includes('Admin') ? 403 : 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { error: 'Article ID is required for deletion' },
        { status: 400 }
      );
    }
    await ArticleService.deleteArticle(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}
