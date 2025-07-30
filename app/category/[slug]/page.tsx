import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArticleService } from '@/lib/articles';
import { Article } from '@/lib/database.types';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { CATEGORY_STRUCTURE } from '@/lib/database.types';

export async function generateStaticParams() {
  const categories = Object.keys(CATEGORY_STRUCTURE);
  return categories.map((slug) => ({ slug }));
}

async function CategoryArticleList({ slug }: { slug: string }) {
  const articles = await ArticleService.getPublishedArticlesByCategory(slug);

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">No articles found</h2>
        <p className="text-muted-foreground">There are no articles in this category yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article: Article) => (
        <Card key={article.id} className="overflow-hidden group">
          <Link href={`/article/${article.slug}`}>
            <div className="relative aspect-video">
              <Image 
                src={article.media_url || 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80'} 
                alt={article.title} 
                fill 
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <CardContent className="p-4">
              <Badge className="mb-2 capitalize">{article.categories[0]}</Badge>
              <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary">{article.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{article.excerpt}</p>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categoryInfo = CATEGORY_STRUCTURE[slug as keyof typeof CATEGORY_STRUCTURE];

  if (!categoryInfo) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold capitalize">
            {categoryInfo.label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryArticleList slug={slug} />
        </CardContent>
      </Card>
    </div>
  );
}

