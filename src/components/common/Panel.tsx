/**
 * External dependencies.
 */
import type { ReactNode } from "react";

/**
 * Internal dependencies.
 */
import { cn } from "@/lib/utils";

/**
 * A titled group of related controls.
 *
 * The inspector is a long scroll of settings; without a container that carries
 * its own heading and blurb, "which of these fields belong together" has to be
 * inferred from whitespace alone.
 */
export const Panel = ({
  title,
  description,
  action,
  children,
  className,
}: {
  title?: ReactNode;
  description?: ReactNode;
  /** Rendered at the far right of the header row. */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) => (
  <section
    className={cn(
      "rounded-xl border border-border bg-surface shadow-xs",
      className
    )}
  >
    {(title || action) && (
      <header className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0 space-y-0.5">
          {title && (
            <h3 className="text-[0.8125rem] font-semibold leading-tight text-foreground">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-xs leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </header>
    )}

    <div className="space-y-4 p-4">{children}</div>
  </section>
);

/**
 * Heading for a run of content that is not boxed — a list of comments, the
 * turns in a transcript. Carries a count and the actions that add to it.
 */
export const GroupHeader = ({
  title,
  count,
  description,
  actions,
  className,
}: {
  title: ReactNode;
  count?: number;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex flex-wrap items-end justify-between gap-x-3 gap-y-2",
      className
    )}
  >
    <div className="min-w-0 space-y-0.5">
      <h3 className="flex items-center gap-2 text-[0.8125rem] font-semibold text-foreground">
        {title}
        {count !== undefined && (
          <span
            data-numeric
            className="rounded-full bg-muted px-1.5 py-0.5 text-[0.6875rem] font-semibold leading-4 text-muted-foreground"
          >
            {count}
          </span>
        )}
      </h3>
      {description && (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
    {actions && <div className="flex shrink-0 items-center gap-1.5">{actions}</div>}
  </div>
);
