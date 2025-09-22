import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;

    // Public routes that don't require authentication
    const publicRoutes = ["/", "/signin", "/signup", "/products"];

    // Admin-only routes
    const adminRoutes = ["/profile/admin", "/api/admin"];

    // Check if route is public
    const isPublicRoute = publicRoutes.some(
      (route) => pathname.startsWith(route) || pathname === route
    );

    // Check if route requires admin access
    const isAdminRoute = adminRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // If it's a public route, allow access
    if (isPublicRoute) {
      return NextResponse.next();
    }

    // If user is not authenticated and trying to access protected route
    if (!token) {
      const signInUrl = new URL("/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // If route requires admin access but user is not admin
    if (isAdminRoute && !token.isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Public routes that don't require authentication
        const publicRoutes = ["/", "/signin", "/signup", "/products"];
        const isPublicRoute = publicRoutes.some(
          (route) => pathname.startsWith(route) || pathname === route
        );

        // Allow public routes without token
        if (isPublicRoute) {
          return true;
        }

        // Require token for protected routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
