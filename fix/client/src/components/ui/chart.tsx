/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "../../lib/utils";

type ChartConfigValue = { label: string; color: string };
export type ChartConfig = Record<string, ChartConfigValue>;

export function ChartContainer({
  children,
  className,
  config,
}: {
  children: React.ReactNode;
  className?: string;
  config: ChartConfig;
}) {
  return (
    <div
      className={cn("grid w-full items-center", className)}
      style={
        Object.fromEntries(
          Object.entries(config).map(([key, value]) => [
            `--color-${key}`,
            value.color,
          ])
        ) as React.CSSProperties
      }
    >
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          {children as any}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ChartTooltip({
  content,
  cursor = true,
}: {
  content?: React.ReactNode;
  defaultIndex?: number;
  cursor?: boolean;
}) {
  return (
    <Tooltip
      cursor={cursor}
      content={content as any}
      allowEscapeViewBox={{ x: true, y: true }}
      wrapperStyle={{ outline: "none" }}
    />
  );
}

type RechartsPayload = { name?: string; value?: number; color?: string };
type TooltipProps = {
  active?: boolean;
  label?: string | number;
  payload?: RechartsPayload[];
  labelFormatter?: (label: string | number) => string;
};

export function ChartTooltipContent(props: TooltipProps) {
  if (!props.active || !props.payload || props.payload.length === 0)
    return null;
  const labelText = props.labelFormatter
    ? props.labelFormatter(props.label as string)
    : String(props.label ?? "");
  return (
    <div className="z-50 rounded-md border border-border bg-card px-3 py-2 text-xs text-foreground shadow-md">
      {labelText && (
        <div className="mb-1 text-muted-foreground">{labelText}</div>
      )}
      <div className="space-y-1">
        {props.payload.map((p, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-sm"
              style={{ backgroundColor: p.color || "currentColor" }}
            />
            <span className="text-foreground">{p.name ?? ""}</span>
            <span className="ml-auto font-medium tabular-nums">{p.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
