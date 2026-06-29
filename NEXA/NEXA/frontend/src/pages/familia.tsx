"use client";
import { useEffect, useState } from "react";
import { http } from "@/frontend/src/api/httpClient";

interface Contacto { id: number; nombre: string; telefono: string; parentesco: string; prioridad: number; }
interface Recordatorio { id: number; tipo: string; titulo: string | null; hora: string; dias_semana: number[]; activo: boolean; }
interface Alerta { id: number; tipo: string; estado: string; disparada_en: string; lat: number | null; lng: number | null; }
interface Ubicacion { lat: number; lng: number; registrado_en: string; precision_m?: number; }
interface FamiliaData {
  pulsera: { id: number; id_publico: string; estado: string; bateria: number; ultima_conexion: string; persona_nombre: string; } | null;
  ubicacion: Ubicacion | null;
  alertas: Alerta[];
  contactos: Contacto[];
  recordatorios: Recordatorio[];
}

const DIAS = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"];
const TIPO_ICON: Record<string, string> = { medicacion: "💊", paseo: "🚶", llamada_familiar: "📞", otro: "🔔" };
const TIPO_LABEL: Record<string, string> = { medicacion: "Medicación", paseo: "Paseo", llamada_familiar: "Llamada familiar", otro: "Aviso" };

const ALERTA_MAP: Record<string, { label: string; cls: string; icon: string }> = {
  enviada:      { label: "Sin atender", cls: "bg-red-100 text-red-700",    icon: "🚨" },
  atendida:     { label: "Atendida",    cls: "bg-green-100 text-green-700", icon: "✅" },
  falsa_alarma: { label: "Falsa alarma",cls: "bg-slate-100 text-slate-500", icon: "⚠️" },
};

export default function FamiliaPage() {
  const [data, setData] = useState<FamiliaData | null>(null);
  const [cargando, setCargando] = useState(true);
  const [tab, setTab] = useState<"mapa" | "alertas" | "contactos" | "recordatorios">("mapa");

  useEffect(() => {
    http.get<FamiliaData>("familia").then(setData).finally(() => setCargando(false));
  }, []);

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-nexa-200 border-t-nexa-600 rounded-full animate-spin" />
      </div>
    );
  }

  const { pulsera, ubicacion, alertas, contactos, recordatorios } = data!;

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4">

      <div>
        <p className="text-sm text-slate-500">Panel de</p>
        <h1 className="text-xl font-bold text-slate-900">Familia y cuidadores</h1>
      </div>

      {/* Estado dispositivo */}
      <div className="card flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
          pulsera?.estado === "activada" ? "bg-green-100" : "bg-slate-100"
        }`}>
          ⌚
        </div>
        <div className="flex-1">
          <p className="font-bold text-slate-900">{pulsera?.persona_nombre}</p>
          <p className="text-xs text-slate-400">Pulsera {pulsera?.id_publico}</p>
        </div>
        <div className="text-right">
          <p className={`text-sm font-semibold ${
            (pulsera?.bateria ?? 0) > 50 ? "text-green-600" : (pulsera?.bateria ?? 0) > 20 ? "text-amber-500" : "text-red-500"
          }`}>
            {pulsera?.bateria ?? 0}%
          </p>
          <p className="text-xs text-slate-400">batería</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
        {(["mapa", "alertas", "contactos", "recordatorios"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg capitalize transition-colors ${
              tab === t ? "bg-white text-nexa-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}>
            {t === "mapa" ? "Ubicación" : t === "alertas" ? "Alertas" : t === "contactos" ? "Contactos" : "Avisos"}
          </button>
        ))}
      </div>

      {/* Tab: Mapa / Ubicación */}
      {tab === "mapa" && (
        <div className="card space-y-3">
          <h2 className="font-bold text-slate-900">Última ubicación conocida</h2>
          {ubicacion ? (
            <>
              <a href={`https://maps.google.com/?q=${ubicacion.lat},${ubicacion.lng}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center h-40 bg-nexa-50 border-2 border-nexa-200 rounded-xl hover:bg-nexa-100 transition-colors gap-3">
                <svg className="w-8 h-8 text-nexa-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-semibold text-nexa-700">Abrir en Google Maps →</span>
              </a>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-0.5">Latitud</p>
                  <p className="font-mono font-medium text-slate-700">{ubicacion.lat.toFixed(4)}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-0.5">Longitud</p>
                  <p className="font-mono font-medium text-slate-700">{ubicacion.lng.toFixed(4)}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 text-center">
                Actualizado: {new Date(ubicacion.registrado_en).toLocaleString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                {ubicacion.precision_m && ` · Precisión ±${ubicacion.precision_m}m`}
              </p>
            </>
          ) : (
            <div className="h-32 flex items-center justify-center bg-slate-50 rounded-xl">
              <p className="text-slate-400 text-sm">Sin datos de ubicación</p>
            </div>
          )}
        </div>
      )}

      {/* Tab: Alertas */}
      {tab === "alertas" && (
        <div className="card space-y-3">
          <h2 className="font-bold text-slate-900">Historial de alertas</h2>
          {alertas.length > 0 ? (
            <ul className="space-y-2">
              {alertas.map(a => {
                const meta = ALERTA_MAP[a.estado] ?? { label: a.estado, cls: "bg-slate-100 text-slate-500", icon: "⚠️" };
                return (
                  <li key={a.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                    <span className="text-xl shrink-0">{meta.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 capitalize">{a.tipo.replace("_", " ")}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(a.disparada_en).toLocaleString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                      {a.lat && (
                        <a href={`https://maps.google.com/?q=${a.lat},${a.lng}`}
                          target="_blank" rel="noopener noreferrer"
                          className="text-xs text-nexa-600 underline">Ver ubicación</a>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${meta.cls}`}>{meta.label}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="py-8 text-center">
              <p className="text-3xl mb-2">✅</p>
              <p className="text-slate-500 text-sm">Sin alertas registradas</p>
            </div>
          )}
        </div>
      )}

      {/* Tab: Contactos */}
      {tab === "contactos" && (
        <div className="card space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Contactos de emergencia</h2>
          </div>
          <ul className="space-y-2">
            {contactos.map(c => (
              <li key={c.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-nexa-100 flex items-center justify-center text-nexa-700 font-bold text-sm shrink-0">
                  {c.nombre.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{c.nombre}</p>
                  <p className="text-xs text-slate-500">{c.parentesco} · {c.telefono}</p>
                </div>
                <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full shrink-0">
                  #{c.prioridad}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-400 text-center">Para editar los contactos ve a Perfil →</p>
        </div>
      )}

      {/* Tab: Recordatorios */}
      {tab === "recordatorios" && (
        <div className="card space-y-3">
          <h2 className="font-bold text-slate-900">Recordatorios programados</h2>
          <ul className="space-y-2">
            {recordatorios.map(r => (
              <li key={r.id} className={`p-3 rounded-xl flex items-start gap-3 ${r.activo ? "bg-slate-50" : "bg-slate-50 opacity-50"}`}>
                <span className="text-xl shrink-0">{TIPO_ICON[r.tipo] ?? "🔔"}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-800">
                      {r.titulo ?? TIPO_LABEL[r.tipo] ?? r.tipo}
                    </p>
                    <span className="text-sm font-mono font-medium text-slate-600">{r.hora.slice(0, 5)}</span>
                  </div>
                  <div className="flex gap-1 mt-1.5">
                    {DIAS.map((d, i) => (
                      <span key={i} className={`text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-medium ${
                        r.dias_semana.includes(i) ? "bg-nexa-100 text-nexa-700" : "bg-slate-100 text-slate-400"
                      }`}>{d}</span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-400 text-center">Para modificar los avisos ve a Perfil →</p>
        </div>
      )}

      {/* Descargar informe */}
      <button className="btn-secondary w-full flex items-center justify-center gap-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Descargar informe mensual
      </button>

    </div>
  );
}
