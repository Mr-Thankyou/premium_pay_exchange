import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;

  const { pathname } = req.nextUrl;

  // ----------- PUBLIC ROUTES -----------
  const publicRoutes = ["/login", "/register", "/", "/forgot-password"];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // ----------- REQUIRE LOGIN (dashboard pages) -----------
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      return NextResponse.next();
    } catch {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ----------- ADMIN-ONLY PAGES -----------
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        role: string;
      };

      if (decoded.role !== "admin") {
        const noAccessUrl = new URL("/dashboard", req.url);
        return NextResponse.redirect(noAccessUrl);
      }

      return NextResponse.next();
    } catch {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Very important !!!
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
