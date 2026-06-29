import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
  if (process.env.NEXT_PUBLIC_USE_MOCKS === "true") return NextResponse.next();
  const token = req.cookies.get("nexa_token")?.value;
  if (!token) return NextResponse.redirect(new URL("/auth/login", req.url));
  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL("/auth/login", req.url));
    res.cookies.delete("nexa_token");
    return res;
  }
}

export const config = { matcher: ["/dashboard/:path*"] };
