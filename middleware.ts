import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('supabase-auth-token')?.value;
  const { pathname } = req.nextUrl;
  
  // Don't redirect if we're already at the login page
  if (pathname.startsWith('/auth')) return NextResponse.next();

  // If no token and trying to access a protected route, redirect
  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
