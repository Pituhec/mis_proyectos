import { mockRequest } from "@/frontend/src/mocks/handlers";

const BASE = "/api";
type Method = "GET" | "POST" | "PATCH" | "DELETE";
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

async function request<T>(method: Method, slug: string, body?: unknown): Promise<T> {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 300));
    return mockRequest<T>(method, slug);
  }
  const res = await fetch(`${BASE}/${slug}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data as T;
}

export const http = {
  get:    <T>(slug: string)                => request<T>("GET",    slug),
  post:   <T>(slug: string, body: unknown) => request<T>("POST",   slug, body),
  patch:  <T>(slug: string, body: unknown) => request<T>("PATCH",  slug, body),
  delete: <T>(slug: string)               => request<T>("DELETE", slug),
};
