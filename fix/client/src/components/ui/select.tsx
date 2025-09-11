import * as React from "react";
import { cn } from "../../lib/utils";

export type SelectOption = { label: string; value: string };

type BaseProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  options?: SelectOption[];
  placeholder?: string;
};

export const Select = React.forwardRef<HTMLSelectElement, BaseProps>(
  ({ className, children, options, placeholder, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled selected hidden>
            {placeholder}
          </option>
        ) : null}
        {options
          ? options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))
          : children}
      </select>
    );
  }
);
Select.displayName = "Select";
