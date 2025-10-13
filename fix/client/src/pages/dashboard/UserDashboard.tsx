import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  List,
  Search,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  ThumbsUp,
  Clock,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { StatsCard } from "../../components/StatsCard";
import { ActivityFeed } from "../../components/ActivityFeed";
import { QuickActions } from "../../components/QuickActions";
import { ChartCard } from "../../components/ChartCard";
import { ProgressIndicator } from "../../components/ProgressIndicator";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { useReportsStore } from "../../stores/reports";
import { useDashboardStore } from "../../stores/dashboard";
import { useEffect } from "react";

// Mock data for demonstration - will be replaced with real data
const mockChartData = [
  { label: "Jan", value: 12, color: "#3b82f6" },
  { label: "Feb", value: 19, color: "#10b981" },
  { label: "Mar", value: 15, color: "#f59e0b" },
  { label: "Apr", value: 25, color: "#ef4444" },
  { label: "May", value: 22, color: "#8b5cf6" },
  { label: "Jun", value: 30, color: "#06b6d4" },
];

const mockProgressSteps = [
  {
    id: "1",
    label: "Complete profile setup",
    description: "Add your location and preferences",
    completed: true,
  },
  {
    id: "2",
    label: "Submit first report",
    description: "Help improve your community",
    completed: true,
    current: true,
  },
  {
    id: "3",
    label: "Earn 10 reputation points",
    description: "Get recognized for your contributions",
    completed: false,
  },
  {
    id: "4",
    label: "Receive helpful badge",
    description: "Community appreciates your help",
    completed: false,
  },
];

const UserDashboard = () => {
  const navigate = useNavigate();
  const { filters, setFilters, realtimeEnabled } = useReportsStore();
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

  // Create quick actions with navigation
  const mockQuickActions = [
    {
      id: "new-report",
      label: "New Report",
      description: "Submit a problem",
      icon: PlusCircle,
      onClick: () => navigate("/reports/new"),
    },
    {
      id: "view-reports",
      label: "My Reports",
      description: "View submitted reports",
      icon: List,
      onClick: () => navigate("/reports/mine"),
    },
    {
      id: "search",
      label: "Search",
      description: "Find existing reports",
      icon: Search,
      onClick: () => {
        // Open search modal or navigate to search page
        setFilters({ ...filters, sort: "recent" });
      },
    },
    {
      id: "export",
      label: "Export Data",
      description: "Download reports",
      icon: Download,
      onClick: () => {
        // Export functionality - implement CSV/JSON download
        const dataStr = JSON.stringify(reports, null, 2);
        const dataUri =
          "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
        const exportFileDefaultName = `reports-${
          new Date().toISOString().split("T")[0]
        }.json`;

        const linkElement = document.createElement("a");
        linkElement.setAttribute("href", dataUri);
        linkElement.setAttribute("download", exportFileDefaultName);
        linkElement.click();
      },
    },
  ];

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

  // Load dashboard data on mount
  useEffect(() => {
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your activity overview.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

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

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Open Reports"
          value={statsLoading ? "..." : stats?.openReports ?? openReports}
          description="Active issues"
          trend={{ value: 12, isPositive: false }}
          icon={List}
        />
        <StatsCard
          title="Resolved"
          value={
            statsLoading ? "..." : stats?.resolvedReports ?? resolvedReports
          }
          description="Completed this month"
          trend={{ value: 8, isPositive: true }}
          icon={CheckCircle}
        />
        <StatsCard
          title="My Votes"
          value={statsLoading ? "..." : stats?.totalVotes ?? totalVotes}
          description="Community engagement"
          trend={{ value: 15, isPositive: true }}
          icon={ThumbsUp}
        />
        <StatsCard
          title="Response Time"
          value={statsLoading ? "..." : stats?.avgResolutionTime ?? "2.4h"}
          description="Average resolution"
          trend={{ value: -5, isPositive: true }}
          icon={Clock}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Charts and Progress */}
        <div className="space-y-6">
          <ChartCard
            title="Monthly Reports"
            description="Reports submitted over time"
            type="bar"
            data={mockChartData}
            period="Last 6 months"
            actions={[
              {
                label: "View Details",
                onClick: () => navigate("/reports"),
              },
              {
                label: "Export",
                onClick: () => {
                  const dataStr = JSON.stringify(mockChartData, null, 2);
                  const dataUri =
                    "data:application/json;charset=utf-8," +
                    encodeURIComponent(dataStr);
                  const exportFileDefaultName = `monthly-reports-${
                    new Date().toISOString().split("T")[0]
                  }.json`;

                  const linkElement = document.createElement("a");
                  linkElement.setAttribute("href", dataUri);
                  linkElement.setAttribute("download", exportFileDefaultName);
                  linkElement.click();
                },
              },
            ]}
          />

          <ProgressIndicator
            title="Getting Started"
            description="Complete these steps to maximize your experience"
            type="steps"
            steps={mockProgressSteps}
            size="md"
          />
        </div>

        {/* Middle Column - Activity Feed */}
        <div className="space-y-6">
          {activitiesLoading ? (
            <div className="text-center text-muted-foreground py-8">
              <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin" />
              Loading activities...
            </div>
          ) : activities.length > 0 ? (
            <ActivityFeed
              activities={activities.map((a) => ({
                ...a,
                timestamp: new Date(a.timestamp),
              }))}
              maxHeight="500px"
            />
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <div className="text-sm">No recent activity</div>
              <div className="text-xs mt-1">
                Your recent actions will appear here
              </div>
            </div>
          )}

          <ChartCard
            title="Resolution Rate"
            description="Percentage of reports resolved"
            type="metric"
            value="87%"
            trend={{ value: 5, label: "increase", isPositive: true }}
          />
        </div>

        {/* Right Column - Quick Actions */}
        <div className="space-y-6">
          <QuickActions
            title="Quick Actions"
            actions={mockQuickActions}
            columns={2}
          />

          {profileLoading ? (
            <div className="text-center text-muted-foreground py-4">
              <RefreshCw className="h-6 w-6 mx-auto mb-2 animate-spin" />
              Loading profile...
            </div>
          ) : profile ? (
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="text-sm font-medium mb-2">Welcome back!</div>
              <div className="text-sm text-muted-foreground">
                {profile.firstName} {profile.lastName}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {profile.stats.reportsCreated} reports created
              </div>
            </div>
          ) : (
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="text-sm font-medium mb-2">Profile</div>
              <div className="text-sm text-muted-foreground">
                Sign in to view your profile
              </div>
            </div>
          )}

          <ChartCard
            title="Community Impact"
            description="Your contribution to the community"
            type="circular"
            value={`${profile?.stats.reputation ?? 0}/100`}
            trend={{
              value: profile?.level?.progress ?? 0,
              label: "progress",
              isPositive: true,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
