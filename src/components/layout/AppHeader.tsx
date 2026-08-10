/**
 * External dependencies.
 */
import { Moon, Sun } from "lucide-react";

/**
 * Internal dependencies.
 */
import { SettingsDialog } from "./SettingsDialog";
import { ExportMenu } from "./ExportMenu";
import { Button } from "@/components/ui/button";
import { GitHub } from "@/icons";
import { CATEGORIES } from "@/constants";
import { cn } from "@/lib/utils";
import { useSettings, useWorkspace } from "@/store";

/**
 * Top bar: identity, the category switcher, and the workspace actions.
 */
export const AppHeader = ({
  exportTargetRef,
}: {
  exportTargetRef: React.RefObject<HTMLElement | null>;
}) => {
  const { category, setCategory } = useWorkspace();
  const { resolvedScheme, updateSettings } = useSettings();

  return (
    <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur-md">
      <div className="flex items-center gap-3 px-3 py-2.5 sm:px-5">
        <a
          href="./"
          className="flex shrink-0 items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-ring"
        >
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt=""
            className="size-7 rounded-md"
          />
          <span className="hidden text-sm font-semibold tracking-tight sm:inline">
            Post Preview
          </span>
        </a>

        <div className="mx-auto min-w-0 flex-1 overflow-x-auto">
          <nav
            aria-label="Content type"
            className="mx-auto flex w-max gap-1 rounded-lg bg-muted p-1"
          >
            {CATEGORIES.map((entry) => {
              const selected = entry.id === category;
              return (
                <button
                  key={entry.id}
                  type="button"
                  aria-current={selected ? "page" : undefined}
                  onClick={() => setCategory(entry.id)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                    selected
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <entry.icon className="size-4" aria-hidden />
                  <span className="hidden sm:inline">{entry.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <ExportMenu targetRef={exportTargetRef} />

          <Button
            size="icon"
            variant="ghost"
            aria-label={
              resolvedScheme === "dark"
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
            onClick={() =>
              updateSettings({
                colorScheme: resolvedScheme === "dark" ? "light" : "dark",
              })
            }
          >
            {resolvedScheme === "dark" ? <Sun /> : <Moon />}
          </Button>

          <SettingsDialog />

          <Button size="icon" variant="ghost" asChild>
            <a
              href="https://github.com/nirajgiriXD/post-preview"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="View the source on GitHub"
            >
              <img
                src={GitHub}
                alt=""
                className="size-4 dark:brightness-0 dark:invert"
              />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
};
