/* eslint-disable @typescript-eslint/no-explicit-any */
export type ApiReport = {
  id: string;
  title: string;
  description: string;
  status: string;
  category?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  mediaUrls?: string[];
  urgency?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  createdAt?: string;
  _count?: { votes: number; comments: number };
};

const API_BASE =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:4300/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      ...init,
    });
    if (!res.ok) {
      let friendly = `Request failed (${res.status})`;
      try {
        const data = await res.json();
        const msg = (data && (data.message || data.error)) as
          | string
          | undefined;
        if (msg) friendly = msg;
      } catch {
        const text = await res.text();
        if (text) friendly = text;
      }
      throw new Error(friendly);
    }
    return (await res.json()) as T;
  } catch (e: unknown) {
    if (e instanceof TypeError) {
      // Network/CORS or server unreachable
      throw new Error(
        "Cannot reach the server. Please check your connection and try again."
      );
    }
    throw e as Error;
  }
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

// Auth types
export type ApiUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  isAdmin?: boolean;
  verified?: boolean;
};

export async function loginApi(params: {
  identifier: string;
  password: string;
}): Promise<ApiUser> {
  return request<ApiUser>(`/auth/login`, {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function registerApi(params: {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}): Promise<{ message: string }> {
  return request<{ message: string }>(`/auth/register`, {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function logoutApi(): Promise<{ message?: string }> {
  return request<{ message?: string }>(`/auth/logout`, { method: "POST" });
}

export async function forgotPasswordApi(params: {
  email: string;
}): Promise<{ message: string }> {
  return request<{ message: string }>(`/auth/forgot-password`, {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function verifyResetTokenApi(args: {
  id: string;
  token: string;
}): Promise<{ message: string }> {
  return request<{ message: string }>(
    `/auth/reset-password/${encodeURIComponent(args.id)}/${encodeURIComponent(
      args.token
    )}`,
    { method: "GET" }
  );
}

export async function resetPasswordApi(args: {
  id: string;
  token: string;
  password: string;
}): Promise<{ message: string }> {
  return request<{ message: string }>(
    `/auth/reset-password/${encodeURIComponent(args.id)}/${encodeURIComponent(
      args.token
    )}`,
    { method: "POST", body: JSON.stringify({ password: args.password }) }
  );
}

export async function resendActivationApi(params: {
  email: string;
}): Promise<{ message: string }> {
  return request<{ message: string }>(`/auth/resend-activation`, {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export type CreateReportInput = {
  title: string;
  description: string;
  category:
    | "IT"
    | "SECURITY"
    | "INFRASTRUCTURE"
    | "SANITATION"
    | "ELECTRICAL"
    | "WATER"
    | "OTHER";
  latitude?: number;
  longitude?: number;
  address?: string;
  mediaUrls?: string[];
  urgency?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
};

export async function createReportApi(input: CreateReportInput) {
  return request<{ id: string }>(`/reports`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function uploadFilesApi(files: File[]) {
  async function uploadImageToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    const uploadPreset =
      (import.meta as any).env?.VITE_CLOUDINARY_UPLOAD_PRESET ||
      "newisakrandom";
    const cloudName =
      (import.meta as any).env?.VITE_CLOUDINARY_CLOUD_NAME || "dv8k0z6na";
    formData.append("upload_preset", uploadPreset);
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formData }
    );
    if (!response.ok) throw new Error("Failed to upload image to Cloudinary");
    const data = (await response.json()) as { secure_url?: string };
    if (!data.secure_url)
      throw new Error("Cloudinary did not return a secure_url");
    return data.secure_url;
  }

  const urls = await Promise.all(files.map((f) => uploadImageToCloudinary(f)));
  return { urls } as { urls: string[] };
}

export const api = {
  fetchReports,
  loginApi,
  registerApi,
  logoutApi,
  forgotPasswordApi,
  verifyResetTokenApi,
  resetPasswordApi,
  resendActivationApi,
  createReportApi,
  uploadFilesApi,
};
