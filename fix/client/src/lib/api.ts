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
    const headers: HeadersInit = { "Content-Type": "application/json" };

    // Only add authorization header for protected endpoints
    const protectedPaths = ["/dashboard", "/admin"];
    const isProtectedPath = protectedPaths.some(p => path.startsWith(p));

    if (isProtectedPath) {
      const token = localStorage.getItem("authToken");
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const res = await fetch(`${API_BASE}${path}`, {
      headers,
      credentials: "include", // Also send cookies as fallback
      ...init,
    });

    // Log response for debugging
    console.log(`API Request: ${path}`, {
      status: res.status,
      headers: Object.fromEntries(res.headers.entries()),
    });

    if (!res.ok) {
      let friendly = `Request failed (${res.status})`;
      try {
        const data = await res.json();
        console.error("API Error Response:", data);
        const msg = (data && (data.message || data.error)) as
          | string
          | undefined;
        if (msg) friendly = msg;
      } catch {
        const text = await res.text();
        console.error("API Error Text:", text);
        if (text) friendly = text;
      }

      // If unauthorized, clear token and redirect to login
      if (res.status === 401) {
        localStorage.removeItem("authToken");
        window.location.href = "/";
        throw new Error("Authentication required");
      }

      throw new Error(friendly);
    }

    const data = await res.json();
    console.log(`API Response for ${path}:`, data);
    return data as T;
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

export async function fetchReportById(id: string): Promise<ApiReport> {
  return request<ApiReport>(`/reports/${id}`);
}

// Comments and Votes types
export type ApiComment = {
  id: string;
  text: string;
  createdAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
  };
};

export type ApiVote = {
  id: string;
  voteType: "up" | "down";
  createdAt: string;
  reportId: string;
  userId: string;
};

// Comments API functions
export async function fetchCommentsForReport(reportId: string) {
  return request<ApiComment[]>(`/comments/report/${reportId}`);
}

export async function addCommentToReport(reportId: string, text: string) {
  return request<ApiComment>(`/comments/report/${reportId}`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

// Votes API functions
export async function castVote(reportId: string, voteType: "up" | "down") {
  return request<ApiVote>(`/votes/report/${reportId}`, {
    method: "POST",
    body: JSON.stringify({ voteType }),
  });
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
  const user = await request<ApiUser>(`/auth/login`, {
    method: "POST",
    body: JSON.stringify(params),
  });

  // Store the token in localStorage after successful login
  // Note: In a real app, you'd get the token from the response or set it via cookie
  // For now, we'll assume the server sets an httpOnly cookie
  localStorage.setItem("authToken", "authenticated"); // Placeholder

  return user;
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
  const result = await request<{ message?: string }>(`/auth/logout`, { method: "POST" });

  // Clear the token from localStorage after logout
  localStorage.removeItem("authToken");

  // Invalidate React Query cache to ensure clean state
  if (typeof window !== 'undefined') {
    // Access React Query client if available
    const queryClient = (window as any).reactQueryClient;
    if (queryClient && queryClient.invalidateQueries) {
      queryClient.invalidateQueries();
    }
  }

  return result;
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

// Dashboard types
export type DashboardStats = {
  totalReports: number;
  openReports: number;
  resolvedReports: number;
  totalVotes: number;
  totalComments: number;
  avgResolutionTime: string;
  reportsThisMonth: number;
};

export type DashboardActivity = {
  id: string;
  type:
    | "report_created"
    | "report_updated"
    | "comment_added"
    | "vote_cast"
    | "status_changed";
  title: string;
  description?: string;
  timestamp: string;
  metadata?: {
    reportId?: string;
    status?: string;
    priority?: "low" | "medium" | "high";
  };
};

export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "admin";
  stats: {
    reportsCreated: number;
    reportsResolved: number;
    votesCast: number;
    commentsMade: number;
    reputation: number;
    communityEngagement: {
      totalVotesReceived: number;
      totalCommentsReceived: number;
      helpfulVotesReceived: number;
    };
  };
  badges?: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
  }>;
  level?: {
    current: number;
    max: number;
    progress: number;
  };
};

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

// Dashboard API functions
export async function fetchDashboardStats(): Promise<DashboardStats> {
  return request<DashboardStats>("/dashboard/stats");
}

export async function fetchDashboardActivities(): Promise<DashboardActivity[]> {
  return request<DashboardActivity[]>("/dashboard/activities");
}

export async function fetchUserProfile(): Promise<UserProfile> {
  return request<UserProfile>("/dashboard/profile");
}

export async function fetchUserReports(): Promise<ApiReport[]> {
  return request<ApiReport[]>("/dashboard/reports");
}

export async function fetchUserVotes(): Promise<ApiReport[]> {
  return request<ApiReport[]>("/dashboard/votes");
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

  const urls = await Promise.all(
    files.map((f: File) => uploadImageToCloudinary(f))
  );
  return { urls };
}

export const api = {
  fetchReports,
  fetchReportById,
  fetchCommentsForReport,
  addCommentToReport,
  castVote,
  loginApi,
  registerApi,
  logoutApi,
  forgotPasswordApi,
  verifyResetTokenApi,
  resetPasswordApi,
  resendActivationApi,
  createReportApi,
  uploadFilesApi,
  fetchDashboardStats,
  fetchDashboardActivities,
  fetchUserProfile,
  fetchUserReports,
  fetchUserVotes,
};
