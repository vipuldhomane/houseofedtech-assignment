import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

// Use Node runtime so console.log works locally
export const runtime = "nodejs";

// export function middleware(req: NextRequest) {
//   return NextResponse.json({ message: "Middleware HIT", path: req.nextUrl.pathname });
// }

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1️⃣ Skip public auth routes
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // 2️⃣ Protect all other /api routes
  if (pathname.startsWith("/api")) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    // 3️⃣ Inject userId into headers for downstream API routes
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", payload.userId);

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  // 4️⃣ For all other routes, just continue
  return NextResponse.next();
}

// Apply middleware to all API routes
export const config = {
  matcher: ["/api/:path*"],
};
