/**
 * External dependencies.
 */
import { useCallback, useRef, useState } from "react";

/**
 * Internal dependencies.
 */
import { CanvasPanel } from "@/components/layout/CanvasPanel";
import { CategoryRail, CategoryTabBar } from "@/components/layout/CategoryRail";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { TopBar, WorkspaceModeBar } from "@/components/layout/TopBar";
import type { WorkspaceMode } from "@/components/layout/TopBar";
import { ConfigPanel } from "@/features/config/ConfigPanel";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useHotkey, useIsDesktop, useStageExport } from "@/hooks";

/** Waits for the browser to paint, so a just-mounted node can be measured. */
const nextPaint = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });

/**
 * Workspace shell.
 *
 * Three regions on desktop — the content-type rail, the inspector and the
 * canvas — with the last two sharing a resizable split. Narrow viewports have
 * no room for the split, so they move the rail to a bottom tab bar and swap
 * the inspector and the canvas in place.
 */
export const App = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const [mode, setMode] = useState<WorkspaceMode>("edit");
  const [commandsOpen, setCommandsOpen] = useState(false);

  useHotkey("k", () => setCommandsOpen((open) => !open), {
    meta: true,
    allowInInput: true,
  });

  /*
   * Exporting rasterises the live stage, which on a narrow viewport may not be
   * mounted — the inspector is showing instead. Rather than failing with
   * "there is nothing to export", bring the canvas forward and let the export
   * proceed from what the user asked for.
   */
  const revealCanvas = useCallback(async () => {
    if (isDesktop || mode === "preview") return;
    setMode("preview");
    await nextPaint();
  }, [isDesktop, mode]);

  const exportActions = useStageExport(stageRef, revealCanvas);

  return (
    <TooltipProvider>
      <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
        <TopBar
          exportActions={exportActions}
          onOpenCommands={() => setCommandsOpen(true)}
        />

        <WorkspaceModeBar mode={mode} onModeChange={setMode} />

        <div className="flex min-h-0 flex-1">
          <CategoryRail />

          <main className="min-h-0 min-w-0 flex-1">
            {isDesktop ? (
              <ResizablePanelGroup orientation="horizontal" className="h-full">
                <ResizablePanel
                  id="inspector"
                  defaultSize="42%"
                  minSize="26%"
                  maxSize="60%"
                  className="h-full"
                >
                  <ConfigPanel className="h-full" />
                </ResizablePanel>

                <ResizableHandle />

                <ResizablePanel
                  id="canvas"
                  defaultSize="58%"
                  minSize="30%"
                  className="h-full"
                >
                  <CanvasPanel stageRef={stageRef} className="h-full" />
                </ResizablePanel>
              </ResizablePanelGroup>
            ) : mode === "edit" ? (
              <ConfigPanel className="h-full" />
            ) : (
              <CanvasPanel stageRef={stageRef} className="h-full" />
            )}
          </main>
        </div>

        <CategoryTabBar />
      </div>

      <CommandPalette
        open={commandsOpen}
        onOpenChange={setCommandsOpen}
        exportActions={exportActions}
      />

      <Toaster />
    </TooltipProvider>
  );
};
