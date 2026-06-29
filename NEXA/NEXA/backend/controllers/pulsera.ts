import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAuth } from "@/backend/lib/requireAuth";

export const GET = requireAuth(async (_req, session) => {
  const { rows } = await query(
    `SELECT p.id, p.id_publico, p.estado, p.bateria, p.ultima_conexion, pe.nombre as persona_nombre
     FROM pulseras p
     JOIN personas pe ON pe.id = p.persona_id
     JOIN accesos a ON a.persona_id = pe.id
     WHERE a.cuenta_id = $1 AND a.es_principal = true LIMIT 1`,
    [session.id]
  );
  return NextResponse.json({ pulsera: rows[0] ?? null });
});

export const POST = requireAuth(async (req, session) => {
  try {
    const { accion, codigo, perfil } = await req.json();

    if (accion === "validar_codigo") {
      const { rows } = await query("SELECT id, estado FROM pulseras WHERE codigo_activacion = $1", [codigo?.toUpperCase()]);
      if (rows.length === 0) return NextResponse.json({ error: "Código no encontrado. Revisa la tarjeta." }, { status: 404 });
      if ((rows[0].estado as string) !== "sin_activar") return NextResponse.json({ error: "Este código ya ha sido usado." }, { status: 409 });
      return NextResponse.json({ ok: true });
    }

    if (accion === "activar") {
      const { rows: personaRows } = await query(
        `INSERT INTO personas (nombre, edad, telefono, preferencias) VALUES ($1,$2,$3,$4) RETURNING id`,
        [perfil.nombre, parseInt(perfil.edad) || null, perfil.telefono || null,
         JSON.stringify({ horarios: perfil.horariosLibres ?? [], recordatorios: perfil.recordatorios ?? [] })]
      );
      const personaId = personaRows[0].id as number;
      await query(`INSERT INTO accesos (cuenta_id, persona_id, parentesco, es_principal) VALUES ($1,$2,'Familiar',true)`, [session.id, personaId]);
      await query(`UPDATE pulseras SET persona_id=$1, estado='activada', activada_en=now() WHERE codigo_activacion=$2`, [personaId, codigo.toUpperCase()]);
      if (perfil.contactoNombre && perfil.contactoTelefono)
        await query(`INSERT INTO contactos_emergencia (persona_id, nombre, telefono, prioridad) VALUES ($1,$2,$3,1)`, [personaId, perfil.contactoNombre, perfil.contactoTelefono]);
      for (const tipo of (perfil.recordatorios ?? []) as string[])
        await query(`INSERT INTO recordatorios (persona_id, tipo, hora, activo) VALUES ($1,$2,'18:00',true)`, [personaId, tipo]);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (err) {
    console.error("[pulsera]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
});
