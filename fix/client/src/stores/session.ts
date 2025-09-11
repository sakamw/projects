import { create } from "zustand";

export type Role = "user" | "admin";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
};

type SessionState = {
  user: User | null;
  token: string | null;
  setSession: (user: User, token: string) => void;
  clearSession: () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  token: null,
  setSession: (user, token) => set({ user, token }),
  clearSession: () => set({ user: null, token: null }),
}));
