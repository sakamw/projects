import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import type { LucideIcon } from "lucide-react";
import { cn } from "../lib/utils";

interface QuickAction {
  id: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  onClick: () => void;
  disabled?: boolean;
  badge?: string | number;
}

interface QuickActionsProps {
  actions: QuickAction[];
  title?: string;
  className?: string;
  columns?: 2 | 3 | 4;
}

export function QuickActions({
  actions,
  title = "Quick Actions",
  className,
  columns = 3,
}: QuickActionsProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn("grid gap-3", gridCols[columns])}>
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <Button
                key={action.id}
                variant={action.variant || "outline"}
                className="h-auto p-4 flex flex-col items-center gap-2 text-center relative"
                onClick={action.onClick}
                disabled={action.disabled}
              >
                <div className="relative">
                  <Icon className="h-6 w-6" />
                  {action.badge && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {action.badge}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="font-medium text-sm">{action.label}</div>
                  {action.description && (
                    <div className="text-xs text-muted-foreground">
                      {action.description}
                    </div>
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
