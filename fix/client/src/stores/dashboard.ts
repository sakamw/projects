import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { DashboardStats, DashboardActivity, UserProfile, ApiReport } from "../lib/api";
import { api } from "../lib/api";

interface DashboardState {
  // Stats
  stats: DashboardStats | null;
  statsLoading: boolean;
  statsError: string | null;

  // Activities
  activities: DashboardActivity[];
  activitiesLoading: boolean;
  activitiesError: string | null;

  // User Profile
  profile: UserProfile | null;
  profileLoading: boolean;
  profileError: string | null;

  // User Reports
  userReports: ApiReport[];
  userReportsLoading: boolean;
  userReportsError: string | null;

  // User Votes
  userVotes: ApiReport[];
  userVotesLoading: boolean;
  userVotesError: string | null;

  // Actions
  refreshStats: () => Promise<void>;
  refreshActivities: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshUserReports: () => Promise<void>;
  refreshUserVotes: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    stats: null,
    statsLoading: false,
    statsError: null,

    activities: [],
    activitiesLoading: false,
    activitiesError: null,

    profile: null,
    profileLoading: false,
    profileError: null,

    userReports: [],
    userReportsLoading: false,
    userReportsError: null,

    userVotes: [],
    userVotesLoading: false,
    userVotesError: null,

    // Actions
    refreshStats: async () => {
      set({ statsLoading: true, statsError: null });
      try {
        const stats = await api.fetchDashboardStats();
        set({ stats, statsLoading: false });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch dashboard stats";
        set({ statsError: errorMessage, statsLoading: false });
      }
    },

    refreshActivities: async () => {
      set({ activitiesLoading: true, activitiesError: null });
      try {
        const activities = await api.fetchDashboardActivities();
        set({ activities, activitiesLoading: false });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch activities";
        set({ activitiesError: errorMessage, activitiesLoading: false });
      }
    },

    refreshProfile: async () => {
      set({ profileLoading: true, profileError: null });
      try {
        const profile = await api.fetchUserProfile();
        set({ profile, profileLoading: false });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch user profile";
        set({ profileError: errorMessage, profileLoading: false });
      }
    },

    refreshUserReports: async () => {
      set({ userReportsLoading: true, userReportsError: null });
      try {
        const userReports = await api.fetchUserReports();
        set({ userReports, userReportsLoading: false });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch user reports";
        set({ userReportsError: errorMessage, userReportsLoading: false });
      }
    },

    refreshUserVotes: async () => {
      set({ userVotesLoading: true, userVotesError: null });
      try {
        const userVotes = await api.fetchUserVotes();
        set({ userVotes, userVotesLoading: false });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch user votes";
        set({ userVotesError: errorMessage, userVotesLoading: false });
      }
    },

    refreshAll: async () => {
      await Promise.all([
        get().refreshStats(),
        get().refreshActivities(),
        get().refreshProfile(),
        get().refreshUserReports(),
        get().refreshUserVotes(),
      ]);
    },
  }))
);
