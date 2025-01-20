import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token');
  const publicPaths = ['/auth/login', '/auth/register', '/auth/forgot-password'];
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

  if (!authToken && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (authToken && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*',
    '/checkout/:path*',
    '/organizers/:path*',
  ],
};
