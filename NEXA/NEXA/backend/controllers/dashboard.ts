import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAuth } from "@/backend/lib/requireAuth";

export const GET = requireAuth(async (_req, session) => {
  try {
    const { rows: pulseraRows } = await query(
      `SELECT p.id, p.id_publico, p.estado, p.bateria, p.ultima_conexion, pe.nombre as persona_nombre, pe.id as persona_id
       FROM pulseras p JOIN personas pe ON pe.id = p.persona_id JOIN accesos a ON a.persona_id = pe.id
       WHERE a.cuenta_id = $1 AND a.es_principal = true LIMIT 1`,
      [session.id]
    );
    if (pulseraRows.length === 0) return NextResponse.json({ sinPulsera: true });
    const pulsera = pulseraRows[0];

    const { rows: ubicRows } = await query(
      `SELECT lat, lng, registrado_en FROM ubicaciones WHERE pulsera_id=$1 ORDER BY registrado_en DESC LIMIT 1`, [pulsera.id]);

    const { rows: interRows } = await query(
      `SELECT tipo, respuesta, detalle, ocurrido_en FROM interacciones WHERE pulsera_id=$1 ORDER BY ocurrido_en DESC LIMIT 10`, [pulsera.id]);

    const ahora = new Date();
    const horaActual = `${ahora.getHours()}:${String(ahora.getMinutes()).padStart(2,"0")}`;
    const { rows: recRows } = await query(
      `SELECT tipo, hora FROM recordatorios WHERE persona_id=$1 AND activo=true AND $2=ANY(dias_semana) AND hora>$3::time ORDER BY hora ASC LIMIT 1`,
      [pulsera.persona_id, ahora.getDay(), horaActual]
    );

    const { rows: alertasRows } = await query(
      `SELECT id, lat, lng, disparada_en FROM alertas_panico WHERE pulsera_id=$1 AND estado='enviada' ORDER BY disparada_en DESC`, [pulsera.id]);

    return NextResponse.json({ pulsera, ubicacion: ubicRows[0] ?? null, interacciones: interRows, proximoRecordatorio: recRows[0] ?? null, alertasPendientes: alertasRows });
  } catch (err) {
    console.error("[dashboard]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
});
