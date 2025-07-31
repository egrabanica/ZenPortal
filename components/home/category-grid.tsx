/*
 *   Copyright (c) 2025 
 *   All rights reserved.
 */
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Globe2, 
  Users, 
  MapPin, 
  Heart, 
  CheckCircle, 
  GraduationCap 
} from 'lucide-react';

const categories = [
  { name: 'Politics', icon: Globe2, href: '/category/politics', color: 'text-blue-500' },
  { name: 'Minority News', icon: Users, href: '/category/minority-news', color: 'text-purple-500' },
  { name: 'Local News', icon: MapPin, href: '/category/local-news', color: 'text-green-500' },
  { name: 'Feminist', icon: Heart, href: '/category/feminist', color: 'text-pink-500' },
  { name: 'Fact Check', icon: CheckCircle, href: '/fact-check', color: 'text-red-500' },
  { name: 'Courses', icon: GraduationCap, href: '/courses', color: 'text-cyan-500' },
];

export function CategoryGrid() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>News Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.name}
                href={category.href}
                className="group rounded-lg border p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <Icon className={`h-6 w-6 ${category.color}`} />
                  <span className="text-sm font-medium group-hover:text-primary">
                    {category.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}