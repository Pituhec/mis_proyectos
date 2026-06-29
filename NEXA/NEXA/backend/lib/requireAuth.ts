import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME, SessionPayload } from "@/backend/config/auth";

type Handler = (req: NextRequest, session: SessionPayload) => Promise<NextResponse>;

export function requireAuth(handler: Handler) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    const session = await verifyToken(token);
    if (!session) return NextResponse.json({ error: "Sesión inválida" }, { status: 401 });
    return handler(req, session);
  };
}

export function requireAdmin(handler: Handler) {
  return requireAuth(async (req, session) => {
    if (session.rol !== "admin") return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
    return handler(req, session);
  });
}
