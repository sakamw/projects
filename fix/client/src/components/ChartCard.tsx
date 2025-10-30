import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../lib/utils";
import { useEffect, useRef, useState } from "react";

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface ChartCardProps {
  title: string;
  description?: string;
  type: "bar" | "line" | "pie" | "area" | "metric" | "circular";
  data?: ChartData[];
  value?: string | number;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  period?: string;
  icon?: LucideIcon;
  className?: string;
  height?: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  }>;
}

const chartIcons: Record<ChartCardProps["type"], LucideIcon> = {
  bar: BarChart3,
  line: LineChart,
  pie: PieChart,
  area: TrendingUp,
  metric: TrendingUp,
  circular: PieChart,
};

export function ChartCard({
  title,
  description,
  type,
  data,
  value,
  trend,
  period,
  icon: Icon,
  className,
  height = "300px",
  actions = [],
}: ChartCardProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const ChartIcon = chartIcons[type];
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const getTrendColor = () => {
    if (!trend) return "";
    return trend.isPositive ? "text-green-600" : "text-red-600";
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend.isPositive ? "↗" : "↘";
  };

  // Mock chart visualization - in a real app, you'd use a charting library like Chart.js or Recharts
  const renderMockChart = () => {
    if (type === "metric") {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">{value}</div>
            {trend && (
              <div className={cn("text-sm font-medium", getTrendColor())}>
                {getTrendIcon()} {Math.abs(trend.value)}% {trend.label}
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-end justify-center h-full space-x-2">
        {data?.slice(0, 6).map((item, index) => (
          <div key={item.label} className="flex flex-col items-center">
            <div
              className="rounded-t-md w-8 mb-2 transition-all duration-300"
              style={{
                height: `${
                  (item.value /
                    Math.max(...(data?.map((d) => d.value) || [1]))) *
                  100
                }%`,
                background:
                  item.color
                    ? item.color
                    : `linear-gradient(180deg, hsl(${(index * 60) % 360}, 85%, 55%) 0%, hsl(${(index * 60) % 360}, 70%, 45%) 100%)`,
                boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
              }}
            />
            <div className="text-xs text-muted-foreground transform -rotate-45 origin-top-left whitespace-nowrap">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className={cn("relative overflow-visible border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/50 shadow-sm", className)}>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
      <CardHeader className="relative z-50 flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          {Icon && (
            <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
        <div className="flex items-center space-x-2" ref={menuRef}>
          {period && (
            <Badge variant="outline" className="text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              {period}
            </Badge>
          )}
          {actions.length > 0 && (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label="Open actions"
                onClick={() => setMenuOpen((v) => !v)}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-9 z-50 w-44 rounded-lg border bg-popover/90 backdrop-blur p-1 shadow-xl"
                >
                  {actions.map((a, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        a.onClick();
                        setMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-primary/10"
                    >
                      {a.icon && <a.icon className="h-3.5 w-3.5" />}
                      {a.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        {description && (
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
        )}
        <div className="rounded-xl border bg-gradient-to-br from-background/50 to-muted/10 p-4 shadow-sm" style={{ height }}>
          {renderMockChart()}
        </div>
        {actions.length > 0 && (
          <div className="flex justify-end space-x-2 mt-4">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={action.onClick}
                className="text-xs"
              >
                {action.icon && <action.icon className="h-3 w-3 mr-1" />}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
