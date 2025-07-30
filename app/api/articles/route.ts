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
