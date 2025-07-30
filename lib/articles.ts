import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database, Article, ArticleInsert, ArticleUpdate } from './database.types';

const supabase = createClientComponentClient<Database>();

export class ArticleService {
  // Create a new article
  static async createArticle(article: ArticleInsert): Promise<Article> {
    const { data, error } = await supabase
      .from('articles')
      .insert({
        ...article,
        updated_at: new Date().toISOString(),
        published_at: article.status === 'published' ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update an existing article
  static async updateArticle(id: string, updates: ArticleUpdate): Promise<Article> {
    const { data, error } = await supabase
      .from('articles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
        published_at: updates.status === 'published' ? new Date().toISOString() : updates.published_at,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete an article (soft delete by setting status to archived)
  static async deleteArticle(id: string): Promise<void> {
    const { error } = await supabase
      .from('articles')
      .update({ 
        status: 'archived',
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) throw error;
  }

  // Hard delete an article
  static async hardDeleteArticle(id: string): Promise<void> {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Get all articles for admin
  static async getArticlesForAdmin(): Promise<Article[]> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get published articles by category
  static async getPublishedArticlesByCategory(category: string): Promise<Article[]> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .contains('categories', [category])
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get featured articles
  static async getFeaturedArticles(): Promise<Article[]> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .eq('featured', true)
      .order('published_at', { ascending: false })
      .limit(5);

    if (error) throw error;
    return data || [];
  }

  // Get latest articles
  static async getLatestArticles(limit: number = 10): Promise<Article[]> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  // Get article by slug
  static async getArticleBySlug(slug: string): Promise<Article | null> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) return null;
    return data;
  }

  // Get article by ID
  static async getArticleById(id: string): Promise<Article | null> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }

  // Search articles
  static async searchArticles(query: string): Promise<Article[]> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Duplicate article (for repost functionality)
  static async duplicateArticle(id: string): Promise<Article> {
    const { data: originalArticle, error: fetchError } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Create a new article with copied data
    const duplicatedArticle = {
      ...originalArticle,
      id: undefined, // Let the database generate a new ID
      title: `${originalArticle.title} (Copy)`,
      slug: `${originalArticle.slug}-copy-${Date.now()}`,
      status: 'draft' as const,
      created_at: undefined,
      updated_at: undefined,
      published_at: null,
    };

    return this.createArticle(duplicatedArticle);
  }

  // Generate slug from title
  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim('-'); // Remove leading/trailing hyphens
  }

  // Generate excerpt from content
  static generateExcerpt(content: string, maxLength: number = 160): string {
    const plainText = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength).trim() + '...'
      : plainText;
  }
}
