"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { http } from "@/frontend/src/api/httpClient";
import { apiService } from "@/frontend/src/services/apiService";

interface AjustesData {
  voz_activa: boolean;
  alerta_bateria: boolean;
  alerta_panico: boolean;
  alerta_desconexion: boolean;
  notificaciones_email: boolean;
  notificaciones_push: boolean;
}

function Toggle({ activo, onChange }: { activo: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${activo ? "bg-nexa-600" : "bg-slate-300"}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${activo ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

export default function AjustesPage() {
  const router = useRouter();
  const [cfg, setCfg] = useState<AjustesData | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [exito, setExito] = useState(false);

  useEffect(() => {
    http.get<AjustesData>("ajustes").then(setCfg);
  }, []);

  function toggle(key: keyof AjustesData) {
    setCfg(c => c ? { ...c, [key]: !c[key] } : c);
  }

  async function guardar() {
    setGuardando(true);
    await new Promise(r => setTimeout(r, 500));
    setGuardando(false);
    setExito(true);
    setTimeout(() => setExito(false), 3000);
  }

  async function cerrarSesion() {
    await apiService.logout();
    router.push("/auth/login");
  }

  const ALERTAS = [
    { key: "alerta_panico"      as const, label: "Alerta de pánico",        desc: "Notificación inmediata cuando se pulsa el botón de emergencia." },
    { key: "alerta_bateria"     as const, label: "Batería baja",            desc: "Aviso cuando la batería baja del 20%." },
    { key: "alerta_desconexion" as const, label: "Desconexión de red",      desc: "Aviso si la pulsera pierde cobertura más de 30 minutos." },
  ];

  const NOTIFS = [
    { key: "notificaciones_email" as const, label: "Notificaciones por email", desc: "Recibe las alertas en tu correo electrónico." },
    { key: "notificaciones_push"  as const, label: "Notificaciones push",      desc: "Alertas instantáneas en tu navegador o app." },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4">

      <div>
        <p className="text-sm text-slate-500">Configuración</p>
        <h1 className="text-xl font-bold text-slate-900">Ajustes</h1>
      </div>

      {exito && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Ajustes guardados
        </div>
      )}

      {cfg && (
        <>
          {/* Voz */}
          <div className="card space-y-1">
            <h2 className="font-bold text-slate-900 mb-3">Asistente de voz</h2>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-slate-800">Voz activa en la pulsera</p>
                <p className="text-xs text-slate-500">La pulsera hablará para confirmar recordatorios y alertas.</p>
              </div>
              <Toggle activo={cfg.voz_activa} onChange={() => toggle("voz_activa")} />
            </div>
          </div>

          {/* Alertas */}
          <div className="card">
            <h2 className="font-bold text-slate-900 mb-3">Tipos de alerta</h2>
            <div className="space-y-2">
              {ALERTAS.map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-xl">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">{label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                  </div>
                  <Toggle activo={cfg[key]} onChange={() => toggle(key)} />
                </div>
              ))}
            </div>
          </div>

          {/* Notificaciones */}
          <div className="card">
            <h2 className="font-bold text-slate-900 mb-3">Notificaciones</h2>
            <div className="space-y-2">
              {NOTIFS.map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-xl">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">{label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                  </div>
                  <Toggle activo={cfg[key]} onChange={() => toggle(key)} />
                </div>
              ))}
            </div>
          </div>

          <button onClick={guardar} className="btn-primary w-full" disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar ajustes"}
          </button>
        </>
      )}

      {/* Suscripción */}
      <div className="card">
        <h2 className="font-bold text-slate-900 mb-3">Suscripción</h2>
        <div className="flex items-center justify-between p-3 bg-nexa-50 border border-nexa-200 rounded-xl mb-3">
          <div>
            <p className="text-sm font-bold text-nexa-800">Plan mensual activo</p>
            <p className="text-xs text-nexa-600">14,90 € / mes · Próxima renovación: 29 jul 2026</p>
          </div>
          <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-1 rounded-full">Activo</span>
        </div>
        <button className="btn-secondary w-full text-sm">Gestionar suscripción</button>
      </div>

      {/* Cuenta */}
      <div className="card space-y-3">
        <h2 className="font-bold text-slate-900">Cuenta</h2>
        <button className="w-full flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-left">
          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          <span className="text-sm font-medium text-slate-700">Cambiar contraseña</span>
          <svg className="w-4 h-4 text-slate-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button className="w-full flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-left">
          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm font-medium text-slate-700">Descargar mis datos (RGPD)</span>
          <svg className="w-4 h-4 text-slate-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button className="w-full flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-left">
          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span className="text-sm font-medium text-red-500">Eliminar cuenta</span>
          <svg className="w-4 h-4 text-slate-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Cerrar sesión */}
      <button onClick={cerrarSesion}
        className="w-full flex items-center justify-center gap-2 p-4 bg-white border-2 border-red-200 text-red-600 font-semibold rounded-2xl hover:bg-red-50 transition-colors">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Cerrar sesión
      </button>

      <p className="text-xs text-slate-400 text-center pb-2">NEXA v0.1.0 · <a href="mailto:soporte@nexa.app" className="hover:underline">soporte@nexa.app</a></p>

    </div>
  );
}
