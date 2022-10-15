// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { config as env } from "./config";
import * as jose from "jose";

const cert = jose.importX509(env.auth0PubCert, "RS256");
export async function middleware(request: NextRequest) {
  if (
    ["/api/report", "/api/admin/report", "/api/auth/user-data"].includes(
      request.nextUrl.pathname
    )
  ) {
    try {
      const token = request.headers.get("authorization")?.split(" ")[1];
      if (!token) throw null;
      const { payload } = await jose.jwtVerify(token, await cert);
      const { sub: userId } = payload;
      if (request.nextUrl.pathname === "/auth/login") throw new Error();
      const permissions = payload.permissions as string[] | undefined;
      let targetUrl = request.nextUrl.clone();
      const isAdmin = JSON.stringify(
        permissions?.includes("read:reports") ?? false
      );
      targetUrl.searchParams.append("userId", userId!);
      targetUrl.searchParams.append("isAdmin", isAdmin);
      if (request.nextUrl.pathname === "/api/admin/report" && !isAdmin) {
        throw new Error();
      }
      return NextResponse.rewrite(new URL(targetUrl, request.url));
    } catch (e) {
      console.error(e);
      return NextResponse.rewrite(new URL("/api/auth/unauth", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
