/**
 * External dependencies.
 */
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Internal dependencies.
 */
import { cn } from "@/lib/utils";

/**
 * The studio's one empty state.
 *
 * Every "nothing here yet" moment gets the same shape — a soft-tinted glyph,
 * a statement of what is missing, a sentence on how to fix it, and the action
 * that fixes it — so an empty list never reads as a broken one.
 */
export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  size = "default",
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  size?: "sm" | "default";
  className?: string;
}) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center rounded-xl border border-dashed border-border-strong/70 bg-sunken/40 text-center",
      size === "sm" ? "gap-2.5 px-5 py-7" : "gap-3.5 px-6 py-12",
      className
    )}
  >
    <span
      className={cn(
        "grid place-items-center rounded-xl bg-brand-soft text-brand-text",
        size === "sm" ? "size-9" : "size-11"
      )}
    >
      <Icon className={size === "sm" ? "size-4" : "size-5"} aria-hidden />
    </span>

    <div className="space-y-1">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {description && (
        <p className="mx-auto max-w-xs text-pretty text-[0.8125rem] leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>

    {action && <div className="pt-0.5">{action}</div>}
  </div>
);
