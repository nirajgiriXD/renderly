/**
 * Internal dependencies.
 */
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/ui/tooltip";
import { GitHub } from "@/icons";
import { CATEGORIES } from "@/constants";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/store";

/**
 * The primary navigation: which kind of content you are mocking up.
 *
 * Content type is the axis everything else hangs off — the sections, the
 * platform list and the preview all change with it — so on desktop it gets a
 * persistent rail rather than a row of tabs competing for space in the header.
 */
export const CategoryRail = () => {
  const { category, setCategory } = useWorkspace();

  return (
    <nav
      aria-label="Content type"
      className="hidden w-19 shrink-0 flex-col items-center gap-1 border-r border-border bg-surface py-3 lg:flex"
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
              "group relative flex w-16 cursor-pointer flex-col items-center gap-1.5 rounded-xl px-1 py-2.5",
              "transition-colors duration-150 ease-out-quad",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              selected
                ? "bg-brand-soft text-brand-text"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            {/* The active marker rides the left edge of the rail. */}
            <span
              aria-hidden
              className={cn(
                "absolute -left-1.5 top-1/2 h-6 w-0.75 -translate-y-1/2 rounded-r-full bg-primary",
                "transition-[opacity,transform] duration-200 ease-out-expo",
                selected
                  ? "scale-y-100 opacity-100"
                  : "scale-y-0 opacity-0"
              )}
            />
            <entry.icon className="size-[1.15rem]" aria-hidden />
            <span className="text-[0.625rem] font-medium leading-none tracking-tight">
              {entry.label}
            </span>
          </button>
        );
      })}

      <div className="mt-auto">
        <Hint label="View the source on GitHub" side="right">
          <Button size="icon-sm" variant="ghost" asChild>
            <a
              href="https://github.com/nirajgiriXD/renderly"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="View the source on GitHub"
            >
              <img
                src={GitHub}
                alt=""
                className="size-4 opacity-70 transition-opacity hover:opacity-100 dark:brightness-0 dark:invert"
              />
            </a>
          </Button>
        </Hint>
      </div>
    </nav>
  );
};

/**
 * The same navigation for viewports too narrow for a rail.
 *
 * A bottom bar rather than a collapsed drawer: switching content type is the
 * single most frequent action in the app, and it should never cost a menu.
 */
export const CategoryTabBar = () => {
  const { category, setCategory } = useWorkspace();

  return (
    <nav
      aria-label="Content type"
      className="grid shrink-0 grid-cols-4 gap-1 border-t border-border bg-surface px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 lg:hidden"
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
              "flex cursor-pointer flex-col items-center gap-1 rounded-lg px-1 py-1.5",
              "transition-colors duration-150 ease-out-quad",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              selected
                ? "bg-brand-soft text-brand-text"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <entry.icon className="size-[1.15rem]" aria-hidden />
            <span className="text-[0.625rem] font-medium leading-none">
              {entry.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
