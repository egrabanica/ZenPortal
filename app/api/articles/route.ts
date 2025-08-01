import { ArticleServerService as ArticleService } from '@/lib/articles-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'published';

    let articles;

    if (category) {
      articles = await ArticleService.getPublishedArticlesByCategory(category);
    } else {
      const limitNum = limit ? parseInt(limit) : 10;
      articles = await ArticleService.getLatestArticles(limitNum);
    }

    // Filter by status if needed
    const filteredArticles = articles.filter(article => article.status === status);

    return NextResponse.json(filteredArticles);
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
