import * as React from "react";
import { cn } from "../../lib/utils";

export function Separator({
  orientation = "horizontal",
  className,
  ...props
}: {
  orientation?: "horizontal" | "vertical";
} & React.HTMLAttributes<HTMLDivElement>) {
  const isVertical = orientation === "vertical";
  return (
    <div
      role="separator"
      className={cn(
        isVertical ? "h-full w-px" : "h-px w-full",
        "bg-border",
        className
      )}
      {...props}
    />
  );
}
