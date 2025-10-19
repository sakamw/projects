import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ThumbsUp,
  ThumbsDown,
  Search,
  Filter,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
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

interface Vote {
  id: string;
  voteType: "up" | "down";
  createdAt: string;
  report: {
    id: string;
    title: string;
    description: string;
    status: string;
    category: string;
    author: {
      firstName: string;
      lastName: string;
    };
    _count?: {
      votes: number;
      comments: number;
    };
  };
}

const VotesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [voteTypeFilter, setVoteTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Fetch user's votes
  const {
    data: votes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-votes"],
    queryFn: async () => {
      return await api.fetchUserVotes();
    },
  });

  // Filter votes based on search and filters
  const filteredVotes = votes.filter((vote: Vote) => {
    const matchesSearch =
      vote.report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vote.report.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVoteType =
      voteTypeFilter === "all" || vote.voteType === voteTypeFilter;
    const matchesStatus =
      statusFilter === "all" || vote.report.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || vote.report.category === categoryFilter;

    return matchesSearch && matchesVoteType && matchesStatus && matchesCategory;
  });

  // Calculate vote statistics
  const voteStats = {
    total: votes.length,
    helpful: votes.filter((v: Vote) => v.voteType === "up").length,
    notHelpful: votes.filter((v: Vote) => v.voteType === "down").length,
  };

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
          Loading votes...
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
              <ThumbsUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Failed to load votes. Please try again.</p>
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
            <h1 className="text-2xl font-bold">My Votes</h1>
            <p className="text-muted-foreground">
              View and manage your votes on community reports
            </p>
          </div>
        </div>
      </div>

      {/* Vote Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Votes
                </p>
                <p className="text-2xl font-bold">{voteStats.total}</p>
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
                  Helpful Votes
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {voteStats.helpful}
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
                  Not Helpful
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {voteStats.notHelpful}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
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
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={voteTypeFilter}
              onChange={(e) => setVoteTypeFilter(e.target.value)}
              className="w-full md:w-48"
              placeholder="Filter by vote type"
            >
              <option value="all">All Votes</option>
              <option value="up">Helpful</option>
              <option value="down">Not Helpful</option>
            </Select>
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

      {/* Votes List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ThumbsUp className="h-4 w-4" />
            Votes ({filteredVotes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredVotes.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <ThumbsUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No votes found</p>
              <p className="text-sm mt-1">
                {searchTerm ||
                voteTypeFilter !== "all" ||
                statusFilter !== "all" ||
                categoryFilter !== "all"
                  ? "Try adjusting your filters"
                  : "You haven't voted on any reports yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVotes.map((vote) => (
                <div
                  key={vote.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {vote.voteType === "up" ? (
                          <ThumbsUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <ThumbsDown className="h-4 w-4 text-red-600" />
                        )}
                        <span className="font-medium text-sm">
                          {vote.voteType === "up" ? "Helpful" : "Not Helpful"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(
                            new Date(vote.createdAt),
                            "MMM dd, yyyy 'at' h:mm a"
                          )}
                        </span>
                      </div>

                      {/* Report Info */}
                      <div className="mb-3">
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-sm font-medium"
                          onClick={() => handleViewReport(vote.report.id)}
                        >
                          {vote.report.title}
                        </Button>
                        <p className="text-sm text-muted-foreground mt-1">
                          {vote.report.description.substring(0, 150)}...
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-muted-foreground">
                          By: {vote.report.author.firstName}{" "}
                          {vote.report.author.lastName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={getStatusBadgeVariant(vote.report.status)}
                        >
                          {vote.report.status}
                        </Badge>
                        <Badge variant="outline">{vote.report.category}</Badge>
                        {vote.report._count && (
                          <>
                            <Badge variant="secondary">
                              {vote.report._count.votes} votes
                            </Badge>
                            <Badge variant="secondary">
                              {vote.report._count.comments} comments
                            </Badge>
                          </>
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

export default VotesPage;
