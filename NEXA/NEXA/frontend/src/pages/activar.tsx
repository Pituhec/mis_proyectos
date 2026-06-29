"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { pulseraService, PerfilActivacion } from "@/frontend/src/services/pulseraService";

type Paso = 1 | 2 | 3;

const HORARIOS = ["Mañana (9–12h)", "Tarde (16–19h)", "Noche (20–22h)"];
const RECORDATORIOS = [
  { value: "medicacion", label: "Medicación" },
  { value: "paseo",      label: "Paseo diario" },
  { value: "llamada_familiar", label: "Llamada familiar" },
];

export default function ActivarPage() {
  const router = useRouter();
  const [paso, setPaso] = useState<Paso>(1);
  const [codigo, setCodigo] = useState("");
  const [perfil, setPerfil] = useState<PerfilActivacion>({
    nombre: "", edad: "", telefono: "",
    contactoNombre: "", contactoTelefono: "",
    horariosLibres: [], recordatorios: [],
  });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  function toggleHorario(h: string) {
    setPerfil(p => ({
      ...p,
      horariosLibres: p.horariosLibres.includes(h)
        ? p.horariosLibres.filter(x => x !== h)
        : [...p.horariosLibres, h],
    }));
  }

  function toggleRecordatorio(v: string) {
    setPerfil(p => ({
      ...p,
      recordatorios: p.recordatorios.includes(v)
        ? p.recordatorios.filter(x => x !== v)
        : [...p.recordatorios, v],
    }));
  }

  async function validarCodigo(e: React.FormEvent) {
    e.preventDefault(); setError(""); setCargando(true);
    try {
      await pulseraService.validarCodigo(codigo);
      setPaso(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Código no válido");
    } finally { setCargando(false); }
  }

  async function activar(e: React.FormEvent) {
    e.preventDefault(); setError(""); setCargando(true);
    try {
      await pulseraService.activar(codigo, perfil);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al activar la pulsera");
    } finally { setCargando(false); }
  }

  const progreso = [
    { n: 1, label: "Código" },
    { n: 2, label: "Perfil" },
    { n: 3, label: "Contacto" },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-nexa-50 to-white">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-nexa-600 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="font-bold text-nexa-900">NEXA</span>
      </Link>

      <div className="card w-full max-w-sm">
        {/* Indicador de pasos */}
        <p className="text-sm text-slate-500 mb-2">Paso {paso} de 3 — {progreso[paso - 1].label}</p>
        <div className="flex gap-1.5 mb-6">
          {progreso.map(({ n }) => (
            <div key={n} className={`h-1 flex-1 rounded-full transition-colors ${n <= paso ? "bg-nexa-600" : "bg-slate-200"}`} />
          ))}
        </div>

        {/* Paso 1: Código de activación */}
        {paso === 1 && (
          <form onSubmit={validarCodigo} className="space-y-4">
            <h1 className="text-xl font-semibold text-slate-900 mb-1">Activa tu pulsera</h1>
            <p className="text-sm text-slate-500">Introduce el código que viene en la caja de tu pulsera NEXA.</p>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Código de activación</label>
              <input
                type="text"
                className="input-base font-mono uppercase tracking-widest text-center text-lg"
                placeholder="NEXA-XXXX-XXXX"
                value={codigo}
                onChange={e => setCodigo(e.target.value.toUpperCase())}
                required
                maxLength={14}
              />
              <p className="mt-1.5 text-xs text-slate-400">Ejemplo: NEXA-AB12-CD34</p>
            </div>
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
            <button type="submit" className="btn-primary w-full" disabled={cargando}>
              {cargando ? "Verificando..." : "Verificar código →"}
            </button>
            <p className="text-center text-sm text-slate-500">
              ¿Ya tienes cuenta?{" "}
              <Link href="/auth/login" className="text-nexa-600 font-medium hover:underline">Iniciar sesión</Link>
            </p>
          </form>
        )}

        {/* Paso 2: Perfil de la persona mayor */}
        {paso === 2 && (
          <form onSubmit={e => { e.preventDefault(); setPaso(3); }} className="space-y-4">
            <h1 className="text-xl font-semibold text-slate-900 mb-1">Datos de tu familiar</h1>
            <p className="text-sm text-slate-500">Cuéntanos sobre la persona que usará la pulsera.</p>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre completo</label>
              <input type="text" className="input-base" placeholder="Manuel García"
                value={perfil.nombre} onChange={e => setPerfil(p => ({ ...p, nombre: e.target.value }))} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Edad</label>
                <input type="number" className="input-base" placeholder="75"
                  value={perfil.edad} onChange={e => setPerfil(p => ({ ...p, edad: e.target.value }))} min={60} max={120} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Teléfono</label>
                <input type="tel" className="input-base" placeholder="612 345 678"
                  value={perfil.telefono} onChange={e => setPerfil(p => ({ ...p, telefono: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Horarios libres</label>
              <div className="flex flex-wrap gap-2">
                {HORARIOS.map(h => (
                  <button key={h} type="button"
                    onClick={() => toggleHorario(h)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                      perfil.horariosLibres.includes(h)
                        ? "bg-nexa-600 text-white border-nexa-600"
                        : "bg-white text-slate-600 border-slate-300 hover:border-nexa-400"
                    }`}>
                    {h}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Recordatorios</label>
              <div className="flex flex-wrap gap-2">
                {RECORDATORIOS.map(({ value, label }) => (
                  <button key={value} type="button"
                    onClick={() => toggleRecordatorio(value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                      perfil.recordatorios.includes(value)
                        ? "bg-nexa-600 text-white border-nexa-600"
                        : "bg-white text-slate-600 border-slate-300 hover:border-nexa-400"
                    }`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="btn-primary w-full">Continuar →</button>
            <button type="button" className="btn-secondary w-full" onClick={() => setPaso(1)}>← Atrás</button>
          </form>
        )}

        {/* Paso 3: Contacto de emergencia + activar */}
        {paso === 3 && (
          <form onSubmit={activar} className="space-y-4">
            <h1 className="text-xl font-semibold text-slate-900 mb-1">Contacto de emergencia</h1>
            <p className="text-sm text-slate-500">Si la pulsera detecta una emergencia, avisaremos a esta persona.</p>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre del contacto</label>
              <input type="text" className="input-base" placeholder="Laura García"
                value={perfil.contactoNombre} onChange={e => setPerfil(p => ({ ...p, contactoNombre: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Teléfono del contacto</label>
              <input type="tel" className="input-base" placeholder="678 901 234"
                value={perfil.contactoTelefono} onChange={e => setPerfil(p => ({ ...p, contactoTelefono: e.target.value }))} />
            </div>
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
            <button type="submit" className="btn-primary w-full" disabled={cargando}>
              {cargando ? "Activando..." : "Activar pulsera ✓"}
            </button>
            <button type="button" className="btn-secondary w-full" onClick={() => setPaso(2)}>← Atrás</button>
          </form>
        )}
      </div>
    </main>
  );
}
