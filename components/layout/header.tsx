/*
 *   Copyright (c) 2025 
 *   All rights reserved.
 */
// 

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Search, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Politics', href: '/category/politics' },
  { name: 'Technology', href: '/category/technology' },
  { name: 'Business', href: '/category/business' },
  { name: 'Sports', href: '/category/sports' },
  { name: 'Entertainment', href: '/category/entertainment' },
  { name: 'Fact Check', href: '/fact-check' },
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

  const logoSrc = theme === 'dark' ? '/logo-dark.png' : '/logo.png';

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
            <div className="hidden md:flex space-x-2">
              <Button variant="ghost" onClick={() => router.push('/auth/sign-in')}>
                Sign In
              </Button>
              <Button onClick={() => router.push('/auth/sign-up')}>Sign Up</Button>
            </div>
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
          <div className="md:hidden py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'block py-2 text-base font-medium transition-colors hover:text-primary',
                  pathname === item.href
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4 space-y-2">
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  router.push('/auth/sign-in');
                  setIsOpen(false);
                }}
              >
                Sign In
              </Button>
              <Button
                className="w-full"
                onClick={() => {
                  router.push('/auth/sign-up');
                  setIsOpen(false);
                }}
              >
                Sign Up
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}