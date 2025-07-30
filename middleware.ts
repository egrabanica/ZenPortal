import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/lib/database.types';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });

  // Check if the route is an admin route
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to signin and signup pages
    if (
      req.nextUrl.pathname === '/admin/signin' ||
      req.nextUrl.pathname === '/admin/signup'
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

