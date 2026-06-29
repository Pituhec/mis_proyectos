"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiService } from "@/frontend/src/services/apiService";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(""); setCargando(true);
    try { await apiService.login(form); router.push("/dashboard"); }
    catch (err) { setError(err instanceof Error ? err.message : "Error al iniciar sesión"); }
    finally { setCargando(false); }
  }

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
        <h1 className="text-xl font-semibold text-slate-900 mb-1">Iniciar sesión</h1>
        <p className="text-sm text-slate-500 mb-6">Accede para ver a tu familiar.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Correo</label>
            <input type="email" className="input-base" placeholder="tu@email.com"
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required autoComplete="email" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Contraseña</label>
            <input type="password" className="input-base" placeholder="••••••••"
              value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required autoComplete="current-password" />
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
          <button type="submit" className="btn-primary w-full" disabled={cargando}>{cargando ? "Entrando..." : "Entrar"}</button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-500">
          ¿Sin cuenta?{" "}
          <Link href="/auth/registro" className="text-nexa-600 font-medium hover:underline">Crear cuenta</Link>
        </p>
      </div>
    </main>
  );
}
