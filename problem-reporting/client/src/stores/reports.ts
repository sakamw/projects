import { create } from "zustand";

export type ReportFilters = {
  category?: string;
  status?: string;
  sort?: "recent" | "popular";
};

type ReportsState = {
  filters: ReportFilters;
  setFilters: (f: ReportFilters) => void;
  realtimeEnabled: boolean;
  setRealtime: (v: boolean) => void;
};

export const useReportsStore = create<ReportsState>((set) => ({
  filters: { sort: "recent" },
  setFilters: (filters) => set({ filters }),
  realtimeEnabled: true,
  setRealtime: (v) => set({ realtimeEnabled: v }),
}));

