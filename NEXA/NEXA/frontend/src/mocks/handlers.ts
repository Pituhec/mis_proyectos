type Method = "GET" | "POST" | "PATCH" | "DELETE";

const PULSERA_MOCK = {
  id: 1,
  id_publico: "NEXA-001",
  estado: "activada",
  bateria: 78,
  ultima_conexion: new Date().toISOString(),
  persona_nombre: "Manuel García",
  persona_id: 1,
};

const MOCKS: Record<string, Partial<Record<Method, unknown>>> = {
  "login":          { POST: { ok: true } },
  "register":       { POST: { ok: true } },
  "logout":         { POST: { ok: true } },
  "verify-session": { GET: { autenticado: true, session: { id: 1, email: "demo@nexa.app", rol: "familiar" } } },
  "ping":           { GET: { ok: true, ts: new Date().toISOString() } },

  "pulsera": {
    GET:  { pulsera: PULSERA_MOCK },
    POST: { ok: true },
  },

  "dashboard": {
    GET: {
      pulsera: PULSERA_MOCK,
      ubicacion: { lat: 40.4168, lng: -3.7038, registrado_en: new Date().toISOString() },
      interacciones: [
        { tipo: "medicacion",       respuesta: "si",  detalle: null,             ocurrido_en: new Date(Date.now() - 1_800_000).toISOString() },
        { tipo: "paseo",            respuesta: "no",  detalle: "No quiso salir", ocurrido_en: new Date(Date.now() - 5_400_000).toISOString() },
        { tipo: "llamada_familiar", respuesta: "si",  detalle: null,             ocurrido_en: new Date(Date.now() - 10_800_000).toISOString() },
      ],
      proximoRecordatorio: { tipo: "medicacion", hora: "20:00:00" },
      alertasPendientes: [],
    },
  },

  "recordatorios": {
    GET: {
      recordatorios: [
        { id: 1, tipo: "medicacion",       titulo: "Pastilla tensión", hora: "09:00:00", dias_semana: [0,1,2,3,4,5,6], activo: true  },
        { id: 2, tipo: "paseo",            titulo: null,               hora: "11:00:00", dias_semana: [1,2,3,4,5],     activo: true  },
        { id: 3, tipo: "llamada_familiar", titulo: null,               hora: "18:00:00", dias_semana: [0,6],            activo: false },
        { id: 4, tipo: "medicacion",       titulo: "Pastilla noche",   hora: "20:00:00", dias_semana: [0,1,2,3,4,5,6], activo: true  },
      ],
    },
    POST:  { ok: true, id: 5 },
    PATCH: { ok: true },
  },

  "perfil": {
    GET: {
      cuenta: { nombre: "Ana López", email: "demo@nexa.app" },
      persona: {
        nombre: "Manuel García", edad: 76, telefono: "612 345 678",
        horarios: ["Mañana (9–12h)", "Tarde (16–19h)"],
        recordatorios: ["medicacion", "paseo"],
        necesidades: "Problemas de movilidad reducida. Usa bastón.",
        permisos: { localizacion: true, datos_medicos: false },
      },
      contactos: [
        { id: 1, nombre: "Ana López",    telefono: "612 345 678", parentesco: "Hija",   prioridad: 1 },
        { id: 2, nombre: "Carlos García",telefono: "698 765 432", parentesco: "Hijo",   prioridad: 2 },
        { id: 3, nombre: "Dr. Martínez", telefono: "900 123 456", parentesco: "Médico", prioridad: 3 },
      ],
    },
    PATCH: { ok: true },
  },

  "familia": {
    GET: {
      pulsera: PULSERA_MOCK,
      ubicacion: { lat: 40.4168, lng: -3.7038, registrado_en: new Date().toISOString(), precision_m: 15 },
      alertas: [
        { id: 3, tipo: "panico",    estado: "atendida",   disparada_en: new Date(Date.now() - 86_400_000 * 2).toISOString(), lat: 40.4170, lng: -3.7040 },
        { id: 2, tipo: "bateria",   estado: "atendida",   disparada_en: new Date(Date.now() - 86_400_000 * 5).toISOString(), lat: null,    lng: null    },
        { id: 1, tipo: "panico",    estado: "falsa_alarma",disparada_en: new Date(Date.now() - 86_400_000 * 10).toISOString(), lat: 40.4165, lng: -3.7030},
      ],
      contactos: [
        { id: 1, nombre: "Ana López",    telefono: "612 345 678", parentesco: "Hija",   prioridad: 1 },
        { id: 2, nombre: "Carlos García",telefono: "698 765 432", parentesco: "Hijo",   prioridad: 2 },
      ],
      recordatorios: [
        { id: 1, tipo: "medicacion", titulo: "Pastilla tensión", hora: "09:00:00", dias_semana: [0,1,2,3,4,5,6], activo: true  },
        { id: 2, tipo: "paseo",      titulo: null,               hora: "11:00:00", dias_semana: [1,2,3,4,5],     activo: true  },
        { id: 4, tipo: "medicacion", titulo: "Pastilla noche",   hora: "20:00:00", dias_semana: [0,1,2,3,4,5,6], activo: true  },
      ],
    },
  },

  "ajustes": {
    GET: {
      voz_activa: true,
      alerta_bateria: true,
      alerta_panico: true,
      alerta_desconexion: true,
      notificaciones_email: true,
      notificaciones_push: false,
    },
    PATCH: { ok: true },
  },
};

export function mockRequest<T>(method: Method, slug: string): T {
  const controller = MOCKS[slug];
  if (!controller) throw new Error(`[mock] Ruta '${slug}' no encontrada`);
  const response = controller[method];
  if (response === undefined) throw new Error(`[mock] Método ${method} no soportado en '${slug}'`);
  return response as T;
}
