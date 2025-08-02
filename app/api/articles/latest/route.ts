import { ArticleServerService } from '@/lib/articles-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const articles = await ArticleServerService.getLatestArticles(limit, offset);
    
    const response = NextResponse.json(articles);
    
    // Disable caching to ensure fresh data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error: any) {
    console.error('Error fetching latest articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch latest articles' },
      { status: 500 }
    );
  }
}
