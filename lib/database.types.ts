export interface Database {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string;
          title: string;
          content: string;
          excerpt: string;
          slug: string;
          categories: string[];
          media_url: string | null;
          media_type: 'image' | 'video' | null;
          status: 'draft' | 'published' | 'archived';
          featured: boolean;
          author_id: string;
          author_name?: string | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          excerpt?: string;
          slug: string;
          categories: string[];
          media_url?: string | null;
          media_type?: 'image' | 'video' | null;
          status?: 'draft' | 'published' | 'archived';
          featured?: boolean;
          author_id: string;
          author_name?: string | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          excerpt?: string;
          slug?: string;
          categories?: string[];
          media_url?: string | null;
          media_type?: 'image' | 'video' | null;
          status?: 'draft' | 'published' | 'archived';
          featured?: boolean;
          author_id?: string;
          author_name?: string | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: 'admin' | 'editor' | 'user';
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: 'admin' | 'editor' | 'user';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: 'admin' | 'editor' | 'user';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type Article = Database['public']['Tables']['articles']['Row'];
export type ArticleInsert = Database['public']['Tables']['articles']['Insert'];
export type ArticleUpdate = Database['public']['Tables']['articles']['Update'];

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

// Simplified category structure - one category per section
export const CATEGORIES = [
  'home',
  'campaign',
  'politics', 
  'minority-news',
  'local-news',
  'feminist',
  'fact-check',
  'factcheck-response'
] as const;

// Category labels for display
export const CATEGORY_LABELS = {
  'home': 'Home',
  'campaign': 'Campaign',
  'politics': 'Politics',
  'minority-news': 'Minority News', 
  'local-news': 'Local News',
  'feminist': 'Feminist',
  'fact-check': 'Fact Check',
  'factcheck-response': 'FactCheck Response'
} as const;

// Get all category options - simplified to just main categories
export const getAllCategoryOptions = (): string[] => {
  return [...CATEGORIES];
};

export type CategoryType = typeof CATEGORIES[number];
