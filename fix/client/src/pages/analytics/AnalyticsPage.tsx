import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";
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

interface AnalyticsData {
  totalReports: number;
  resolvedReports: number;
  pendingReports: number;
  totalVotes: number;
  totalComments: number;
  weeklyData: Array<{
    date: string;
    reports: number;
    votes: number;
    comments: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  topContributors: Array<{
    name: string;
    reports: number;
    votes: number;
    comments: number;
  }>;
}

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("week");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Mock analytics data - in a real app, this would come from the backend
  const {
    data: analyticsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["analytics", timeRange, categoryFilter],
    queryFn: async (): Promise<AnalyticsData> => {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate mock data based on time range
      const days = timeRange === "week" ? 7 : timeRange === "month" ? 30 : 90;
      const weeklyData = Array.from({ length: days }, (_, i) => ({
        date: format(subDays(new Date(), days - 1 - i), "MMM dd"),
        reports: Math.floor(Math.random() * 10) + 1,
        votes: Math.floor(Math.random() * 20) + 5,
        comments: Math.floor(Math.random() * 15) + 2,
      }));

      return {
        totalReports: 156,
        resolvedReports: 89,
        pendingReports: 67,
        totalVotes: 1247,
        totalComments: 892,
        weeklyData,
        categoryBreakdown: [
          { category: "INFRASTRUCTURE", count: 45, percentage: 29 },
          { category: "IT", count: 32, percentage: 21 },
          { category: "SANITATION", count: 28, percentage: 18 },
          { category: "SECURITY", count: 25, percentage: 16 },
          { category: "ELECTRICAL", count: 18, percentage: 12 },
          { category: "WATER", count: 8, percentage: 5 },
        ],
        topContributors: [
          { name: "John Doe", reports: 12, votes: 45, comments: 23 },
          { name: "Jane Smith", reports: 8, votes: 38, comments: 19 },
          { name: "Mike Johnson", reports: 6, votes: 29, comments: 15 },
          { name: "Sarah Wilson", reports: 5, votes: 22, comments: 12 },
        ],
      };
    },
  });

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

  const resolutionRate = Math.round(
    (analyticsData.resolvedReports / analyticsData.totalReports) * 100
  );

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
          description={`Community activity for the last ${
            timeRange === "week" ? "7" : timeRange === "month" ? "30" : "90"
          } days`}
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
          description="Reports by category"
          type="doughnut"
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
