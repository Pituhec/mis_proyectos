"use client";
import { useState } from "react";
import Link from "next/link";

const FAQS = [
  { p: "¿Necesito smartphone para usar NEXA?",      r: "No. La pulsera funciona de forma autónoma con 4G y WiFi. Solo tú recibes las alertas en tu móvil." },
  { p: "¿Funciona fuera de España?",                r: "Sí. Cobertura en toda la Unión Europea sin coste adicional." },
  { p: "¿Cuánto dura la batería?",                  r: "Entre 48 y 72 horas con una carga completa. Te avisamos cuando baje del 20%." },
  { p: "¿Cómo se activa la pulsera?",               r: "Con el código de la caja, en menos de 5 minutos desde esta web." },
  { p: "¿Cuántos familiares reciben las alertas?",  r: "Hasta 5 contactos de emergencia al mismo tiempo." },
  { p: "¿Puedo cancelar en cualquier momento?",     r: "Sí, sin permanencia ni penalizaciones desde la sección de Ajustes." },
];

function NavPublica() {
  const [menu, setMenu] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-nexa-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold text-nexa-900 text-lg">NEXA</span>
        </Link>
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
          <a href="#producto" className="hover:text-nexa-700 transition-colors">Producto</a>
          <a href="#como-funciona" className="hover:text-nexa-700 transition-colors">Cómo funciona</a>
          <a href="#precios" className="hover:text-nexa-700 transition-colors">Precios</a>
          <a href="#faq" className="hover:text-nexa-700 transition-colors">FAQ</a>
          <a href="#contacto" className="hover:text-nexa-700 transition-colors">Contacto</a>
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <Link href="/auth/login" className="btn-secondary text-sm py-2 px-4">Entrar</Link>
          <Link href="/activar" className="btn-primary text-sm py-2 px-4">Activar pulsera</Link>
        </div>
        {/* Mobile menu */}
        <button className="md:hidden p-2 text-slate-600" onClick={() => setMenu(!menu)}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menu
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>
      {menu && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-3 text-sm">
          {["#producto", "#como-funciona", "#precios", "#faq", "#contacto"].map(h => (
            <a key={h} href={h} onClick={() => setMenu(false)}
              className="block py-2 text-slate-600 hover:text-nexa-700 capitalize">
              {h.replace("#", "").replace("-", " ")}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
            <Link href="/auth/login" className="btn-secondary text-center text-sm">Entrar</Link>
            <Link href="/activar" className="btn-primary text-center text-sm">Activar pulsera</Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default function LandingPage() {
  const [faqAbierto, setFaqAbierto] = useState<number | null>(null);

  return (
    <>
      <NavPublica />
      <main className="pt-16">

        {/* ═══ HERO ═══ */}
        <section className="min-h-[90vh] flex items-center bg-gradient-to-br from-nexa-50 via-white to-slate-50 px-4">
          <div className="max-w-5xl mx-auto w-full py-20">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-nexa-700 bg-nexa-100 px-3 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-nexa-600 animate-pulse" />
                Tecnología diseñada para personas mayores
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
                La pulsera que cuida<br />
                <span className="text-nexa-600">a los tuyos</span>
              </h1>
              <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                Geolocalización, botón de pánico y recordatorios inteligentes para personas mayores.
                Tranquilidad real para toda la familia.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/activar" className="btn-primary text-base px-8 py-3 text-center">
                  Activar mi pulsera →
                </Link>
                <a href="#como-funciona" className="btn-secondary text-base px-8 py-3 text-center">
                  Cómo funciona
                </a>
              </div>
              <div className="flex items-center gap-6 mt-8 text-sm text-slate-400">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Sin permanencia
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Activación en 5 min
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Cobertura Europa
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ QUÉ ES NEXA ═══ */}
        <section id="producto" className="py-20 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4">¿Qué es NEXA?</h2>
              <p className="text-slate-500 max-w-xl mx-auto">
                Una pulsera inteligente con conexión 4G que da independencia a las personas mayores
                y tranquilidad a sus familias, sin complicaciones.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: "🆘",
                  color: "bg-red-50",
                  titulo: "Botón de pánico",
                  desc: "Un solo toque avisa a todos los contactos de emergencia con la ubicación exacta en tiempo real.",
                },
                {
                  icon: "📍",
                  color: "bg-nexa-50",
                  titulo: "Geolocalización",
                  desc: "Sabe siempre dónde está tu familiar. Consulta la ubicación desde el móvil en cualquier momento.",
                },
                {
                  icon: "🔔",
                  color: "bg-amber-50",
                  titulo: "Recordatorios",
                  desc: "Medicación, paseos y llamadas programadas. La pulsera avisa con voz para que nunca se olviden.",
                },
                {
                  icon: "🔋",
                  color: "bg-green-50",
                  titulo: "48–72h de batería",
                  desc: "Batería de larga duración con cargador magnético fácil de usar. Aviso automático cuando baja.",
                },
                {
                  icon: "💧",
                  color: "bg-blue-50",
                  titulo: "Resistente al agua",
                  desc: "Certificación IP67. Resiste salpicaduras, lluvia y el lavado de manos sin problema.",
                },
                {
                  icon: "👨‍👩‍👧",
                  color: "bg-purple-50",
                  titulo: "Hasta 5 cuidadores",
                  desc: "Toda la familia conectada. Cada uno recibe alertas y puede ver el estado de la pulsera.",
                },
              ].map(({ icon, color, titulo, desc }) => (
                <div key={titulo} className="card hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-2xl mb-4`}>
                    {icon}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{titulo}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CÓMO FUNCIONA ═══ */}
        <section id="como-funciona" className="py-20 px-4 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Cómo funciona</h2>
              <p className="text-slate-500">En menos de 10 minutos, completamente operativa.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-nexa-200" />
              {[
                {
                  num: "01",
                  titulo: "Activa la pulsera",
                  desc: "Introduce el código de activación de la caja. Crea tu cuenta en menos de 2 minutos.",
                  href: "/activar",
                  cta: "Activar ahora",
                },
                {
                  num: "02",
                  titulo: "Configura el perfil",
                  desc: "Añade los datos del familiar y hasta 5 contactos de emergencia que recibirán las alertas.",
                  href: null,
                  cta: null,
                },
                {
                  num: "03",
                  titulo: "Tranquilidad 24/7",
                  desc: "Recibe notificaciones, consulta la ubicación y gestiona los recordatorios desde tu móvil.",
                  href: "/auth/registro",
                  cta: "Crear cuenta",
                },
              ].map(({ num, titulo, desc, href, cta }) => (
                <div key={num} className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-nexa-600 flex items-center justify-center mx-auto mb-5">
                    <span className="text-white font-black text-lg">{num}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{titulo}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">{desc}</p>
                  {href && cta && (
                    <Link href={href} className="text-nexa-600 text-sm font-semibold hover:underline">{cta} →</Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PRECIOS ═══ */}
        <section id="precios" className="py-20 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Precios sencillos</h2>
              <p className="text-slate-500">Sin sorpresas. Sin permanencia. Cancela cuando quieras.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {/* Mensual */}
              <div className="card border-slate-200 hover:shadow-md transition-shadow">
                <div className="mb-6">
                  <p className="text-sm font-semibold text-slate-500 mb-1">Plan mensual</p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-extrabold text-slate-900">14,90</span>
                    <span className="text-slate-500 mb-1.5">€/mes</span>
                  </div>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {["Geolocalización en tiempo real", "Botón de pánico", "Recordatorios de voz", "Hasta 5 contactos", "Soporte prioritario"].map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600">
                      <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/activar" className="btn-secondary w-full block text-center">Empezar</Link>
              </div>
              {/* Anual */}
              <div className="card border-nexa-300 bg-nexa-50 relative hover:shadow-md transition-shadow">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-nexa-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Ahorra 60€
                </span>
                <div className="mb-6">
                  <p className="text-sm font-semibold text-nexa-600 mb-1">Plan anual</p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-extrabold text-slate-900">9,90</span>
                    <span className="text-slate-500 mb-1.5">€/mes</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Facturado anualmente (118,80€/año)</p>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {["Todo lo del plan mensual", "2 meses gratis incluidos", "Informes mensuales PDF", "Historial ilimitado", "Soporte VIP 24h"].map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600">
                      <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/activar" className="btn-primary w-full block text-center">Empezar con descuento</Link>
              </div>
            </div>
            <p className="text-center text-xs text-slate-400 mt-6">
              La pulsera física tiene un coste único de 59€. La suscripción incluye el servicio de conectividad y la app.
            </p>
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section id="faq" className="py-20 px-4 bg-slate-50">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Preguntas frecuentes</h2>
              <p className="text-slate-500">Todo lo que necesitas saber antes de empezar.</p>
            </div>
            <div className="space-y-2">
              {FAQS.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <button onClick={() => setFaqAbierto(faqAbierto === i ? null : i)}
                    className="w-full flex items-center justify-between gap-3 p-5 text-left hover:bg-slate-50 transition-colors">
                    <span className="font-medium text-slate-800">{faq.p}</span>
                    <svg className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${faqAbierto === i ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {faqAbierto === i && (
                    <div className="px-5 pb-5 text-slate-500 text-sm leading-relaxed bg-slate-50">{faq.r}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CONTACTO ═══ */}
        <section id="contacto" className="py-20 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4">¿Tienes alguna duda?</h2>
              <p className="text-slate-500">Nuestro equipo está aquí para ayudarte.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <a href="tel:900123456"
                className="card text-center hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <p className="font-bold text-slate-900">900 123 456</p>
                <p className="text-sm text-slate-500 mt-1">Gratuito · Lun–Vie 9–18h</p>
              </a>
              <a href="mailto:hola@nexa.app"
                className="card text-center hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-nexa-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-nexa-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="font-bold text-slate-900">hola@nexa.app</p>
                <p className="text-sm text-slate-500 mt-1">Respuesta en menos de 24h</p>
              </a>
              <div className="card text-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="font-bold text-slate-900">Centro de ayuda</p>
                <Link href="/dashboard/ayuda" className="text-sm text-nexa-600 font-medium hover:underline mt-1 block">
                  Ver guías y FAQs →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ CTA FINAL ═══ */}
        <section className="py-20 px-4 bg-nexa-600">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white mb-4">
              Empieza hoy mismo
            </h2>
            <p className="text-nexa-200 mb-8">
              Tu familiar merece la mejor protección. Activa la pulsera en menos de 5 minutos.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/activar"
                className="bg-white text-nexa-700 font-bold px-8 py-3 rounded-xl hover:bg-nexa-50 transition-colors text-center">
                Activar pulsera →
              </Link>
              <Link href="/auth/registro"
                className="border-2 border-white/40 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors text-center">
                Crear cuenta
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="bg-slate-900 text-slate-400 py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-nexa-600 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="font-bold text-white">NEXA</span>
                </div>
                <p className="text-xs leading-relaxed">Tecnología que conecta personas, no solo dispositivos.</p>
              </div>
              <div>
                <p className="text-white font-semibold text-sm mb-3">Producto</p>
                <ul className="space-y-2 text-xs">
                  <li><a href="#producto" className="hover:text-white transition-colors">Qué es NEXA</a></li>
                  <li><a href="#como-funciona" className="hover:text-white transition-colors">Cómo funciona</a></li>
                  <li><a href="#precios" className="hover:text-white transition-colors">Precios</a></li>
                </ul>
              </div>
              <div>
                <p className="text-white font-semibold text-sm mb-3">Soporte</p>
                <ul className="space-y-2 text-xs">
                  <li><a href="#faq" className="hover:text-white transition-colors">Preguntas frecuentes</a></li>
                  <li><a href="mailto:soporte@nexa.app" className="hover:text-white transition-colors">soporte@nexa.app</a></li>
                  <li><a href="tel:900123456" className="hover:text-white transition-colors">900 123 456</a></li>
                </ul>
              </div>
              <div>
                <p className="text-white font-semibold text-sm mb-3">Legal</p>
                <ul className="space-y-2 text-xs">
                  <li><a href="#" className="hover:text-white transition-colors">Política de privacidad</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Términos y condiciones</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">RGPD</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
              <p className="text-xs">© 2026 NEXA. Todos los derechos reservados.</p>
              <div className="flex gap-4 text-xs">
                <Link href="/auth/login" className="hover:text-white transition-colors">Iniciar sesión</Link>
                <Link href="/activar" className="text-nexa-400 font-semibold hover:text-nexa-300 transition-colors">Activar pulsera →</Link>
              </div>
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}
