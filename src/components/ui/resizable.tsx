import type { ComponentProps } from "react";
import { GripVerticalIcon } from "lucide-react";
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

function ResizableHandle({
  withHandle,
  className,
  ...props
}: ComponentProps<typeof Separator> & { withHandle?: boolean }) {
  return (
    <Separator
      data-slot="resizable-handle"
      className={cn(
        "group relative flex w-1.5 shrink-0 items-center justify-center bg-transparent outline-none transition-colors",
        "after:absolute after:inset-y-0 after:left-1/2 after:w-px after:-translate-x-1/2 after:bg-border after:transition-colors",
        "hover:after:bg-primary/40 focus-visible:after:bg-primary data-[state=drag]:after:bg-primary",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-5 w-3 items-center justify-center rounded-sm border bg-background text-muted-foreground opacity-0 shadow-xs transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <GripVerticalIcon className="size-2.5" />
        </div>
      )}
    </Separator>
  );
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
