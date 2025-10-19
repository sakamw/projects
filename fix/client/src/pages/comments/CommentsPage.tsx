/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  MessageSquare,
  Search,
  Filter,
  ArrowLeft,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Select } from "../../components/ui/select";
import { api } from "../../lib/api";

interface Comment {
  id: string;
  text: string;
  createdAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
  };
  report: {
    id: string;
    title: string;
    status: string;
    category: string;
  };
  replies?: Comment[];
  _count?: {
    replies: number;
  };
}

const CommentsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Fetch user's comments
  const {
    data: comments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-comments"],
    queryFn: async () => {
      const reports = await api.fetchUserReports();
      const allComments: Comment[] = [];

      for (const report of reports) {
        try {
          const reportComments = await api.fetchCommentsForReport(report.id);
          const userComments = reportComments.filter(
            (comment: any) => comment.author.id === "current-user-id" // This would need to be dynamic
          );

          userComments.forEach((comment: any) => {
            allComments.push({
              ...comment,
              report: {
                id: report.id,
                title: report.title,
                status: report.status,
                category: report.category,
              },
            });
          });
        } catch (error) {
          console.error(
            `Failed to fetch comments for report ${report.id}:`,
            error
          );
        }
      }

      return allComments;
    },
  });

  // Filter comments based on search and filters
  const filteredComments = comments.filter((comment: Comment) => {
    const matchesSearch =
      comment.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.report.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || comment.report.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || comment.report.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case "RESOLVED":
        return "secondary";
      case "IN_PROGRESS":
        return "default";
      default:
        return "destructive";
    }
  };

  const handleViewReport = (reportId: string) => {
    navigate(`/reports/${reportId}`);
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
          Loading comments...
        </div>
      </div>
    );
  }

  if (error) {
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
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Failed to load comments. Please try again.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold">My Comments</h1>
            <p className="text-muted-foreground">
              View and manage your comments across all reports
            </p>
          </div>
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
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search comments or report titles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-48"
              placeholder="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
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

      {/* Comments List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Comments ({filteredComments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredComments.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No comments found</p>
              <p className="text-sm mt-1">
                {searchTerm ||
                statusFilter !== "all" ||
                categoryFilter !== "all"
                  ? "Try adjusting your filters"
                  : "You haven't made any comments yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredComments.map((comment) => (
                <div
                  key={comment.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-sm">
                          {comment.author.firstName} {comment.author.lastName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(
                            new Date(comment.createdAt),
                            "MMM dd, yyyy 'at' h:mm a"
                          )}
                        </span>
                      </div>
                      <p className="text-sm mb-3">{comment.text}</p>

                      {/* Report Info */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-muted-foreground">
                          On report:
                        </span>
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs"
                          onClick={() => handleViewReport(comment.report.id)}
                        >
                          {comment.report.title}
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={getStatusBadgeVariant(comment.report.status)}
                        >
                          {comment.report.status}
                        </Badge>
                        <Badge variant="outline">
                          {comment.report.category}
                        </Badge>
                        {comment._count?.replies &&
                          comment._count.replies > 0 && (
                            <Badge variant="secondary">
                              {comment._count.replies} replies
                            </Badge>
                          )}
                      </div>
                    </div>

                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CommentsPage;
