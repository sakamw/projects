import { useNavigate } from "react-router-dom";
import { PlusCircle, List, Search, Download, RefreshCw } from "lucide-react";
import { Button } from "../../components/ui/button";
import { StatsCard } from "../../components/StatsCard";
import { ActivityFeed } from "../../components/ActivityFeed";
import { QuickActions } from "../../components/QuickActions";
import { ChartCard } from "../../components/ChartCard";
import { ProgressIndicator } from "../../components/ProgressIndicator";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { useReportsStore } from "../../stores/reports";

// Mock data for the new components - in a real app, this would come from API
const mockActivities = [
  {
    id: "1",
    type: "report_created" as const,
    title: "Created new report",
    description: "Street light malfunction in downtown area",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    metadata: { reportId: "RPT-001", priority: "high" as const }
  },
  {
    id: "2",
    type: "status_changed" as const,
    title: "Report status updated",
    description: "Pothole repair completed",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    metadata: { status: "RESOLVED", reportId: "RPT-002" }
  },
  {
    id: "3",
    type: "comment_added" as const,
    title: "New comment received",
    description: "Thank you for the quick response!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    metadata: { reportId: "RPT-001" }
  }
];

const mockQuickActions = [
  {
    id: "new-report",
    label: "New Report",
    description: "Submit a problem",
    icon: PlusCircle,
    onClick: () => navigate("/reports/new")
  },
  {
    id: "view-reports",
    label: "My Reports",
    description: "View submitted reports",
    icon: List,
    onClick: () => navigate("/reports")
  },
  {
    id: "search",
    label: "Search",
    description: "Find existing reports",
    icon: Search,
    onClick: () => {}
  },
  {
    id: "export",
    label: "Export Data",
    description: "Download reports",
    icon: Download,
    onClick: () => {}
  }
];

const mockChartData = [
  { label: "Jan", value: 12, color: "#3b82f6" },
  { label: "Feb", value: 19, color: "#10b981" },
  { label: "Mar", value: 15, color: "#f59e0b" },
  { label: "Apr", value: 25, color: "#ef4444" },
  { label: "May", value: 22, color: "#8b5cf6" },
  { label: "Jun", value: 30, color: "#06b6d4" }
];

const mockProgressSteps = [
  {
    id: "1",
    label: "Complete profile setup",
    description: "Add your location and preferences",
    completed: true
  },
  {
    id: "2",
    label: "Submit first report",
    description: "Help improve your community",
    completed: true,
    current: true
  },
  {
    id: "3",
    label: "Earn 10 reputation points",
    description: "Get recognized for your contributions",
    completed: false
  },
  {
    id: "4",
    label: "Receive helpful badge",
    description: "Community appreciates your help",
    completed: false
  }
];

const UserDashboard = () => {
  const navigate = useNavigate();
  const { filters, realtimeEnabled } = useReportsStore();
  const {
    data: reports,
    refetch,
  } = useQuery({
    queryKey: ["reports", filters],
    queryFn: () =>
      api.fetchReports({
        category: filters.category,
        status: filters.status,
        sort: filters.sort,
      }),
    refetchInterval: realtimeEnabled ? 5000 : false,
  });

  const openReports = reports?.filter((r) => r.status === "OPEN").length ?? 0;
  const resolvedReports = reports?.filter((r) => r.status === "RESOLVED").length ?? 0;
  const totalVotes = reports?.reduce((acc, r) => acc + (r._count?.votes ?? 0), 0) ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your activity overview.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Open Reports"
          value={openReports}
          description="Active issues"
          trend={{ value: 12, isPositive: false }}
        />
        <StatsCard
          title="Resolved"
          value={resolvedReports}
          description="Completed this month"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="My Votes"
          value={totalVotes}
          description="Community engagement"
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Response Time"
          value="2.4h"
          description="Average resolution"
          trend={{ value: -5, isPositive: true }}
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
              { label: "View Details", onClick: () => {} },
              { label: "Export", onClick: () => {} }
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
          <ActivityFeed activities={mockActivities} maxHeight="500px" />

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

          <ChartCard
            title="Community Impact"
            description="Your contribution to the community"
            type="circular"
            progress={{
              current: 85,
              target: 100,
              unit: "points",
              color: "primary"
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
