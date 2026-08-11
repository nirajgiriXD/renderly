/**
 * External dependencies.
 */
import { Eye, Moon, Search, SlidersHorizontal, Sun } from "lucide-react";

/**
 * Internal dependencies.
 */
import { ExportMenu } from "./ExportMenu";
import { SettingsDialog } from "./SettingsDialog";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";
import { Hint } from "@/components/ui/tooltip";
import { GitHub } from "@/icons";
import { cn } from "@/lib/utils";
import { isAppleDevice } from "@/hooks";
import type { StageExport } from "@/hooks";
import { useSettings } from "@/store";

export type WorkspaceMode = "edit" | "preview";

const MODE_OPTIONS = [
  { value: "edit" as const, label: "Edit", icon: SlidersHorizontal },
  { value: "preview" as const, label: "Preview", icon: Eye },
];

/**
 * The application bar: identity on the left, workspace actions on the right.
 */
export const TopBar = ({
  exportActions,
  onOpenCommands,
}: {
  exportActions: StageExport;
  onOpenCommands: () => void;
}) => {
  const { resolvedScheme, updateSettings } = useSettings();
  const isDark = resolvedScheme === "dark";

  return (
    <header className="z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-surface px-3 sm:px-4">
      <a
        href="./"
        className={cn(
          "flex shrink-0 items-center gap-2.5 rounded-lg py-1 pr-2",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        )}
      >
        <img
          src={`${import.meta.env.BASE_URL}logo.png`}
          alt=""
          className="size-7 rounded-lg shadow-xs ring-1 ring-black/5"
        />
        <span className="hidden text-[0.9375rem] font-semibold leading-none tracking-tight sm:block">
          Post&nbsp;Preview
        </span>
      </a>

      <div className="ml-auto flex shrink-0 items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenCommands}
          className="hidden gap-2 pr-1.5 text-muted-foreground lg:inline-flex"
        >
          <Search className="size-3.5" />
          <span>Jump to…</span>
          <kbd className="ml-1 rounded border border-border bg-sunken px-1.5 py-0.5 font-sans text-[0.6875rem] font-medium leading-4 text-faint">
            {isAppleDevice() ? "⌘" : "Ctrl"}K
          </kbd>
        </Button>

        <ExportMenu actions={exportActions} />

        <span aria-hidden className="mx-1 hidden h-5 w-px bg-border sm:block" />

        <Hint label={isDark ? "Switch to light" : "Switch to dark"}>
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label={
              isDark ? "Switch to light theme" : "Switch to dark theme"
            }
            onClick={() =>
              updateSettings({ colorScheme: isDark ? "light" : "dark" })
            }
          >
            {isDark ? <Sun /> : <Moon />}
          </Button>
        </Hint>

        <SettingsDialog />

        <Hint label="Source on GitHub">
          <Button size="icon-sm" variant="ghost" asChild className="lg:hidden">
            <a
              href="https://github.com/nirajgiriXD/post-preview"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="View the source on GitHub"
            >
              <img
                src={GitHub}
                alt=""
                className="size-4 opacity-70 dark:brightness-0 dark:invert"
              />
            </a>
          </Button>
        </Hint>
      </div>
    </header>
  );
};

/**
 * Edit / preview switch for viewports where the two cannot share the screen.
 *
 * Given its own row rather than squeezed into the top bar: at 390px the bar
 * already carries the mark and four actions, and a switch that truncates to
 * "E…" is not a switch anyone can use.
 */
export const WorkspaceModeBar = ({
  mode,
  onModeChange,
}: {
  mode: WorkspaceMode;
  onModeChange: (mode: WorkspaceMode) => void;
}) => (
  <div className="flex shrink-0 justify-center border-b border-border bg-surface px-3 py-2 lg:hidden">
    <Segmented
      label="Workspace view"
      value={mode}
      options={MODE_OPTIONS}
      onChange={onModeChange}
      className="w-full max-w-sm"
    />
  </div>
);
