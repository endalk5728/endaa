import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect all admin routes, including /admin itself
  if (path.startsWith('/admin')) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // If no token, redirect to the login page
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // If token exists, allow the request to proceed
    return NextResponse.next();
  }

  // For non-admin routes, proceed normally
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
