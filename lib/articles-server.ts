import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database, Article, ArticleInsert, ArticleUpdate } from './database.types';

export class ArticleServerService {
  // Get server-side Supabase client
  static async getSupabaseClient() {
    const cookieStore = await cookies();
    return createRouteHandlerClient<Database>({ cookies: () => cookieStore });
  }

  // Create a new article (server-side)
  static async createArticle(article: ArticleInsert): Promise<Article> {
    console.log('📝 ArticleServerService.createArticle called with:', {
      ...article,
      content: article.content?.substring(0, 100) + '...'
    });

    const supabase = await this.getSupabaseClient();

    const articleData = {
      ...article,
      updated_at: new Date().toISOString(),
      published_at: article.status === 'published' ? new Date().toISOString() : null,
    };

    console.log('📝 Final article data to insert:', {
      ...articleData,
      content: articleData.content?.substring(0, 100) + '...'
    });

    const { data, error } = await supabase
      .from('articles')
      .insert(articleData)
      .select()
      .single();

    if (error) {
      console.error('❌ Article creation failed:', error);
      throw error;
    }
    
    console.log('✅ Article created successfully:', {
      id: data.id,
      title: data.title,
      status: data.status,
      published_at: data.published_at
    });
    
    return data;
  }

  // Update an existing article (server-side)
  static async updateArticle(id: string, updates: ArticleUpdate): Promise<Article> {
    const supabase = await this.getSupabaseClient();

    // Get the current article to check its status
    const { data: currentArticle } = await supabase
      .from('articles')
      .select('status, published_at')
      .eq('id', id)
      .single();

    let publishedAt = updates.published_at;
    
    // If we're changing status to published and it wasn't published before, set published_at
    if (updates.status === 'published' && currentArticle?.status !== 'published') {
      publishedAt = new Date().toISOString();
    }
    // If we're changing from published to draft, clear published_at
    else if (updates.status === 'draft' && currentArticle?.status === 'published') {
      publishedAt = null;
    }
    // If already published and staying published, keep the original published_at
    else if (updates.status === 'published' && currentArticle?.status === 'published') {
      publishedAt = currentArticle.published_at;
    }

    const { data, error } = await supabase
      .from('articles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
        published_at: publishedAt,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete an article (server-side)
  static async deleteArticle(id: string): Promise<void> {
    const supabase = await this.getSupabaseClient();

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Get all articles for admin (server-side)
  static async getArticlesForAdmin(): Promise<Article[]> {
    const supabase = await this.getSupabaseClient();

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get published articles by category (server-side)
  static async getPublishedArticlesByCategory(category: string): Promise<Article[]> {
    console.log(`🔍 Fetching articles for category: '${category}'`);
    
    const supabase = await this.getSupabaseClient();

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .contains('categories', [category])
      .order('published_at', { ascending: false });

    if (error) {
      console.error(`❌ Error fetching articles for category '${category}':`, error);
      throw error;
    }
    
    console.log(`✅ Found ${data?.length || 0} articles for category '${category}':`, 
      data?.map(a => ({
        id: a.id.substring(0, 8),
        title: a.title,
        categories: a.categories,
        status: a.status,
        published_at: a.published_at
      }))
    );
    
    return data || [];
  }

  // Get latest articles (server-side)
  static async getLatestArticles(limit: number = 10, offset: number = 0): Promise<Article[]> {
    console.log(`📰 Fetching latest articles (limit: ${limit}, offset: ${offset})`);
    
    const supabase = await this.getSupabaseClient();

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('❌ Error fetching latest articles:', error);
      throw error;
    }
    
    console.log(`✅ Found ${data?.length || 0} published articles:`, data?.map(a => ({
      id: a.id.substring(0, 8),
      title: a.title,
      status: a.status,
      published_at: a.published_at
    })));
    
    return data || [];
  }

  // Get article by ID (server-side)
  static async getArticleById(id: string): Promise<Article | null> {
    const supabase = await this.getSupabaseClient();

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }

  // Generate slug from title
  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  // Generate excerpt from content
  static generateExcerpt(content: string, maxLength: number = 160): string {
    const plainText = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength).trim() + '...'
      : plainText;
  }
}
