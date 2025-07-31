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

// Category structure with subcategories
export const CATEGORY_STRUCTURE = {
  'home': {
    label: 'Home',
    subcategories: ['breaking', 'featured', 'trending', 'latest']
  },
  'politics': {
    label: 'Politics',
    subcategories: ['local', 'national', 'international', 'elections', 'policy']
  },
  'minority-news': {
    label: 'Minority News',
    subcategories: ['civil-rights', 'community', 'representation', 'equality', 'diversity']
  },
  'local-news': {
    label: 'Local News',
    subcategories: ['city', 'county', 'state', 'community', 'government', 'events']
  },
  'feminist': {
    label: 'Feminist',
    subcategories: ['rights', 'equality', 'workplace', 'politics', 'culture', 'activism']
  },
  'fact-check': {
    label: 'Fact Check',
    subcategories: ['politics', 'health', 'science', 'social-media', 'misinformation']
  },
  'factcheck-response': {
    label: 'FactCheck Response',
    subcategories: ['verified', 'debunked', 'investigation', 'follow-up', 'clarification']
  },
  'general': {
    label: 'General',
    subcategories: ['breaking', 'featured', 'trending', 'latest']
  }
} as const;

// Flat array for backwards compatibility
export const CATEGORIES = Object.keys(CATEGORY_STRUCTURE) as (keyof typeof CATEGORY_STRUCTURE)[];

// Get all categories including subcategories
export const getAllCategoryOptions = (): string[] => {
  const options: string[] = [];
  
  Object.entries(CATEGORY_STRUCTURE).forEach(([mainCategory, config]) => {
    // Add main category
    options.push(mainCategory);
    
    // Add subcategories with parent prefix
    config.subcategories.forEach(subcat => {
      options.push(`${mainCategory}:${subcat}`);
    });
  });
  
  return options;
};

export type CategoryType = typeof CATEGORIES[number];
export type CategoryStructure = typeof CATEGORY_STRUCTURE;
