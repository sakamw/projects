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
              className="bg-primary/80 rounded-t-sm w-8 mb-2"
              style={{
                height: `${
                  (item.value /
                    Math.max(...(data?.map((d) => d.value) || [1]))) *
                  100
                }%`,
                backgroundColor:
                  item.color || `hsl(${(index * 60) % 360}, 70%, 50%)`,
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
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          {period && (
            <Badge variant="outline" className="text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              {period}
            </Badge>
          )}
          {actions.length > 0 && (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {description && (
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
        )}
        <div className="rounded-lg border bg-card/50 p-4" style={{ height }}>
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
