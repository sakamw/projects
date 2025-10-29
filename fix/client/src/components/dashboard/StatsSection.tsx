import { List, CheckCircle, ThumbsUp, Clock } from "lucide-react";
import { StatsCard } from "../StatsCard";

interface StatsSectionProps {
  statsLoading: boolean;
  openReports: number;
  resolvedReports: number;
  totalVotes: number;
  avgResolutionTime: string;
}

export function StatsSection({
  statsLoading,
  openReports,
  resolvedReports,
  totalVotes,
  avgResolutionTime,
}: StatsSectionProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Open Reports"
        value={statsLoading ? "..." : openReports}
        description={openReports > 0 ? "Active issues" : "No open reports yet"}
        icon={List}
      />
      <StatsCard
        title="Resolved"
        value={statsLoading ? "..." : resolvedReports}
        description={
          resolvedReports > 0
            ? "Completed this month"
            : "No resolved reports yet"
        }
        icon={CheckCircle}
      />
      <StatsCard
        title="My Votes"
        value={statsLoading ? "..." : totalVotes}
        description={
          totalVotes > 0
            ? "Community engagement"
            : "You haven't received any votes yet"
        }
        icon={ThumbsUp}
      />
      <StatsCard
        title="Response Time"
        value={statsLoading ? "..." : avgResolutionTime}
        description="Average resolution"
        icon={Clock}
      />
    </div>
  );
}
