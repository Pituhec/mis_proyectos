import mqtt from "mqtt";
import { query } from "@/lib/db";
import { emitir } from "./pusher";

interface MensajeUbicacion { lat: number; lng: number; bateria?: number; precision_m?: number; }
interface MensajeInteraccion { tipo: string; respuesta?: string; detalle?: string; }
interface MensajePanico { lat?: number; lng?: number; }

async function procesarMensaje(topic: string, payload: string) {
  const partes = topic.split("/");
  if (partes.length < 4) return;
  const pulseraId = parseInt(partes[2]);
  const tipo = partes[3];
  if (isNaN(pulseraId)) return;

  let datos: unknown;
  try { datos = JSON.parse(payload); } catch { return; }

  try {
    if (tipo === "ubicacion") {
      const d = datos as MensajeUbicacion;
      await query(`INSERT INTO ubicaciones (pulsera_id, lat, lng, bateria, precision_m) VALUES ($1,$2,$3,$4,$5)`,
        [pulseraId, d.lat, d.lng, d.bateria ?? null, d.precision_m ?? null]);
      await query(`UPDATE pulseras SET bateria=$1, ultima_conexion=now() WHERE id=$2`, [d.bateria ?? null, pulseraId]);
      await emitir(`pulsera-${pulseraId}`, "ubicacion", d);
    }
    if (tipo === "interaccion") {
      const d = datos as MensajeInteraccion;
      await query(`INSERT INTO interacciones (pulsera_id, tipo, respuesta, detalle) VALUES ($1,$2,$3,$4)`,
        [pulseraId, d.tipo, d.respuesta ?? null, d.detalle ?? null]);
      await emitir(`pulsera-${pulseraId}`, "interaccion", d);
    }
    if (tipo === "panico") {
      const d = datos as MensajePanico;
      await query(`INSERT INTO alertas_panico (pulsera_id, lat, lng, estado) VALUES ($1,$2,$3,'enviada')`,
        [pulseraId, d.lat ?? null, d.lng ?? null]);
      await emitir(`pulsera-${pulseraId}`, "panico", d);
      console.warn(`[mqtt] ⚠️ PÁNICO pulsera ${pulseraId}`);
    }
  } catch (err) {
    console.error(`[mqtt] Error procesando ${tipo} pulsera ${pulseraId}:`, err);
  }
}

export function iniciarMQTT() {
  const url = process.env.MQTT_BROKER_URL || "mqtt://localhost:1883";
  const client = mqtt.connect(url, { clientId: `nexa-worker-${Date.now()}`, reconnectPeriod: 5000 });
  client.on("connect", () => { console.log(`[mqtt] Conectado a ${url}`); client.subscribe("nexa/pulsera/#"); });
  client.on("message", (topic, payload) => procesarMensaje(topic, payload.toString()));
  client.on("error", (err) => console.error("[mqtt] Error:", err));
  client.on("reconnect", () => console.log("[mqtt] Reconectando..."));
}
