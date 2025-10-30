import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { RefreshCw } from "lucide-react";

interface DashboardHeaderProps {
  connLoading: boolean;
  connError: boolean;
  onRefresh: () => void;
}

export function DashboardHeader({
  connLoading,
  connError,
  onRefresh,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your activity overview.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge
          variant={connError ? "destructive" : "secondary"}
          className={
            connError ? "" : "bg-green-600 text-white hover:bg-green-600"
          }
        >
          {connLoading
            ? "Checking connection..."
            : connError
            ? "Offline: Can't reach server"
            : "Live: Connected"}
        </Badge>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    </div>
  );
}


