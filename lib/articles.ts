import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database, Article, ArticleInsert, ArticleUpdate } from './database.types';

const supabase = createClientComponentClient<Database>();

export class ArticleService {
  // Create a new article
  static async createArticle(article: ArticleInsert): Promise<Article> {
    console.log('📝 ArticleService.createArticle called with:', {
      ...article,
      content: article.content?.substring(0, 100) + '...'
    });

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

  // Update an existing article
  static async updateArticle(id: string, updates: ArticleUpdate): Promise<Article> {
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

  // Delete an article (permanent delete)
  static async deleteArticle(id: string): Promise<void> {
    const { error } = await supabase
      .from('articles')
      .delete()
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
    console.log(`🔍 Fetching articles for category: '${category}'`);
    
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
  static async getLatestArticles(limit: number = 10, offset: number = 0): Promise<Article[]> {
    console.log(`📰 Fetching latest articles (limit: ${limit}, offset: ${offset})`);
    
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
