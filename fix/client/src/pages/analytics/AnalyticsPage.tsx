import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format, subDays } from "date-fns";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  MessageSquare,
  ThumbsUp,
  ArrowLeft,
  Calendar,
  Download,
  Filter,
} from "lucide-react";

import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Select } from "../../components/ui/select";
import { ChartCard } from "../../components/ChartCard";
import { api } from "../../lib/api";

type AnalyticsData = ReturnType<typeof computeAnalytics>;

function computeAnalytics(
  reports: Array<{
    id: string;
    status?: string;
    category?: string;
    createdAt?: string;
    _count?: { votes?: number; comments?: number };
    author?: { firstName?: string; lastName?: string } | null;
  }>,
  days: number,
  categoryFilter: string
) {
  const since = subDays(new Date(), days - 1);
  const filtered = reports.filter((r) => {
    const inCategory =
      categoryFilter === "all" || r.category === categoryFilter;
    if (!inCategory) return false;
    if (!r.createdAt) return true;
    return new Date(r.createdAt) >= since;
  });

  const totalReports = filtered.length;
  const resolvedReports = filtered.filter(
    (r) => r.status === "RESOLVED"
  ).length;
  const pendingReports = filtered.filter((r) => r.status !== "RESOLVED").length;
  const totalVotes = filtered.reduce((a, r) => a + (r._count?.votes ?? 0), 0);
  const totalComments = filtered.reduce(
    (a, r) => a + (r._count?.comments ?? 0),
    0
  );

  const weeklyData = Array.from({ length: days }, (_, i) => {
    const date = subDays(new Date(), days - 1 - i);
    const label = format(date, "MMM dd");
    const reportsCount = filtered.filter((r) => {
      return (
        r.createdAt &&
        format(new Date(r.createdAt), "yyyy-MM-dd") ===
          format(date, "yyyy-MM-dd")
      );
    }).length;
    const votesCount = 0; // Not tracked per-day with current API; omit or estimate if needed
    const commentsCount = 0;
    return {
      date: label,
      reports: reportsCount,
      votes: votesCount,
      comments: commentsCount,
    };
  });

  const categoryMap = new Map<string, number>();
  for (const r of filtered) {
    const c = r.category || "OTHER";
    categoryMap.set(c, (categoryMap.get(c) || 0) + 1);
  }
  const categoryBreakdown = Array.from(categoryMap.entries()).map(
    ([category, count]) => ({
      category,
      count,
      percentage: totalReports ? Math.round((count / totalReports) * 100) : 0,
    })
  );

  const contributors = new Map<
    string,
    { name: string; reports: number; votes: number; comments: number }
  >();
  for (const r of filtered) {
    const name = `${r.author?.firstName || "Unknown"} ${
      r.author?.lastName || ""
    }`.trim();
    const curr = contributors.get(name) || {
      name,
      reports: 0,
      votes: 0,
      comments: 0,
    };
    curr.reports += 1;
    curr.votes += r._count?.votes || 0;
    curr.comments += r._count?.comments || 0;
    contributors.set(name, curr);
  }
  const topContributors = Array.from(contributors.values())
    .sort(
      (a, b) =>
        b.reports + b.votes + b.comments - (a.reports + a.votes + a.comments)
    )
    .slice(0, 10);

  return {
    totalReports,
    resolvedReports,
    pendingReports,
    totalVotes,
    totalComments,
    weeklyData,
    categoryBreakdown,
    topContributors,
  } as const;
}

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("week");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Fetch all reports and build analytics live on the client
  const {
    data: reports,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["analytics-reports"],
    queryFn: () => api.fetchReports({}),
    refetchInterval: 10000,
  });

  const analyticsData: AnalyticsData | undefined = useMemo(() => {
    if (!reports) return undefined;
    const days = timeRange === "week" ? 7 : timeRange === "month" ? 30 : 90;
    return computeAnalytics(reports, days, categoryFilter);
  }, [reports, timeRange, categoryFilter]);

  const handleExportData = () => {
    if (!analyticsData) return;

    const exportData = {
      ...analyticsData,
      exportedAt: new Date().toISOString(),
      timeRange,
      categoryFilter,
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `analytics-${timeRange}-${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <div className="text-center text-muted-foreground py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          Loading analytics...
        </div>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Failed to load analytics. Please try again.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const resolutionRate = analyticsData.totalReports
    ? Math.round(
        (analyticsData.resolvedReports / analyticsData.totalReports) * 100
      )
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">
              Community engagement and report insights
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full md:w-48"
              placeholder="Select time range"
            >
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="quarter">Last 90 days</option>
            </Select>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full md:w-48"
              placeholder="Filter by category"
            >
              <option value="all">All Categories</option>
              <option value="IT">IT</option>
              <option value="SECURITY">Security</option>
              <option value="INFRASTRUCTURE">Infrastructure</option>
              <option value="SANITATION">Sanitation</option>
              <option value="ELECTRICAL">Electrical</option>
              <option value="WATER">Water</option>
              <option value="OTHER">Other</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Reports
                </p>
                <p className="text-2xl font-bold">
                  {analyticsData.totalReports}
                </p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Resolution Rate
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {resolutionRate}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Votes
                </p>
                <p className="text-2xl font-bold">{analyticsData.totalVotes}</p>
              </div>
              <ThumbsUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Comments
                </p>
                <p className="text-2xl font-bold">
                  {analyticsData.totalComments}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Activity Over Time"
          description={
            analyticsData.totalReports > 0
              ? `Community activity for the last ${
                  timeRange === "week"
                    ? "7"
                    : timeRange === "month"
                    ? "30"
                    : "90"
                } days`
              : "No activity in this period"
          }
          type="line"
          data={analyticsData.weeklyData.map((d) => ({
            label: d.date,
            value: d.reports,
            color: "#3b82f6",
          }))}
          period={`Last ${
            timeRange === "week" ? "7" : timeRange === "month" ? "30" : "90"
          } days`}
        />

        <ChartCard
          title="Category Breakdown"
          description={
            analyticsData.categoryBreakdown.length > 0
              ? "Reports by category"
              : "No reports to categorize"
          }
          type="pie"
          data={analyticsData.categoryBreakdown.map((c) => ({
            label: c.category,
            value: c.count,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`,
          }))}
          period="All time"
        />
      </div>

      {/* Top Contributors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Top Contributors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.topContributors.length === 0 && (
              <div className="text-center text-muted-foreground py-6">
                No contributors yet in this period
              </div>
            )}
            {analyticsData.topContributors.map((contributor, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{contributor.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {contributor.reports} reports • {contributor.votes} votes
                      • {contributor.comments} comments
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">
                  {contributor.reports +
                    contributor.votes +
                    contributor.comments}{" "}
                  total
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
