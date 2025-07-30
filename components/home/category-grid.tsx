/*
 *   Copyright (c) 2025 
 *   All rights reserved.
 */
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Briefcase, 
  Film, 
  Globe2, 
  Laptop2, 
  Medal, 
  Microscope 
} from 'lucide-react';

const categories = [
  { name: 'Politics', icon: Globe2, href: '/category/politics', color: 'text-blue-500' },
  { name: 'Technology', icon: Laptop2, href: '/category/technology', color: 'text-purple-500' },
  { name: 'Business', icon: Briefcase, href: '/category/business', color: 'text-green-500' },
  { name: 'Sports', icon: Medal, href: '/category/sports', color: 'text-red-500' },
  { name: 'Entertainment', icon: Film, href: '/category/entertainment', color: 'text-yellow-500' },
  { name: 'Science', icon: Microscope, href: '/category/science', color: 'text-cyan-500' },
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