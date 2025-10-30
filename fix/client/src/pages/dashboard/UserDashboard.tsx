/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { ChartCard } from "../../components/ChartCard";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { StatsSection } from "../../components/dashboard/StatsSection";
import { WeeklyReportsCard } from "../../components/dashboard/WeeklyReportsCard";
import { GettingStartedCard } from "../../components/dashboard/GettingStartedCard";
import { ActivitySection } from "../../components/dashboard/ActivitySection";
import { RightPanel } from "../../components/dashboard/RightPanel";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { useReportsStore } from "../../stores/reports";
import { useDashboardStore } from "../../stores/dashboard";
import { useEffect, useState } from "react";

// Generate weekly chart data from actual reports
const buildWeeklyChartData = (reports: any[] | undefined) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const counts = new Array(7).fill(0);
  if (reports && reports.length > 0) {
    for (const r of reports) {
      if (!r?.createdAt) continue;
      const d = new Date(r.createdAt);
      const jsDay = d.getDay(); // 0=Sun .. 6=Sat
      const idx = jsDay === 0 ? 6 : jsDay - 1; // Map so 0->Sun at end
      counts[idx] += 1;
    }
  }
  const colors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#84cc16",
  ];
  return days.map((day, index) => ({
    label: day,
    value: counts[index],
    color: colors[index % colors.length],
  }));
};

// Generate dynamic progress steps based on user data and connection state
type ProgressStep = {
  id: string;
  label: string;
  description: string;
  completed: any;
  current?: boolean;
};

const generateProgressSteps = (
  profile: any,
  stats: any,
  isConnected: boolean
): ProgressStep[] => {
  const steps: ProgressStep[] = [
    {
      id: "0",
      label: "Connected to server",
      description: "Live data and actions are available",
      completed: isConnected,
    },
    {
      id: "1",
      label: "Complete profile setup",
      description: "Add your location and preferences",
      completed: profile?.firstName && profile?.lastName && profile?.email,
    },
    {
      id: "2",
      label: "Submit first report",
      description: "Help improve your community",
      completed: (stats?.totalReports || 0) > 0,
    },
    {
      id: "3",
      label: "Earn 10 reputation points",
      description: "Get recognized for your contributions",
      completed: (profile?.stats?.reputation || 0) >= 10,
    },
    {
      id: "4",
      label: "Receive helpful badge",
      description: "Community appreciates your help",
      completed: (profile?.stats?.helpfulVotes || 0) >= 5,
    },
  ];

  // Find the first incomplete step and mark it as current
  const currentStepIndex = steps.findIndex((step) => !step.completed);
  if (currentStepIndex !== -1) {
    steps[currentStepIndex] = { ...steps[currentStepIndex], current: true };
  }

  return steps;
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const { filters, realtimeEnabled } = useReportsStore();
  const {
    stats,
    statsLoading,
    statsError,
    activities,
    activitiesLoading,
    activitiesError,
    profile,
    profileLoading,
    profileError,
    refreshAll,
  } = useDashboardStore();

  // Search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Calculate real-time metrics
  const calculateResolutionRate = () => {
    if (!reports || reports.length === 0) return 0;
    const resolvedCount = reports.filter(
      (r: any) => r.status === "RESOLVED"
    ).length;
    return Math.round((resolvedCount / reports.length) * 100);
  };

  const calculateCommunityImpact = () => {
    if (!profile) return 0;
    const reputation = profile.stats?.reputation || 0;
    const reportsCreated = profile.stats?.reportsCreated || 0;
    const votesCast = profile.stats?.votesCast || 0;
    const commentsMade = profile.stats?.commentsMade || 0;

    // Calculate impact score based on various factors
    const impactScore =
      reputation * 2 + reportsCreated * 5 + votesCast * 1 + commentsMade * 3;
    return Math.min(impactScore, 100); // Cap at 100
  };

  // Search function
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Search in reports
      const reports = await api.fetchReports({});

      // Filter reports by search query
      const filteredReports = reports.filter(
        (report: any) =>
          report.title.toLowerCase().includes(query.toLowerCase()) ||
          report.description.toLowerCase().includes(query.toLowerCase()) ||
          report.category.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(filteredReports);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Chart button handlers
  const handleViewDetails = () => {
    navigate("/reports");
  };

  const handleExportChart = () => {
    const chartData = {
      title: "Weekly Reports",
      data: buildWeeklyChartData(reports),
      exportedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(chartData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `weekly-reports-${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const { data: reports, refetch } = useQuery({
    queryKey: ["reports", filters],
    queryFn: () =>
      api.fetchReports({
        category: filters.category,
        status: filters.status,
        sort: filters.sort,
      }),
    refetchInterval: realtimeEnabled ? 5000 : false,
  });

  const { isLoading: connLoading, isError: connError } = useQuery({
    queryKey: ["live-connection"],
    queryFn: () => api.fetchReports({}),
    retry: 0,
    refetchInterval: 10000,
    staleTime: 5000,
  });

  useEffect(() => {
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      refreshAll();
    }, 10000);
    return () => clearInterval(id);
  }, [refreshAll]);

  const openReports = reports?.filter((r) => r.status === "OPEN").length ?? 0;
  const resolvedReports =
    reports?.filter((r) => r.status === "RESOLVED").length ?? 0;
  const totalVotes =
    reports?.reduce((acc, r) => acc + (r._count?.votes ?? 0), 0) ?? 0;

  const handleRefresh = () => {
    refetch();
    refreshAll();
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        connLoading={connLoading}
        connError={!!connError}
        onRefresh={handleRefresh}
      />

      {/* Error States */}
      {statsError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard stats: {statsError}
          </AlertDescription>
        </Alert>
      )}

      {activitiesError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load activities: {activitiesError}
          </AlertDescription>
        </Alert>
      )}

      {profileError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load profile: {profileError}
          </AlertDescription>
        </Alert>
      )}

      <StatsSection
        statsLoading={!!statsLoading}
        openReports={stats?.openReports ?? openReports}
        resolvedReports={stats?.resolvedReports ?? resolvedReports}
        totalVotes={stats?.totalVotes ?? totalVotes}
        avgResolutionTime={stats?.avgResolutionTime ?? "2.4h"}
      />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Charts and Progress */}
        <div className="space-y-6">
          <WeeklyReportsCard
            description={
              (reports?.length || 0) > 0
                ? "Reports submitted this week"
                : "No reports yet this week"
            }
            chartData={buildWeeklyChartData(reports)}
            onViewDetails={handleViewDetails}
            onExport={handleExportChart}
          />

          <GettingStartedCard
            steps={generateProgressSteps(
              profile,
              stats,
              !connError && !connLoading
            )}
          />
        </div>

        {/* Middle Column - Activity Feed */}
        <div className="space-y-6">
          <ActivitySection
            activities={activities.map((a) => ({
              ...a,
              timestamp: new Date(a.timestamp),
            }))}
            loading={!!activitiesLoading}
          />

          <ChartCard
            title="Resolution Rate"
            description={
              (reports?.length || 0) > 0
                ? "Percentage of reports resolved"
                : "No reports yet"
            }
            type="metric"
            value={`${calculateResolutionRate()}%`}
          />
        </div>

        <div className="space-y-6">
          <RightPanel
            reports={reports as any}
            onNewReport={() => navigate("/reports/new")}
            onViewMyReports={() => navigate("/reports/mine")}
            profile={profile as any}
            profileLoading={!!profileLoading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isSearching={isSearching}
            handleSearch={handleSearch}
            searchResults={searchResults as any}
            navigateToReport={(id) => navigate(`/reports/${id}`)}
          />

          <ChartCard
            title="Community Impact"
            description={
              calculateCommunityImpact() > 0
                ? "Your contribution to the community"
                : "Engage by creating reports, voting, or commenting"
            }
            type="circular"
            value={`${calculateCommunityImpact()}/100`}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
