import { ArticleService } from '@/lib/articles';
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
    const articleData = await request.json();
    const createdArticle = await ArticleService.createArticle(articleData);
    return NextResponse.json(createdArticle, { status: 201 });
  } catch (error: any) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
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
