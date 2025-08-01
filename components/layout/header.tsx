/*
 *   Copyright (c) 2025 
 *   All rights reserved.
 */
// 

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { 
  Search, 
  Menu, 
  X, 
  Home, 
  Vote, 
  Users, 
  MapPin, 
  Heart, 
  CheckCircle, 
  MessageSquare, 
  GraduationCap 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

const iconMap = {
  Home,
  Vote,
  Users,
  MapPin,
  Heart,
  CheckCircle,
  MessageSquare,
  GraduationCap,
};

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Politics', href: '/category/politics', icon: Vote },
  { name: 'Minority News', href: '/category/minority-news', icon: Users },
  { name: 'Local News', href: '/category/local-news', icon: MapPin },
  { name: 'Feminist', href: '/category/feminist', icon: Heart },
  { name: 'Fact Check', href: '/fact-check', icon: CheckCircle },
  { name: 'FactCheck Response', href: '/category/factcheck-response', icon: MessageSquare },
  { name: 'Courses', href: '/courses', icon: GraduationCap },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { theme } = useTheme();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const [logoSrc, setLogoSrc] = useState('/logo.png');

  useEffect(() => {
    setLogoSrc(theme === 'dark' ? '/logo-dark.png' : '/logo.png');
  }, [theme]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src={logoSrc}
                alt="ZE News Logo"
                width={100}
                height={50}
                className="w-auto h-10"
                priority
                quality={100}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === item.href
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="grid grid-cols-2 gap-2">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors hover:bg-muted',
                      pathname === item.href
                        ? 'text-foreground bg-muted'
                        : 'text-muted-foreground'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <IconComponent className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-3"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}