import { List, CheckCircle, ThumbsUp, Clock, Download } from "lucide-react";
import { StatsCard } from "../StatsCard";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const exportMetrics = () => {
    const data = {
      openReports,
      resolvedReports,
      totalVotes,
      avgResolutionTime,
      exportedAt: new Date().toISOString(),
    };
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `dashboard-stats-${new Date().toISOString().split("T")[0]}.json`;
    const link = document.createElement("a");
    link.setAttribute("href", dataUri);
    link.setAttribute("download", exportFileDefaultName);
    link.click();
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Open Reports"
        value={statsLoading ? "..." : openReports}
        description={openReports > 0 ? "Active issues" : "No open reports yet"}
        icon={List}
        actions={[
          { label: "View open reports", onClick: () => navigate("/reports?status=OPEN") },
          { label: "Create report", onClick: () => navigate("/reports/new") },
          { label: "Export metrics", onClick: exportMetrics, icon: Download },
        ]}
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
        actions={[
          { label: "View resolved reports", onClick: () => navigate("/reports?status=RESOLVED") },
          { label: "Export metrics", onClick: exportMetrics, icon: Download },
        ]}
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
        actions={[
          { label: "View votes", onClick: () => navigate("/votes") },
          { label: "Export metrics", onClick: exportMetrics, icon: Download },
        ]}
      />
      <StatsCard
        title="Response Time"
        value={statsLoading ? "..." : avgResolutionTime}
        description="Average resolution"
        icon={Clock}
        actions={[
          { label: "View analytics", onClick: () => navigate("/analytics") },
          { label: "Export metrics", onClick: exportMetrics, icon: Download },
        ]}
      />
    </div>
  );
}
