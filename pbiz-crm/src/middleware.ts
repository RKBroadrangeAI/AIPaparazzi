import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";

const publicPaths = ["/sign-in", "/api/auth", "/api/leads/ingest", "/api/public"];

// Allowed origins for CORS (B2C website domains)
const ALLOWED_ORIGINS = [
  "https://paparazzibybiz.com",
  "https://www.paparazzibybiz.com",
  "http://localhost:8080",
  "http://localhost:3000",
  "http://127.0.0.1:8080",
];

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  // Allow any Railway-hosted app during development
  if (origin.endsWith(".up.railway.app")) return true;
  return false;
}

function getCorsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-API-Key",
    "Access-Control-Max-Age": "86400",
  };
  if (isAllowedOrigin(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get("origin");

  // Handle CORS preflight for public API routes
  if (pathname.startsWith("/api/public") && request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: getCorsHeaders(origin),
    });
  }

  // Public paths — no auth required
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    const response = NextResponse.next();
    // Add CORS headers for public API routes
    if (pathname.startsWith("/api/public")) {
      const corsHeaders = getCorsHeaders(origin);
      for (const [key, value] of Object.entries(corsHeaders)) {
        response.headers.set(key, value);
      }
    }
    return response;
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
