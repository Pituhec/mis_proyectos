import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/backend/config/auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE_NAME);
  return res;
}
