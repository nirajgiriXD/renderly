/**
 * External dependencies.
 */
import { useRef, useState } from "react";
import { Eye, SlidersHorizontal } from "lucide-react";

/**
 * Internal dependencies.
 */
import { AppHeader } from "@/components/layout/AppHeader";
import { PreviewPanel } from "@/components/layout/PreviewPanel";
import { ConfigPanel } from "@/features/config/ConfigPanel";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { useIsDesktop } from "@/hooks";

/**
 * Workspace shell.
 *
 * Wide viewports get a resizable editor/preview split. Narrow ones would make
 * that split unusable, so they switch between the two halves instead of
 * stacking them into one long scroll.
 */
export const App = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <AppHeader exportTargetRef={stageRef} />

      <main className="min-h-0 flex-1">
        {isDesktop ? (
          <ResizablePanelGroup orientation="horizontal" className="h-full">
            <ResizablePanel
              id="editor"
              defaultSize="46%"
              minSize="28%"
              className="h-full"
            >
              <ConfigPanel className="h-full" />
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel
              id="preview"
              defaultSize="54%"
              minSize="30%"
              className="h-full"
            >
              <PreviewPanel stageRef={stageRef} className="h-full" />
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className="flex h-full flex-col">
            <div className="min-h-0 flex-1">
              {mobileView === "edit" ? (
                <ConfigPanel className="h-full" />
              ) : (
                <PreviewPanel stageRef={stageRef} className="h-full" />
              )}
            </div>

            <nav
              aria-label="Workspace view"
              className="grid shrink-0 grid-cols-2 gap-1 border-t bg-background p-2"
            >
              {(
                [
                  { id: "edit", label: "Edit", icon: SlidersHorizontal },
                  { id: "preview", label: "Preview", icon: Eye },
                ] as const
              ).map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  aria-current={mobileView === entry.id ? "page" : undefined}
                  onClick={() => setMobileView(entry.id)}
                  className={cn(
                    "flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    mobileView === entry.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <entry.icon className="size-4" aria-hidden />
                  {entry.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </main>

      <Toaster />
    </div>
  );
};
