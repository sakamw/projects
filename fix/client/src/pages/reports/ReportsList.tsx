import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { format } from "date-fns";
import {
  Eye,
  Download,
  Search,
  X,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
} from "lucide-react";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Select } from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import { api } from "../../lib/api";
import { useReportsStore } from "../../stores/reports";

interface ReportVotesCount {
  votes?: number;
}

interface Report {
  id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  mediaUrls?: string[];
  urgency?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  createdAt?: string;
  author?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  department?: {
    name: string;
  };
  _count?: ReportVotesCount;
}

const ReportsList = ({ showAllReports = false }: { showAllReports?: boolean }) => {
  console.log("🚀 ReportsList component rendered with showAllReports:", showAllReports);

  // Ensure showAllReports is a boolean
  const isShowAllReports = Boolean(showAllReports);
  console.log("🚀 isShowAllReports (boolean):", isShowAllReports);

  const navigate = useNavigate();
  const { filters, setFilters, realtimeEnabled } = useReportsStore();
  const [searchTerm, setSearchTerm] = useState("");

  // Invalidate cache when showAllReports changes to ensure fresh data
  useEffect(() => {
    console.log("showAllReports changed to:", showAllReports);
  }, [showAllReports]);

  const {
    data: reports,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["reports", isShowAllReports ? "all" : "user", filters],
    queryFn: () => {
      console.log("ReportsList queryFn called with isShowAllReports:", isShowAllReports);
      console.log("Calling API endpoint:", isShowAllReports ? "/reports" : "/dashboard/reports");
      return isShowAllReports
        ? api.fetchReports({
            category: filters.category,
            status: filters.status,
            sort: filters.sort,
          })
        : api.fetchUserReports();
    },
    refetchInterval: realtimeEnabled ? 5000 : false,
    staleTime: 0, // Always consider data stale
    gcTime: 0, // Don't cache
    refetchOnMount: true, // Always refetch on mount
    refetchOnWindowFocus: false,
  });

  // Debug logging
  console.log("ReportsList Debug:", {
    showAllReports,
    isShowAllReports,
    reports,
    error,
    isLoading,
    filters,
  });

  const filteredReports: Report[] =
    reports
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ?.map((report: any) => {
        console.log("Mapping report:", report);
        return {
          ...report,
          category: report.category ?? "Unknown",
        };
      })
      ?.filter(
        (report: Report) =>
          report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [];

  // Apply status and category filters
  const fullyFilteredReports = filteredReports.filter((report) => {
    const statusMatch = !filters.status || report.status === filters.status;
    const categoryMatch =
      !filters.category || report.category === filters.category;
    return statusMatch && categoryMatch;
  });

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "RESOLVED":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "IN_PROGRESS":
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case "RESOLVED":
        return "default";
      case "IN_PROGRESS":
        return "secondary";
      default:
        return "outline";
    }
  };

  const handleViewReport = (reportId: string) => {
    navigate(`/reports/${reportId}`);
  };

  const handleExportData = () => {
    // Export functionality - could implement CSV download
    const dataStr = JSON.stringify(fullyFilteredReports, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `reports-${format(
      new Date(),
      "yyyy-MM-dd"
    )}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {isShowAllReports ? "All Reports" : "My Reports"}
          </h1>
          <p className="text-muted-foreground">
            {isShowAllReports
              ? "Browse and interact with all community reports"
              : "View and manage all your submitted reports"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1 relative">
              <Input
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={handleClearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Select
              value={filters.status || "all"}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  status: e.target.value === "all" ? undefined : e.target.value,
                })
              }
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </Select>
            <Select
              value={filters.category || "all"}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  category:
                    e.target.value === "all" ? undefined : e.target.value,
                })
              }
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

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load reports: {error.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reports ({fullyFilteredReports?.length || 0})</CardTitle>
          <CardDescription>
            {fullyFilteredReports?.length === 0
              ? "No reports found"
              : isShowAllReports
              ? "Community reports from all users"
              : "Your submitted reports"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center text-muted-foreground py-8">
              <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin" />
              Loading reports...
            </div>
          ) : fullyFilteredReports && fullyFilteredReports.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date Created</TableHead>
                    <TableHead>Votes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fullyFilteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        {report.title}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(report.status)}
                          <Badge variant={getStatusBadgeVariant(report.status)}>
                            {report.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{report.category}</Badge>
                      </TableCell>
                      <TableCell>
                        {report.address ? (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="text-sm truncate max-w-[150px]">
                              {report.address}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">
                            No location
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {report.createdAt
                          ? format(new Date(report.createdAt), "MMM dd, yyyy")
                          : "Unknown"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {report._count?.votes || 0} votes
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewReport(report.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <div className="text-sm">No reports found</div>
              <div className="text-xs mt-1">
                {searchTerm || filters.status || filters.category
                  ? "Try adjusting your filters or search terms"
                  : isShowAllReports
                  ? "No community reports available yet"
                  : "You haven't submitted any reports yet"}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsList;
