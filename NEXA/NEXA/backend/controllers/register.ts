import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { signToken, cookieOptions, COOKIE_NAME } from "@/backend/config/auth";

export async function POST(req: NextRequest) {
  try {
    const { nombre, email, password } = await req.json();
    if (!nombre || !email || !password) return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    if (password.length < 8) return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres" }, { status: 400 });
    const { rows: existe } = await query("SELECT id FROM cuentas WHERE email = $1", [email.toLowerCase().trim()]);
    if (existe.length > 0) return NextResponse.json({ error: "Este correo ya tiene una cuenta" }, { status: 409 });
    const hash = await bcrypt.hash(password, 12);
    const { rows } = await query(
      `INSERT INTO cuentas (nombre, email, password_hash, rol) VALUES ($1,$2,$3,'familiar') RETURNING id, email, rol`,
      [nombre.trim(), email.toLowerCase().trim(), hash]
    );
    const cuenta = rows[0];
    const token = await signToken({ id: cuenta.id as number, email: cuenta.email as string, rol: "familiar" });
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, token, cookieOptions());
    return res;
  } catch (err) {
    console.error("[register]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
