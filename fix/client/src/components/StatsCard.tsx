import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp, TrendingDown, Minus, Menu, type LucideIcon } from "lucide-react";
import { cn } from "../lib/utils";
import { useEffect, useRef, useState } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  }>;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  actions = [],
}: StatsCardProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const getTrendIcon = () => {
    if (!trend) return null;

    if (trend.value > 0) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (trend.value < 0) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    } else {
      return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return "";

    if (trend.value > 0) {
      return "text-green-600";
    } else if (trend.value < 0) {
      return "text-red-600";
    } else {
      return "text-gray-600";
    }
  };

  return (
    <Card
      className={cn(
        "relative overflow-visible border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/50 transition-transform hover:translate-y-[-2px] hover:shadow-lg",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-50">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="flex items-center gap-1" ref={menuRef}>
          {Icon && (
            <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          {actions.length > 0 && (
            <>
              <button
                type="button"
                aria-label="Open actions"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md ring-1 ring-inset ring-white/10 bg-white/5 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
              >
                <Menu className="h-4 w-4" />
              </button>
              {open && (
                <div
                  role="menu"
                  className="absolute right-0 top-10 z-50 w-44 rounded-lg border bg-popover/90 backdrop-blur p-1 shadow-xl"
                >
                  {actions.map((a, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        a.onClick();
                        setOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-primary/10"
                    >
                      {a.icon && <a.icon className="h-3.5 w-3.5" />}
                      {a.label}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-3xl font-extrabold tracking-tight">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div
            className={cn("flex items-center text-xs mt-2", getTrendColor())}
          >
            {getTrendIcon()}
            <span className="ml-1">
              {Math.abs(trend.value)}% from last month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
