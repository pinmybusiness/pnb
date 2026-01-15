import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = [
    '/',
    '/login',
    '/register',
    '/about',
    '/contact',
    '/pricing',
    '/faq',
    '/blog',
    '/privacy-policy',
    '/terms-and-conditions',
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/refresh',
  ];

  // Check if the path is public
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(path)
  );

  // Allow access to public paths and static assets
  if (isPublicPath || 
      pathname.startsWith('/_next') || 
      pathname.startsWith('/static') ||
      pathname.includes('.')) {
    return NextResponse.next();
  }

  // For protected routes, let the client-side handle authentication
  // This allows the ProtectedRoute component to manage auth state
  return NextResponse.next();
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
