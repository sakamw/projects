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
  const status = connLoading
    ? "Checking connection..."
    : connError
    ? "Offline: Can't reach server"
    : "Live: Connected";

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-background/60 to-muted/20 p-4 md:p-6 shadow-sm">
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-hero text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back! Here's your activity overview.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={connError ? "destructive" : "secondary"}
            className={
              connError
                ? ""
                : "bg-emerald-600/90 text-white hover:bg-emerald-600 flex items-center gap-2"
            }
          >
            {connError ? null : (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/80 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
            )}
            {status}
          </Badge>
          <Button variant="outline" size="sm" onClick={onRefresh} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
}


