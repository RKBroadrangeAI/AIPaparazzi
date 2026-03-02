import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";

const publicPaths = ["/sign-in", "/api/auth", "/api/leads/ingest"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = request.cookies.get("pbiz-session")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  try {
    await verifySessionToken(token);
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/sign-in", request.url));
    response.cookies.delete("pbiz-session");
    return response;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|icon-.*\\.png|pbiz-logo\\.png|api/webhooks).*)",
  ],
};
