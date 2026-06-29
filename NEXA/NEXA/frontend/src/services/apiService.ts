import { http } from "@/frontend/src/api/httpClient";

export interface LoginPayload { email: string; password: string; }
export interface RegisterPayload { nombre: string; email: string; password: string; }

export const apiService = {
  login:    (p: LoginPayload)    => http.post<{ ok: boolean }>("login", p),
  register: (p: RegisterPayload) => http.post<{ ok: boolean }>("register", p),
  logout:   ()                   => http.post<{ ok: boolean }>("logout", {}),
  session:  ()                   => http.get<{ autenticado: boolean }>("verify-session"),
};
