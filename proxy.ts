import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow the admin login page itself.
  if (pathname === "/admin") {
    return NextResponse.next();
  }

  // Allow the password reset page.
  // The one-time reset token will be validated
  // by the reset-password API.
  if (pathname === "/admin/reset-password") {
    return NextResponse.next();
  }

  // Protect every other page underneath /admin.
  if (pathname.startsWith("/admin/")) {
    const adminCookie =
      request.cookies.get("mabon_admin")?.value;

    const expectedToken =
      process.env.ADMIN_SESSION_TOKEN;

    if (
      !expectedToken ||
      !adminCookie ||
      adminCookie !== expectedToken
    ) {
      return NextResponse.redirect(
        new URL("/admin", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};