"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { dashboardService, DashboardData } from "@/frontend/src/services/dashboardService";

const TIPO_LABEL: Record<string, string> = {
  medicacion: "Medicación", paseo: "Paseo", llamada_familiar: "Llamada familiar", otro: "Aviso",
};
const TIPO_ICON: Record<string, string> = {
  medicacion: "💊", paseo: "🚶", llamada_familiar: "📞", otro: "🔔",
};

function BateriaBarra({ nivel }: { nivel: number }) {
  const color = nivel > 50 ? "bg-green-500" : nivel > 20 ? "bg-amber-400" : "bg-red-500";
  const texto = nivel > 50 ? "text-green-600" : nivel > 20 ? "text-amber-600" : "text-red-600";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${nivel}%` }} />
      </div>
      <span className={`text-sm font-semibold ${texto} w-10 text-right`}>{nivel}%</span>
    </div>
  );
}

function EstadoBadge({ estado }: { estado: string }) {
  const map: Record<string, { label: string; dot: string }> = {
    activada:     { label: "Conectada",   dot: "bg-green-500" },
    desconectada: { label: "Sin señal",   dot: "bg-slate-400" },
    sin_activar:  { label: "Sin activar", dot: "bg-amber-400" },
    baja:         { label: "Baja",        dot: "bg-red-500"   },
  };
  const { label, dot } = map[estado] ?? { label: estado, dot: "bg-slate-400" };
  return (
    <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
      <span className={`w-2 h-2 rounded-full ${dot} animate-pulse`} />
      {label}
    </span>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    dashboardService.get().then(setData).finally(() => setCargando(false));
  }, []);

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-nexa-200 border-t-nexa-600 rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  if (data?.sinPulsera) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-nexa-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-nexa-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Sin pulsera activa</h2>
          <p className="text-slate-500 mb-6">Activa tu pulsera NEXA para empezar.</p>
          <button onClick={() => router.push("/activar")} className="btn-primary w-full">
            Activar pulsera
          </button>
        </div>
      </div>
    );
  }

  const { pulsera, ubicacion, interacciones, proximoRecordatorio, alertasPendientes } = data!;

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm text-slate-500">Bienvenido</p>
          <h1 className="text-xl font-bold text-slate-900">Panel de control</h1>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-nexa-600 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>

      {/* Alerta pánico */}
      {alertasPendientes.length > 0 && (
        <div className="bg-red-50 border-2 border-red-400 rounded-2xl p-4 flex gap-3">
          <span className="text-2xl shrink-0">🚨</span>
          <div>
            <p className="font-bold text-red-700 text-base">¡Alerta de pánico activa!</p>
            <p className="text-sm text-red-600 mt-0.5">{pulsera?.persona_nombre} ha pulsado el botón.</p>
            {alertasPendientes[0].lat && (
              <a href={`https://maps.google.com/?q=${alertasPendientes[0].lat},${alertasPendientes[0].lng}`}
                target="_blank" rel="noopener noreferrer"
                className="mt-2 inline-block text-sm font-semibold text-red-700 underline">
                Ver ubicación →
              </a>
            )}
          </div>
        </div>
      )}

      {/* Tarjeta principal: pulsera */}
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{pulsera?.persona_nombre}</h2>
            <p className="text-xs text-slate-400 mt-0.5">Pulsera {pulsera?.id_publico}</p>
          </div>
          <EstadoBadge estado={pulsera?.estado ?? ""} />
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-slate-500 flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
                </svg>
                Batería
              </span>
            </div>
            <BateriaBarra nivel={pulsera?.bateria ?? 0} />
          </div>

          {pulsera?.ultima_conexion && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Última conexión</span>
              <span className="font-medium text-slate-700">
                {new Date(pulsera.ultima_conexion).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                {" · "}
                {new Date(pulsera.ultima_conexion).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
              </span>
            </div>
          )}

          {ubicacion && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Ubicación</span>
              <a href={`https://maps.google.com/?q=${ubicacion.lat},${ubicacion.lng}`}
                target="_blank" rel="noopener noreferrer"
                className="font-medium text-nexa-600 hover:underline flex items-center gap-1">
                Ver en mapa
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Próximo recordatorio */}
      {proximoRecordatorio && (
        <div className="card bg-nexa-50 border-nexa-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-nexa-100 flex items-center justify-center text-2xl shrink-0">
              {TIPO_ICON[proximoRecordatorio.tipo] ?? "🔔"}
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-nexa-600 uppercase tracking-wide mb-0.5">Próximo recordatorio</p>
              <p className="text-base font-bold text-slate-900">{TIPO_LABEL[proximoRecordatorio.tipo] ?? proximoRecordatorio.tipo}</p>
              <p className="text-sm text-slate-500">{proximoRecordatorio.hora.slice(0, 5)} h</p>
            </div>
          </div>
        </div>
      )}

      {/* Accesos rápidos */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/dashboard/perfil"
          className="card flex flex-col items-center gap-2 py-5 hover:border-nexa-300 hover:shadow-md transition-all text-center">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-slate-700">Editar perfil</span>
        </Link>
        <Link href="/dashboard/familia"
          className="card flex flex-col items-center gap-2 py-5 hover:border-nexa-300 hover:shadow-md transition-all text-center">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <span className="text-sm font-medium text-slate-700">Ver mapa</span>
        </Link>
        <Link href="/dashboard/ayuda"
          className="card flex flex-col items-center gap-2 py-5 hover:border-nexa-300 hover:shadow-md transition-all text-center">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-slate-700">Ayuda</span>
        </Link>
        <Link href="/dashboard/ajustes"
          className="card flex flex-col items-center gap-2 py-5 hover:border-nexa-300 hover:shadow-md transition-all text-center">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-slate-700">Ajustes</span>
        </Link>
      </div>

      {/* Actividad reciente */}
      <div className="card">
        <h3 className="text-sm font-bold text-slate-700 mb-4">Actividad reciente</h3>
        {interacciones.length > 0 ? (
          <ul className="space-y-3">
            {interacciones.map((inter, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="text-xl shrink-0">{TIPO_ICON[inter.tipo] ?? "🔔"}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{TIPO_LABEL[inter.tipo] ?? inter.tipo}</p>
                  {inter.detalle && <p className="text-xs text-slate-400 truncate">{inter.detalle}</p>}
                </div>
                <div className="text-right shrink-0">
                  {inter.respuesta && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      inter.respuesta === "si" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                    }`}>
                      {inter.respuesta === "si" ? "Sí" : "No"}
                    </span>
                  )}
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(inter.ocurrido_en).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-400 text-sm text-center py-4">Sin actividad registrada aún</p>
        )}
      </div>

    </div>
  );
}
