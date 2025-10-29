import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ActivityFeed } from "../ActivityFeed";
import { RefreshCw } from "lucide-react";

interface ActivitySectionProps {
  activities: Array<{
    id: string;
    title: string;
    description?: string;
    timestamp: Date;
  }>;
  loading: boolean;
}

export function ActivitySection({ activities, loading }: ActivitySectionProps) {
  return (
    <div className="space-y-6">
      {loading ? (
        <div className="text-center text-muted-foreground py-8">
          <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin" />
          Loading activities...
        </div>
      ) : activities.length > 0 ? (
        <ActivityFeed
          activities={activities}
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
    </div>
  );
}
