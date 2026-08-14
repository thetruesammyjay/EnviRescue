import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Authentication and role checks will be added when the token flow is connected.
  return NextResponse.next({ request });
}

export const config = {
  matcher: ["/dashboard/:path*", "/waste/:path*", "/classify/:path*", "/recycling/:path*", "/collections/:path*", "/reports/:path*", "/settings/:path*", "/admin/:path*"],
};
