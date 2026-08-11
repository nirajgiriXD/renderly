import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-lg border border-input bg-surface px-3 text-sm text-foreground shadow-xs",
        "transition-[border-color,box-shadow,background-color] duration-150 ease-out-quad outline-none",
        "hover:border-border-strong",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/22 focus-visible:outline-none",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20",
        // Keep iOS from zooming the whole page when a field takes focus.
        "text-base md:text-sm",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "[&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-55 [&::-webkit-calendar-picker-indicator]:hover:opacity-100",
        "dark:[&::-webkit-calendar-picker-indicator]:invert",
        className
      )}
      {...props}
    />
  );
}

export { Input };
