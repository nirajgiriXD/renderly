/**
 * External dependencies.
 */
import { useId, useState } from "react";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

/**
 * Internal dependencies.
 */
import { cn } from "@/lib/utils";

/**
 * Collapsed-by-default group of secondary fields.
 *
 * Rows in the inspector have one field that is the point of the row — the
 * message text, the comment body — and four or five that qualify it. Showing
 * all of them at once turned a ten-message thread into a wall of inputs, so
 * the qualifiers live behind this and the row stays scannable.
 *
 * @param badge - Rendered beside the summary when the hidden fields carry a
 * value, so nothing meaningful can hide without a trace.
 */
export const Disclosure = ({
  label,
  badge,
  defaultOpen = false,
  children,
  className,
}: {
  label: string;
  badge?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
}) => {
  const id = useId();
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn("border-t border-border/70 pt-2.5", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((previous) => !previous)}
        className={cn(
          "group/disclosure flex w-full cursor-pointer items-center gap-1.5 rounded-md py-1 text-xs font-medium",
          "text-muted-foreground transition-colors duration-150 hover:text-foreground",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        )}
      >
        <ChevronRight
          aria-hidden
          className={cn(
            "size-3.5 shrink-0 transition-transform duration-200 ease-out-quad",
            open && "rotate-90"
          )}
        />
        {label}
        {badge}
      </button>

      {open && (
        <div id={id} className="animate-fade-in space-y-4 pt-3">
          {children}
        </div>
      )}
    </div>
  );
};

/** Small dot that marks a collapsed group as carrying a non-default value. */
export const DisclosureDot = ({ title }: { title?: string }) => (
  <span
    title={title}
    aria-hidden
    className="size-1.5 rounded-full bg-primary/70"
  />
);
