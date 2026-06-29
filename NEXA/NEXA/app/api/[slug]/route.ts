import { NextRequest, NextResponse } from "next/server";
import * as login          from "@/backend/controllers/login";
import * as register       from "@/backend/controllers/register";
import * as logout         from "@/backend/controllers/logout";
import * as verifySession  from "@/backend/controllers/verify-session";
import * as pulsera        from "@/backend/controllers/pulsera";
import * as dashboard      from "@/backend/controllers/dashboard";
import * as recordatorios  from "@/backend/controllers/recordatorios";
import * as ping           from "@/backend/controllers/ping";

type Controller = Partial<Record<"GET"|"POST"|"PATCH"|"DELETE", (req: NextRequest) => Promise<NextResponse>>>;

const routes: Record<string, Controller> = {
  "login":          login,
  "register":       register,
  "logout":         logout,
  "verify-session": verifySession,
  "pulsera":        pulsera,
  "dashboard":      dashboard,
  "recordatorios":  recordatorios,
  "ping":           ping,
};

async function dispatch(req: NextRequest, { params }: { params: Promise<{ slug: string }> }): Promise<NextResponse> {
  const { slug } = await params;
  const method = req.method as "GET"|"POST"|"PATCH"|"DELETE";
  const controller = routes[slug];
  if (!controller) return NextResponse.json({ error: `Ruta '${slug}' no encontrada` }, { status: 404 });
  const handler = controller[method];
  if (!handler) return NextResponse.json({ error: `Método ${method} no soportado en '${slug}'` }, { status: 405 });
  return handler(req);
}

export const GET = dispatch;
export const POST = dispatch;
export const PATCH = dispatch;
export const DELETE = dispatch;
