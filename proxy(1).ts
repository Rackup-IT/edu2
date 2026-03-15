import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = process.env.JWT_SECRET || 'your-fallback-secret-key-change-this-in-prod';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isLoginRoute = pathname.startsWith('/login');

  const cookie = request.cookies.get('admin_session');

  let isAuthenticated = false;
  if (cookie) {
    try {
      await jwtVerify(cookie.value, new TextEncoder().encode(SECRET_KEY));
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  if (isDashboardRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isLoginRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
