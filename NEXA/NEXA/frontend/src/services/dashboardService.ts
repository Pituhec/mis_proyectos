import { http } from "@/frontend/src/api/httpClient";

export interface DashboardData {
  sinPulsera?: boolean;
  pulsera: { id: number; id_publico: string; estado: string; bateria: number; ultima_conexion: string; persona_nombre: string; } | null;
  ubicacion: { lat: number; lng: number; registrado_en: string } | null;
  interacciones: { tipo: string; respuesta: string | null; detalle: string | null; ocurrido_en: string; }[];
  proximoRecordatorio: { tipo: string; hora: string } | null;
  alertasPendientes: { id: number; lat: number; lng: number; disparada_en: string }[];
}

export const dashboardService = {
  get: () => http.get<DashboardData>("dashboard"),
};
