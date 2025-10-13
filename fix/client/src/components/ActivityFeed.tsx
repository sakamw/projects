import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import {
  FileText,
  MessageSquare,
  ThumbsUp,
  CheckCircle,
  Clock,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "../lib/utils";

interface Activity {
  id: string;
  type:
    | "report_created"
    | "report_updated"
    | "comment_added"
    | "vote_cast"
    | "status_changed";
  title: string;
  description?: string;
  timestamp: Date;
  metadata?: {
    reportId?: string;
    status?: string;
    priority?: "low" | "medium" | "high";
  };
}

interface ActivityFeedProps {
  activities: Activity[];
  className?: string;
  maxHeight?: string;
}

const activityIcons: Record<Activity["type"], LucideIcon> = {
  report_created: FileText,
  report_updated: FileText,
  comment_added: MessageSquare,
  vote_cast: ThumbsUp,
  status_changed: CheckCircle,
};

const activityColors: Record<Activity["type"], string> = {
  report_created: "text-blue-600",
  report_updated: "text-orange-600",
  comment_added: "text-green-600",
  vote_cast: "text-purple-600",
  status_changed: "text-emerald-600",
};

export function ActivityFeed({
  activities,
  className,
  maxHeight = "400px",
}: ActivityFeedProps) {
  const getStatusBadge = (status?: string) => {
    if (!status) return null;

    const statusConfig = {
      OPEN: { variant: "destructive" as const, label: "Open" },
      IN_PROGRESS: { variant: "default" as const, label: "In Progress" },
      RESOLVED: { variant: "secondary" as const, label: "Resolved" },
      CLOSED: { variant: "outline" as const, label: "Closed" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.OPEN;

    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  const getPriorityIcon = (priority?: string) => {
    if (!priority) return null;

    if (priority === "high") {
      return <AlertCircle className="h-3 w-3 text-red-500" />;
    } else if (priority === "medium") {
      return <Clock className="h-3 w-3 text-yellow-500" />;
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea style={{ maxHeight }}>
          <div className="space-y-4">
            {activities.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity</p>
              </div>
            ) : (
              activities.map((activity) => {
                const Icon = activityIcons[activity.type];
                const iconColor = activityColors[activity.type];

                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={cn("mt-1", iconColor)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">
                          {activity.title}
                        </p>
                        <div className="flex items-center space-x-2">
                          {getPriorityIcon(activity.metadata?.priority)}
                          {getStatusBadge(activity.metadata?.status)}
                        </div>
                      </div>
                      {activity.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {activity.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(activity.timestamp, {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
