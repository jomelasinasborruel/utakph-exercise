import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export default async function middleware(request: NextRequest) {
  const jwt = await getToken({ req: request });

  if (request.nextUrl.pathname === "/" && !jwt) {
    return NextResponse.redirect(new URL("/api/auth/signin", request.url));
  }

  if (
    jwt &&
    (request.nextUrl.pathname == "/sign-in" ||
      request.nextUrl.pathname == "/sign-up")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
