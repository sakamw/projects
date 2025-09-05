export type ApiReport = {
  id: string;
  title: string;
  description: string;
  status: string;
  category?: string;
  createdAt?: string;
  _count?: { votes: number; comments: number };
};

const API_BASE =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (import.meta as any).env?.VITE_API_URL || "http://localhost:4300/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...init,
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export function fetchReports(
  params?: Record<string, string | number | undefined>
) {
  const qs = params
    ? "?" +
      Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null && v !== "")
        .map(
          ([k, v]) =>
            `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`
        )
        .join("&")
    : "";
  return request<ApiReport[]>(`/reports${qs}`);
}

export const api = { fetchReports };
