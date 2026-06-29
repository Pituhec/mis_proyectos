"use client";
import { useState } from "react";

const FAQS = [
  {
    p: "¿Necesito un smartphone para usar NEXA?",
    r: "No. La pulsera funciona de forma autónoma con conexión 4G y WiFi. Tú recibirás las alertas en tu móvil, pero la persona mayor no necesita teléfono.",
  },
  {
    p: "¿Funciona fuera de España?",
    r: "Sí. La pulsera tiene cobertura en toda la Unión Europea sin coste adicional.",
  },
  {
    p: "¿Qué pasa si se queda sin batería?",
    r: "Recibirás una notificación cuando la batería baje del 20%. La pulsera dura entre 48 y 72 horas con una carga completa.",
  },
  {
    p: "¿Cómo se activa la pulsera?",
    r: "Con el código de activación que viene en la caja. El proceso tarda menos de 5 minutos en la sección 'Activar pulsera'.",
  },
  {
    p: "¿Cuántos familiares pueden recibir alertas?",
    r: "Hasta 5 contactos de emergencia pueden recibir notificaciones simultáneamente.",
  },
  {
    p: "¿Es resistente al agua?",
    r: "Sí, la pulsera tiene certificación IP67 (resistente a salpicaduras y lluvia, no apta para natación).",
  },
  {
    p: "¿Puedo cancelar la suscripción?",
    r: "Sí, puedes cancelar en cualquier momento desde Ajustes → Suscripción sin permanencia.",
  },
];

const GUIAS = [
  { icon: "⌚", titulo: "Activar la pulsera", desc: "Introduce el código de la caja y completa el perfil en 5 minutos.", href: "/activar" },
  { icon: "📞", titulo: "Configurar emergencias", desc: "Añade hasta 5 contactos que recibirán alertas automáticas.", href: "/dashboard/perfil" },
  { icon: "🔔", titulo: "Gestionar recordatorios", desc: "Programa medicación, paseos y llamadas a horas concretas.", href: "/dashboard/familia" },
  { icon: "📍", titulo: "Ver la ubicación", desc: "Consulta en tiempo real dónde está tu familiar.", href: "/dashboard/familia" },
];

export default function AyudaPage() {
  const [abierto, setAbierto] = useState<number | null>(null);
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    await new Promise(r => setTimeout(r, 800));
    setEnviando(false);
    setEnviado(true);
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">

      <div>
        <p className="text-sm text-slate-500">Centro de</p>
        <h1 className="text-xl font-bold text-slate-900">Ayuda y soporte</h1>
      </div>

      {/* Contacto rápido */}
      <div className="grid grid-cols-2 gap-3">
        <a href="tel:900123456"
          className="card flex flex-col items-center gap-2 py-5 hover:border-nexa-300 hover:shadow-md transition-all text-center">
          <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">900 123 456</p>
            <p className="text-xs text-slate-500">Gratuito · Lun–Vie 9–18h</p>
          </div>
        </a>
        <a href="mailto:soporte@nexa.app"
          className="card flex flex-col items-center gap-2 py-5 hover:border-nexa-300 hover:shadow-md transition-all text-center">
          <div className="w-12 h-12 rounded-2xl bg-nexa-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-nexa-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Enviar email</p>
            <p className="text-xs text-slate-500">soporte@nexa.app</p>
          </div>
        </a>
      </div>

      {/* Manual rápido */}
      <div className="card space-y-3">
        <h2 className="font-bold text-slate-900">Manual rápido</h2>
        <div className="space-y-2">
          {GUIAS.map((g, i) => (
            <a key={i} href={g.href}
              className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-nexa-50 hover:border-nexa-200 border border-transparent transition-all">
              <span className="text-2xl shrink-0">{g.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">{g.titulo}</p>
                <p className="text-xs text-slate-500">{g.desc}</p>
              </div>
              <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="card space-y-2">
        <h2 className="font-bold text-slate-900 mb-3">Preguntas frecuentes</h2>
        {FAQS.map((faq, i) => (
          <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setAbierto(abierto === i ? null : i)}
              className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-slate-50 transition-colors">
              <span className="text-sm font-medium text-slate-800">{faq.p}</span>
              <svg className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${abierto === i ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {abierto === i && (
              <div className="px-4 pb-4 text-sm text-slate-600 bg-slate-50">{faq.r}</div>
            )}
          </div>
        ))}
      </div>

      {/* Formulario de soporte */}
      <div className="card">
        <h2 className="font-bold text-slate-900 mb-1">¿No encuentras lo que buscas?</h2>
        <p className="text-sm text-slate-500 mb-4">Escríbenos y te respondemos en menos de 24 horas.</p>
        {enviado ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-2xl mb-1">✅</p>
            <p className="font-semibold text-green-700">Mensaje enviado</p>
            <p className="text-sm text-green-600 mt-1">Te respondemos en menos de 24h</p>
          </div>
        ) : (
          <form onSubmit={enviar} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre</label>
                <input type="text" className="input-base" value={form.nombre}
                  onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Correo</label>
                <input type="email" className="input-base" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">¿Cuál es tu duda?</label>
              <textarea className="input-base resize-none" rows={4} value={form.mensaje}
                onChange={e => setForm(f => ({ ...f, mensaje: e.target.value }))} required
                placeholder="Describe el problema o pregunta..." />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={enviando}>
              {enviando ? "Enviando..." : "Enviar mensaje"}
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
