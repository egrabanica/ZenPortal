import { ArticleServerService } from '@/lib/articles-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const articles = await ArticleServerService.getLatestArticles(limit);
    
    return NextResponse.json(articles);
  } catch (error: any) {
    console.error('Error fetching latest articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch latest articles' },
      { status: 500 }
    );
  }
}
