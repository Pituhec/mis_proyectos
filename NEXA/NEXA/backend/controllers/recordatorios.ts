import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAuth } from "@/backend/lib/requireAuth";

export const GET = requireAuth(async (_req, session) => {
  const { rows } = await query(
    `SELECT r.id, r.tipo, r.titulo, r.hora, r.dias_semana, r.activo
     FROM recordatorios r JOIN personas pe ON pe.id = r.persona_id JOIN accesos a ON a.persona_id = pe.id
     WHERE a.cuenta_id=$1 AND a.es_principal=true ORDER BY r.hora ASC`,
    [session.id]
  );
  return NextResponse.json({ recordatorios: rows });
});

export const POST = requireAuth(async (req, session) => {
  try {
    const { tipo, titulo, hora, dias_semana } = await req.json();
    const { rows: personaRows } = await query(`SELECT persona_id FROM accesos WHERE cuenta_id=$1 AND es_principal=true`, [session.id]);
    if (personaRows.length === 0) return NextResponse.json({ error: "Sin persona asociada" }, { status: 404 });
    const { rows } = await query(
      `INSERT INTO recordatorios (persona_id, tipo, titulo, hora, dias_semana, activo) VALUES ($1,$2,$3,$4,$5,true) RETURNING id`,
      [personaRows[0].persona_id, tipo, titulo ?? null, hora, dias_semana ?? [0,1,2,3,4,5,6]]
    );
    return NextResponse.json({ ok: true, id: rows[0].id });
  } catch (err) {
    console.error("[recordatorios POST]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
});

export const PATCH = requireAuth(async (req, session) => {
  try {
    const { id, activo, hora, dias_semana } = await req.json();
    await query(
      `UPDATE recordatorios r SET activo=COALESCE($1,r.activo), hora=COALESCE($2::time,r.hora), dias_semana=COALESCE($3,r.dias_semana)
       FROM personas pe JOIN accesos a ON a.persona_id=pe.id WHERE r.id=$4 AND r.persona_id=pe.id AND a.cuenta_id=$5`,
      [activo ?? null, hora ?? null, dias_semana ?? null, id, session.id]
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[recordatorios PATCH]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
});
