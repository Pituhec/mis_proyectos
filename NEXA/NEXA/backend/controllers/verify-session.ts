import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/backend/config/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ autenticado: false });
  const session = await verifyToken(token);
  if (!session) return NextResponse.json({ autenticado: false });
  return NextResponse.json({ autenticado: true, session });
}
