/**
 * External dependencies.
 */
import type { ComponentProps, ReactNode } from "react";

/**
 * Internal dependencies.
 */
import { cn } from "@/lib/utils";

/**
 * Icon affordance used by feed action bars.
 *
 * `tint` colours the hover state the way each network does (X turns replies
 * blue, reposts green and likes pink).
 */
export const IconAction = ({
  label,
  tint = "neutral",
  className,
  children,
  ...props
}: ComponentProps<"button"> & {
  label: string;
  tint?: "neutral" | "blue" | "green" | "pink" | "red" | "accent";
}) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    data-tint={tint}
    className={cn(
      "group/action inline-flex cursor-pointer items-center gap-1 rounded-full text-[var(--pv-muted)] transition-colors",
      "hover:data-[tint=blue]:text-[#1d9bf0] hover:data-[tint=green]:text-[#00ba7c]",
      "hover:data-[tint=pink]:text-[#f91880] hover:data-[tint=red]:text-[#ff4500]",
      "hover:data-[tint=accent]:text-[var(--pv-accent)] hover:data-[tint=neutral]:text-[var(--pv-fg)]",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

/** Thin rule matching the previewed platform's divider colour. */
export const Divider = ({ className }: { className?: string }) => (
  <div className={cn("h-px w-full bg-[var(--pv-border)]", className)} />
);

/** The animated "…" shown while the other side is typing. */
export const TypingDots = ({ className }: { className?: string }) => (
  <span className={cn("inline-flex items-center gap-1", className)}>
    {[0, 1, 2].map((dot) => (
      <span
        key={dot}
        className="size-1.5 animate-bounce rounded-full bg-current opacity-60"
        style={{ animationDelay: `${dot * 140}ms`, animationDuration: "1s" }}
      />
    ))}
  </span>
);

/**
 * Placeholder shown when a preview has nothing to render yet.
 *
 * Previews stay useful while empty by naming the field that would fill them.
 */
export const PreviewPlaceholder = ({
  icon,
  title,
  hint,
  className,
}: {
  icon?: ReactNode;
  title: string;
  hint?: string;
  className?: string;
}) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--pv-border)] px-6 py-10 text-center",
      className
    )}
  >
    {icon && <span className="text-[var(--pv-faint)]">{icon}</span>}
    <p className="text-sm font-medium text-[var(--pv-muted)]">{title}</p>
    {hint && <p className="max-w-64 text-xs text-[var(--pv-faint)]">{hint}</p>}
  </div>
);
