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
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { StatsCard } from "../../components/StatsCard";
import { ActivityFeed } from "../../components/ActivityFeed";
import { QuickActions } from "../../components/QuickActions";
import { ChartCard } from "../../components/ChartCard";
import { ProgressIndicator } from "../../components/ProgressIndicator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { useReportsStore } from "../../stores/reports";
import { useDashboardStore } from "../../stores/dashboard";
import { useEffect, useState } from "react";

// Generate weekly chart data with daily progress
const generateWeeklyChartData = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
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
    value: Math.floor(Math.random() * 10) + 1, // Random data for now
    color: colors[index % colors.length],
  }));
};

const mockChartData = generateWeeklyChartData();

// Generate dynamic progress steps based on user data
const generateProgressSteps = (profile: any, stats: any) => {
  const steps = [
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
      const reports = await api.fetchReports({
        // Add search parameter if backend supports it
      });

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
      data: mockChartData,
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
        // This will be handled by the search dialog trigger
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
            title="Weekly Reports"
            description="Reports submitted this week"
            type="bar"
            data={mockChartData}
            period="This week"
            actions={[
              {
                label: "View Details",
                onClick: handleViewDetails,
              },
              {
                label: "Export",
                onClick: handleExportChart,
              },
            ]}
          />

          <ProgressIndicator
            title="Getting Started"
            description="Complete these steps to maximize your experience"
            type="steps"
            steps={generateProgressSteps(profile, stats)}
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
              showSearch={true}
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
            value={`${calculateResolutionRate()}%`}
            trend={{ value: 5, label: "increase", isPositive: true }}
          />
        </div>

        {/* Right Column - Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                {mockQuickActions.map((action) => {
                  const Icon = action.icon;

                  if (action.id === "search") {
                    return (
                      <Dialog key={action.id}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="h-auto p-4 flex flex-col items-center gap-2 text-center"
                          >
                            <Icon className="h-6 w-6" />
                            <div className="space-y-1">
                              <div className="font-medium text-sm">
                                {action.label}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {action.description}
                              </div>
                            </div>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Search Reports</DialogTitle>
                            <DialogDescription>
                              Find reports by title, description, or category
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex gap-2">
                              <Input
                                placeholder="Search reports..."
                                value={searchQuery}
                                onChange={(e) => {
                                  setSearchQuery(e.target.value);
                                  handleSearch(e.target.value);
                                }}
                                className="flex-1"
                              />
                              <Button
                                onClick={() => handleSearch(searchQuery)}
                                disabled={isSearching}
                              >
                                {isSearching ? (
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Search className="h-4 w-4" />
                                )}
                              </Button>
                            </div>

                            {/* Search Results */}
                            <div className="max-h-96 overflow-y-auto">
                              {searchResults.length > 0 ? (
                                <div className="space-y-2">
                                  <h4 className="font-medium text-sm">
                                    Found {searchResults.length} result(s)
                                  </h4>
                                  {searchResults.map((report) => (
                                    <div
                                      key={report.id}
                                      className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                                      onClick={() => {
                                        navigate(`/reports/${report.id}`);
                                      }}
                                    >
                                      <div className="font-medium text-sm">
                                        {report.title}
                                      </div>
                                      <div className="text-xs text-muted-foreground mt-1">
                                        {report.description.substring(0, 100)}
                                        ...
                                      </div>
                                      <div className="flex items-center gap-2 mt-2">
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {report.category}
                                        </Badge>
                                        <Badge
                                          variant={
                                            report.status === "RESOLVED"
                                              ? "secondary"
                                              : report.status === "IN_PROGRESS"
                                              ? "default"
                                              : "destructive"
                                          }
                                          className="text-xs"
                                        >
                                          {report.status}
                                        </Badge>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : searchQuery && !isSearching ? (
                                <div className="text-center text-muted-foreground py-8">
                                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                  <p>
                                    No reports found matching "{searchQuery}"
                                  </p>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    );
                  }

                  return (
                    <Button
                      key={action.id}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2 text-center"
                      onClick={action.onClick}
                    >
                      <Icon className="h-6 w-6" />
                      <div className="space-y-1">
                        <div className="font-medium text-sm">
                          {action.label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {action.description}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

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
            value={`${calculateCommunityImpact()}/100`}
            trend={{
              value: calculateCommunityImpact(),
              label: "impact",
              isPositive: true,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
