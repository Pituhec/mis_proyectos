"use client";
import { useEffect, useState } from "react";
import { http } from "@/frontend/src/api/httpClient";

const HORARIOS = ["Mañana (9–12h)", "Tarde (16–19h)", "Noche (20–22h)"];
const RECORDATORIOS_OP = [
  { value: "medicacion",       label: "Medicación",      icon: "💊" },
  { value: "paseo",            label: "Paseo diario",    icon: "🚶" },
  { value: "llamada_familiar", label: "Llamada familiar",icon: "📞" },
];

interface Contacto { id: number; nombre: string; telefono: string; parentesco: string; prioridad: number; }
interface PerfilData {
  cuenta: { nombre: string; email: string; };
  persona: {
    nombre: string; edad: number; telefono: string;
    horarios: string[]; recordatorios: string[];
    necesidades: string;
    permisos: { localizacion: boolean; datos_medicos: boolean; };
  };
  contactos: Contacto[];
}

type Seccion = "personal" | "contactos" | "preferencias" | "permisos";

export default function PerfilPage() {
  const [data, setData] = useState<PerfilData | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [exito, setExito] = useState(false);
  const [seccion, setSeccion] = useState<Seccion>("personal");

  useEffect(() => {
    http.get<PerfilData>("perfil").then(setData).finally(() => setCargando(false));
  }, []);

  async function guardar() {
    setGuardando(true);
    await new Promise(r => setTimeout(r, 600));
    setGuardando(false);
    setExito(true);
    setTimeout(() => setExito(false), 3000);
  }

  function toggleHorario(h: string) {
    if (!data) return;
    setData(d => d ? {
      ...d,
      persona: {
        ...d.persona,
        horarios: d.persona.horarios.includes(h)
          ? d.persona.horarios.filter(x => x !== h)
          : [...d.persona.horarios, h],
      },
    } : d);
  }

  function toggleRec(v: string) {
    if (!data) return;
    setData(d => d ? {
      ...d,
      persona: {
        ...d.persona,
        recordatorios: d.persona.recordatorios.includes(v)
          ? d.persona.recordatorios.filter(x => x !== v)
          : [...d.persona.recordatorios, v],
      },
    } : d);
  }

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-nexa-200 border-t-nexa-600 rounded-full animate-spin" />
      </div>
    );
  }

  const SECCIONES: { id: Seccion; label: string; icon: string }[] = [
    { id: "personal",    label: "Datos",      icon: "👤" },
    { id: "contactos",   label: "Contactos",  icon: "📞" },
    { id: "preferencias",label: "Preferencias",icon: "⚙️" },
    { id: "permisos",    label: "Permisos",   icon: "🔒" },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4">

      <div>
        <p className="text-sm text-slate-500">Gestión de</p>
        <h1 className="text-xl font-bold text-slate-900">Perfil del familiar</h1>
      </div>

      {/* Tabs secciones */}
      <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-xl">
        {SECCIONES.map(s => (
          <button key={s.id} onClick={() => setSeccion(s.id)}
            className={`py-2 text-[11px] font-semibold rounded-lg flex flex-col items-center gap-0.5 transition-colors ${
              seccion === s.id ? "bg-white text-nexa-700 shadow-sm" : "text-slate-500"
            }`}>
            <span>{s.icon}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {exito && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Cambios guardados correctamente
        </div>
      )}

      {/* Sección: Datos personales */}
      {seccion === "personal" && data && (
        <div className="card space-y-4">
          <h2 className="font-bold text-slate-900">Datos de {data.persona.nombre}</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre completo</label>
            <input type="text" className="input-base" value={data.persona.nombre}
              onChange={e => setData(d => d ? { ...d, persona: { ...d.persona, nombre: e.target.value } } : d)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Edad</label>
              <input type="number" className="input-base" value={data.persona.edad}
                onChange={e => setData(d => d ? { ...d, persona: { ...d.persona, edad: Number(e.target.value) } } : d)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Teléfono</label>
              <input type="tel" className="input-base" value={data.persona.telefono}
                onChange={e => setData(d => d ? { ...d, persona: { ...d.persona, telefono: e.target.value } } : d)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Necesidades especiales</label>
            <textarea className="input-base resize-none" rows={3} value={data.persona.necesidades}
              onChange={e => setData(d => d ? { ...d, persona: { ...d.persona, necesidades: e.target.value } } : d)}
              placeholder="Ej: dificultad de movilidad, usa bastón..." />
          </div>
          <div className="pt-1 border-t border-slate-100">
            <p className="text-xs text-slate-400 mb-2">Tu cuenta</p>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Tu nombre</label>
              <input type="text" className="input-base" value={data.cuenta.nombre}
                onChange={e => setData(d => d ? { ...d, cuenta: { ...d.cuenta, nombre: e.target.value } } : d)} />
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Tu correo</label>
              <input type="email" className="input-base" value={data.cuenta.email} disabled
                className="input-base bg-slate-50 text-slate-400 cursor-not-allowed" />
            </div>
          </div>
          <button onClick={guardar} className="btn-primary w-full" disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      )}

      {/* Sección: Contactos de emergencia */}
      {seccion === "contactos" && data && (
        <div className="card space-y-4">
          <h2 className="font-bold text-slate-900">Contactos de emergencia</h2>
          <p className="text-sm text-slate-500">Se avisará en este orden cuando ocurra una emergencia.</p>
          <ul className="space-y-3">
            {data.contactos.map((c, i) => (
              <li key={c.id} className="p-3 bg-slate-50 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-nexa-600">Contacto #{c.prioridad}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Nombre</label>
                    <input type="text" className="input-base text-sm py-2" value={c.nombre}
                      onChange={e => {
                        const nc = [...data.contactos];
                        nc[i] = { ...nc[i], nombre: e.target.value };
                        setData(d => d ? { ...d, contactos: nc } : d);
                      }} />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Parentesco</label>
                    <input type="text" className="input-base text-sm py-2" value={c.parentesco}
                      onChange={e => {
                        const nc = [...data.contactos];
                        nc[i] = { ...nc[i], parentesco: e.target.value };
                        setData(d => d ? { ...d, contactos: nc } : d);
                      }} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Teléfono</label>
                  <input type="tel" className="input-base text-sm py-2" value={c.telefono}
                    onChange={e => {
                      const nc = [...data.contactos];
                      nc[i] = { ...nc[i], telefono: e.target.value };
                      setData(d => d ? { ...d, contactos: nc } : d);
                    }} />
                </div>
              </li>
            ))}
          </ul>
          <button onClick={guardar} className="btn-primary w-full" disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar contactos"}
          </button>
        </div>
      )}

      {/* Sección: Preferencias */}
      {seccion === "preferencias" && data && (
        <div className="card space-y-5">
          <h2 className="font-bold text-slate-900">Preferencias de uso</h2>
          <div>
            <p className="text-sm font-medium text-slate-700 mb-3">Horarios libres</p>
            <div className="space-y-2">
              {HORARIOS.map(h => (
                <button key={h} type="button" onClick={() => toggleHorario(h)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${
                    data.persona.horarios.includes(h)
                      ? "bg-nexa-50 border-nexa-300 text-nexa-800"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                    data.persona.horarios.includes(h) ? "bg-nexa-600 border-nexa-600" : "border-slate-300"
                  }`}>
                    {data.persona.horarios.includes(h) && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium">{h}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700 mb-3">Recordatorios activos</p>
            <div className="space-y-2">
              {RECORDATORIOS_OP.map(({ value, label, icon }) => (
                <button key={value} type="button" onClick={() => toggleRec(value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${
                    data.persona.recordatorios.includes(value)
                      ? "bg-nexa-50 border-nexa-300 text-nexa-800"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                    data.persona.recordatorios.includes(value) ? "bg-nexa-600 border-nexa-600" : "border-slate-300"
                  }`}>
                    {data.persona.recordatorios.includes(value) && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-lg">{icon}</span>
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
          <button onClick={guardar} className="btn-primary w-full" disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar preferencias"}
          </button>
        </div>
      )}

      {/* Sección: Permisos */}
      {seccion === "permisos" && data && (
        <div className="card space-y-4">
          <h2 className="font-bold text-slate-900">Permisos y privacidad</h2>
          <p className="text-sm text-slate-500">Controla qué datos recopila y comparte la pulsera NEXA.</p>
          <div className="space-y-3">
            {([
              { key: "localizacion",   label: "Geolocalización en tiempo real", desc: "Permite ver la ubicación exacta de la pulsera en el mapa." },
              { key: "datos_medicos",  label: "Datos de salud",                  desc: "Permite registrar frecuencia cardíaca y otros datos biométricos." },
            ] as const).map(({ key, label, desc }) => (
              <div key={key} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">{label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                </div>
                <button
                  onClick={() => setData(d => d ? {
                    ...d,
                    persona: { ...d.persona, permisos: { ...d.persona.permisos, [key]: !d.persona.permisos[key] } },
                  } : d)}
                  className={`relative shrink-0 w-11 h-6 rounded-full transition-colors ${
                    data.persona.permisos[key] ? "bg-nexa-600" : "bg-slate-300"
                  }`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    data.persona.permisos[key] ? "translate-x-5" : "translate-x-0"
                  }`} />
                </button>
              </div>
            ))}
          </div>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs text-amber-700 font-medium">Información RGPD</p>
            <p className="text-xs text-amber-600 mt-1">
              Tus datos son tratados conforme al Reglamento General de Protección de Datos (RGPD). Puedes ejercer tus derechos escribiendo a privacidad@nexa.app.
            </p>
          </div>
          <button onClick={guardar} className="btn-primary w-full" disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar permisos"}
          </button>
        </div>
      )}

    </div>
  );
}
