import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { signToken, cookieOptions, COOKIE_NAME } from "@/backend/config/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Email y contraseña son obligatorios" }, { status: 400 });
    const { rows } = await query("SELECT id, email, password_hash, rol FROM cuentas WHERE email = $1", [email.toLowerCase().trim()]);
    const cuenta = rows[0];
    if (!cuenta || !(await bcrypt.compare(password, cuenta.password_hash as string)))
      return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
    const token = await signToken({ id: cuenta.id as number, email: cuenta.email as string, rol: cuenta.rol as "familiar" | "mayor" | "admin" | "soporte" });
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, token, cookieOptions());
    return res;
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
