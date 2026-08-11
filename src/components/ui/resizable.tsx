import type { ComponentProps } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";

import { cn } from "@/lib/utils";

/**
 * Wrappers around `react-resizable-panels` v4, whose primitives are named
 * `Group` / `Panel` / `Separator`. The shadcn names are kept so call sites
 * read the way the rest of the UI kit does.
 */
function ResizablePanelGroup({
  className,
  orientation = "horizontal",
  ...props
}: ComponentProps<typeof Group>) {
  return (
    <Group
      data-slot="resizable-panel-group"
      orientation={orientation}
      className={cn(
        "flex h-full w-full",
        orientation === "vertical" ? "flex-col" : "flex-row",
        className
      )}
      {...props}
    />
  );
}

function ResizablePanel({ className, ...props }: ComponentProps<typeof Panel>) {
  return (
    <Panel
      data-slot="resizable-panel"
      className={cn("min-w-0 overflow-hidden", className)}
      {...props}
    />
  );
}

/**
 * The seam between the inspector and the canvas.
 *
 * Reads as a hairline at rest and thickens into a brand-coloured rail while
 * it is grabbed, so the drag target is obvious the moment you approach it
 * without adding a permanent divider to the layout.
 */
function ResizableHandle({
  className,
  ...props
}: ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="resizable-handle"
      className={cn(
        "group relative w-2 shrink-0 cursor-col-resize bg-transparent outline-none",
        // The visible hairline.
        "after:absolute after:inset-y-0 after:left-1/2 after:w-px after:-translate-x-1/2 after:bg-border",
        "after:transition-[background-color,width] after:duration-150 after:ease-out-quad",
        "hover:after:w-0.75 hover:after:bg-primary/50",
        "focus-visible:after:w-0.75 focus-visible:after:bg-ring",
        "data-[state=drag]:after:w-0.75 data-[state=drag]:after:bg-primary",
        className
      )}
      {...props}
    />
  );
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
