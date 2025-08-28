export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  createdAt: Date;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  priority: ReportPriority;
  status: ReportStatus;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  images?: string[];
  reportedBy: string; // User ID
  reportedAt: Date;
  updatedAt: Date;
  assignedTo?: string; // Admin ID
  resolvedAt?: Date;
  notes?: string[];
}

export type ReportCategory =
  | "water"
  | "electricity"
  | "security"
  | "infrastructure"
  | "cleanliness"
  | "lighting"
  | "transportation"
  | "other";

export type ReportPriority = "low" | "medium" | "high" | "critical";

export type ReportStatus =
  | "pending"
  | "under_review"
  | "in_progress"
  | "resolved"
  | "rejected";

export interface Notification {
  id: string;
  userId: string;
  reportId: string;
  title: string;
  message: string;
  type: "status_update" | "assignment" | "resolution";
  read: boolean;
  createdAt: Date;
}

export interface MapMarker {
  id: string;
  position: [number, number];
  report: Report;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface ReportFormData {
  title: string;
  description: string;
  category: ReportCategory;
  priority: ReportPriority;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  images?: File[];
}
