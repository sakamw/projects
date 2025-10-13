import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Share,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Eye,
  Send,
} from "lucide-react";

import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Separator } from "../../components/ui/separator";

import { api, type ApiReport } from "../../lib/api";
import { Badge } from "../../components/ui/badge";

const ReportDetail = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<ApiReport | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [newComment, setNewComment] = useState("");

  const {
    data: reportData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["report", id],
    queryFn: async () => {
      if (!id) throw new Error("Report ID is required");
      // Check if user is authenticated to get vote information
      const token = localStorage.getItem("authToken");
      if (token) {
        return await api.fetchReportByIdWithUserVote(id);
      } else {
        return await api.fetchReportById(id);
      }
    },
    enabled: !!id,
  });

  // Fetch comments for this report
  const { data: comments = [] } = useQuery({
    queryKey: ["report-comments", id],
    queryFn: async () => {
      if (!id) return [];
      return await api.fetchCommentsForReport(id);
    },
    enabled: !!id,
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async (voteType: "up" | "down" | null) => {
      if (!id) throw new Error("Report ID is required");
      return await api.castVote(id, voteType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report", id] });
      // Invalidate dashboard stats to update community engagement
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: async (commentText: string) => {
      if (!id) throw new Error("Report ID is required");
      return await api.addCommentToReport(id, commentText);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report-comments", id] });
      // Invalidate dashboard stats to update community engagement
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      setNewComment("");
    },
  });

  // Reply mutation
  const replyMutation = useMutation({
    mutationFn: async ({
      parentCommentId,
      text,
    }: {
      parentCommentId: string;
      text: string;
    }) => {
      if (!id) throw new Error("Report ID is required");
      return await api.addCommentToReport(id, text, parentCommentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report-comments", id] });
      // Invalidate dashboard stats to update community engagement
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      setReplyingTo(null);
      setReplyText("");
    },
  });

  useEffect(() => {
    if (reportData) {
      setReport(reportData);
      // Set user vote from server data if available
      if ("userVote" in reportData) {
        setUserVote(reportData.userVote);
      }
    }
  }, [reportData]);

  const handleVote = (voteType: "up" | "down") => {
    const newVote = userVote === voteType ? null : voteType;
    setUserVote(newVote);
    // Send the new vote to the server (null means unvote)
    voteMutation.mutate(newVote);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      commentMutation.mutate(newComment.trim());
    }
  };

  const handleAddReply = (parentCommentId: string) => {
    if (replyText.trim()) {
      replyMutation.mutate({ parentCommentId, text: replyText.trim() });
      setReplyingTo(null);
      setReplyText("");
    }
  };

  const startReply = (commentId: string) => {
    setReplyingTo(commentId);
    setReplyText("");
  };

  // Component to render a single comment with replies
  const CommentItem = ({
    comment,
    depth = 0,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    comment: any;
    depth?: number;
  }) => {
    const isReplying = replyingTo === comment.id;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function cancelReply(_event: React.MouseEvent<HTMLButtonElement>): void {
      setReplyingTo(null);
      setReplyText("");
    }

    return (
      <div
        className={`${depth > 0 ? "ml-8 border-l-2 border-muted pl-4" : ""}`}
      >
        <div className="border-l-2 border-muted pl-4 py-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">
              {comment.author.firstName} {comment.author.lastName}
            </span>
            <span className="text-xs text-muted-foreground">
              {format(new Date(comment.createdAt), "MMM dd, yyyy")}
            </span>
            {depth === 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => startReply(comment.id)}
              >
                Reply
              </Button>
            )}
          </div>
          <p className="text-sm mb-2">{comment.text}</p>

          {/* Reply input */}
          {isReplying && (
            <div className="flex gap-2 mt-2">
              <textarea
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md resize-none"
                rows={2}
              />
              <div className="flex flex-col gap-1">
                <Button
                  size="sm"
                  onClick={() => handleAddReply(comment.id)}
                  disabled={!replyText.trim() || replyMutation.isPending}
                >
                  Reply
                </Button>
                <Button variant="outline" size="sm" onClick={cancelReply}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Render replies */}
        {comment.replies &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          comment.replies.map((reply: any) => (
            <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
          ))}
      </div>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "RESOLVED":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "IN_PROGRESS":
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
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

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency?.toUpperCase()) {
      case "CRITICAL":
        return "text-red-600 bg-red-50";
      case "HIGH":
        return "text-orange-600 bg-orange-50";
      case "MEDIUM":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-green-600 bg-green-50";
    }
  };

  const handleExportReport = () => {
    if (!report) return;

    const reportData = {
      id: report.id,
      title: report.title,
      description: report.description,
      status: report.status,
      category: report.category,
      address: report.address,
      urgency: report.urgency,
      createdAt: report.createdAt,
      votes: report._count?.votes || 0,
      comments: report._count?.comments || 0,
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `report-${report.id}-${format(
      new Date(),
      "yyyy-MM-dd"
    )}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleShareReport = () => {
    if (!report || !navigator.share) return;

    navigator.share({
      title: report.title,
      text: report.description,
      url: window.location.href,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/reports")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Button>
        </div>
        <div className="text-center text-muted-foreground py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          Loading report details...
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/reports")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error?.message || "Report not found"}
          </AlertDescription>
        </Alert>
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
            onClick={() => navigate("/reports")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div>
            <h1 className="text-2xl font-bold">{report.title}</h1>
            <p className="text-muted-foreground">Report Details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleShareReport}>
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Report Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(report.status)}
                  Report Overview
                </CardTitle>
                <Badge variant={getStatusBadgeVariant(report.status)}>
                  {report.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {report.description}
                </p>
              </div>

              {report.mediaUrls && report.mediaUrls !== "[]" && (
                <div>
                  <h3 className="font-semibold mb-2">Media Attachments</h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {(() => {
                      try {
                        // Try to parse as JSON array first
                        const parsedUrls = JSON.parse(report.mediaUrls);
                        if (Array.isArray(parsedUrls)) {
                          return parsedUrls.map(
                            (url: string, index: number) => (
                              <div key={index} className="relative">
                                <img
                                  src={url}
                                  alt={`Attachment ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() => window.open(url, "_blank")}
                                />
                              </div>
                            )
                          );
                        }
                      } catch (error) {
                        // If JSON parsing fails, treat as single URL string
                        console.warn(
                          "Failed to parse mediaUrls as JSON, treating as single URL:",
                          error
                        );
                        return (
                          <div className="relative">
                            <img
                              src={report.mediaUrls}
                              alt="Attachment"
                              className="w-full h-32 object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() =>
                                window.open(report.mediaUrls!, "_blank")
                              }
                            />
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location */}
          {report.address && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{report.address}</p>
                    {report.latitude && report.longitude && (
                      <p className="text-sm text-muted-foreground">
                        Coordinates: {report.latitude}, {report.longitude}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Voting and Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4" />
                Community Interaction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Voting Section */}
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <span className="font-medium">Rate this report:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant={userVote === "up" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleVote("up")}
                    disabled={voteMutation.isPending}
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Helpful ({report._count?.votes || 0})
                  </Button>
                  <Button
                    variant={userVote === "down" ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => handleVote("down")}
                    disabled={voteMutation.isPending}
                  >
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    Not Helpful
                  </Button>
                </div>
              </div>

              {/* Comments Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span className="font-medium">
                    Comments ({comments.length})
                  </span>
                </div>

                {/* Add Comment */}
                <div className="flex gap-2">
                  <textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md resize-none"
                    rows={3}
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || commentMutation.isPending}
                    className="self-end"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                {/* Comments List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {comments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No comments yet. Be the first to comment!
                    </p>
                  ) : (
                    comments.map((comment) => (
                      <CommentItem key={comment.id} comment={comment} />
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Report Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Report Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={getStatusBadgeVariant(report.status)}>
                  {report.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Category</span>
                <Badge variant="outline">{report.category}</Badge>
              </div>

              {report.urgency && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Urgency</span>
                  <span
                    className={`text-sm font-medium px-2 py-1 rounded-full ${getUrgencyColor(
                      report.urgency
                    )}`}
                  >
                    {report.urgency}
                  </span>
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" />
                  Votes
                </span>
                <span className="font-medium">{report._count?.votes || 0}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  Comments
                </span>
                <span className="font-medium">
                  {report._count?.comments || 0}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  Views
                </span>
                <span className="font-medium">-</span>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="w-px h-8 bg-border"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Report Created</p>
                    <p className="text-sm text-muted-foreground">
                      {report.createdAt
                        ? format(
                            new Date(report.createdAt),
                            "MMM dd, yyyy 'at' h:mm a"
                          )
                        : "Unknown"}
                    </p>
                  </div>
                </div>

                {report.status !== "PENDING" && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Status Updated</p>
                      <p className="text-sm text-muted-foreground">
                        Report status changed to {report.status}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
