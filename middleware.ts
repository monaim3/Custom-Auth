import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isPublicRoute = pathname === '/auth/login' || pathname === '/auth/signup';
  
  const isProtectedRoute = 
    pathname === '/dashboard' ||
    pathname === '/todos' ||
    pathname === '/profile' ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/todos') ||
    pathname.startsWith('/profile');

  if (pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  if (!token && isProtectedRoute) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [

    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$).*)',
  ],
};