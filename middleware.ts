import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/lib/database.types';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });

  // Performance headers
  res.headers.set('X-DNS-Prefetch-Control', 'on');
  res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.headers.set('X-Frame-Options', 'SAMEORIGIN');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'origin-when-cross-origin');

  // Add caching headers for static assets
  if (req.nextUrl.pathname.startsWith('/_next/static/') || 
      req.nextUrl.pathname.includes('.')) {
    res.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  // Add compression hint
  res.headers.set('Content-Encoding', 'gzip');

  // Check if the route is an admin route
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to signin and signup pages without any checks
    if (
      req.nextUrl.pathname === '/admin/signin' ||
      req.nextUrl.pathname === '/admin/signup' ||
      req.nextUrl.pathname.startsWith('/admin/signin/') ||
      req.nextUrl.pathname.startsWith('/admin/signup/')
    ) {
      return res;
    }

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      // Redirect to signin if not authenticated
      const redirectUrl = new URL('/admin/signin', req.url);
      return NextResponse.redirect(redirectUrl);
    }

    // Check if user is admin/editor
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!profile || (profile.role !== 'admin' && profile.role !== 'editor')) {
      // Redirect to home if not admin/editor
      const redirectUrl = new URL('/', req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
