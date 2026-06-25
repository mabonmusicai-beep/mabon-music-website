import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/admin/submissions")) {
    const auth = request.cookies.get("mabon_admin")?.value;

    if (auth !== process.env.ADMIN_SESSION_TOKEN) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/submissions/:path*"],
};