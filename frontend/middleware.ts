import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {verifyToken} from '@/lib/auth';

const protectedRoutes = ['/profile', '/books/add', '/books/[id]/edit'];
const authRoutes = ['/login', '/signup'];

export async function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  const isProtectedRoute = protectedRoutes.some((route) => {
    // Handle dynamic routes like /books/:id/edit
    const routeRegex = new RegExp(`^${route.replace(/\[\w+\]/g, '[^/]+')}$`);
    return routeRegex.test(pathname);
  });
  
  const userPayload = token ? await verifyToken(token) : null;

  if (isProtectedRoute) {
    if (!userPayload) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (authRoutes.includes(pathname) && userPayload) {
    return NextResponse.redirect(new URL('/books', request.url));
  }

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
     * - images (public images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
