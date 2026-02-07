import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;

  // Public routes (không cần auth)
  const publicRoutes = ['/auth', '/api/auth', '/_next', '/static'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if (isPublicRoute) {
    // Nếu user đã login, redirect từ /auth sang /dashboard
    if (token && pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protected routes - kiểm tra token
  if (!token) {
    // Redirect to auth page
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // RBAC checks - kiểm tra role từ user data
  const userStr = request.cookies.get('user')?.value;
  const user = userStr ? JSON.parse(userStr) : null;
  const role = user?.role;

  // Government-only routes
  if (pathname.startsWith('/gov') && role !== 'GOVERNMENT') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Farmer-only routes (if needed)
  if (pathname.startsWith('/farmer') && role !== 'FARMER') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
