import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/login"];
const AUTH_ROUTES   = ["/login"];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read token from cookie (Zustand persists to 'optic-auth' cookie)
  const authCookie = request.cookies.get("optic-auth")?.value;
  let isAuthenticated = false;

  if (authCookie) {
    try {
      const parsed = JSON.parse(decodeURIComponent(authCookie));
      isAuthenticated = !!parsed?.state?.token;
    } catch {
      isAuthenticated = false;
    }
  }

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isAuthRoute   = AUTH_ROUTES.includes(pathname);

  // Redirect authenticated users away from login page
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users from protected routes
  if (!isPublicRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all routes EXCEPT:
     * - _next/static  (Next.js static assets)
     * - _next/image   (Next.js image optimization)
     * - Static files: .ico, .svg, .png, .jpg, .jpeg, .webp, .xml, .txt
     * Without this, /favicon.svg and /icon.svg get redirected to /login.
     */
    "/((?!_next/static|_next/image|.*\\.(?:ico|svg|png|jpg|jpeg|webp|xml|txt)$).*)",
  ],
};
