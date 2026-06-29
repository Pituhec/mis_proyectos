import { http } from "@/frontend/src/api/httpClient";

export interface PerfilActivacion {
  nombre: string; edad: string; telefono: string;
  contactoNombre: string; contactoTelefono: string;
  horariosLibres: string[]; recordatorios: string[];
}

export const pulseraService = {
  validarCodigo: (codigo: string) => http.post<{ ok: boolean }>("pulsera", { accion: "validar_codigo", codigo }),
  activar: (codigo: string, perfil: PerfilActivacion) => http.post<{ ok: boolean }>("pulsera", { accion: "activar", codigo, perfil }),
  estado: () => http.get<{ pulsera: Record<string, unknown> | null }>("pulsera"),
};
