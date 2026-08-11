/**
 * External dependencies.
 */
import type { LucideIcon } from "lucide-react";

/**
 * Internal dependencies.
 */
import { Hint } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
  icon?: LucideIcon;
  /** Overrides the tooltip, which otherwise repeats the label. */
  hint?: string;
  disabled?: boolean;
};

type SegmentedProps<T extends string> = {
  value: T;
  options: readonly SegmentedOption<T>[];
  onChange: (value: T) => void;
  /** Announced to screen readers as the group's purpose. */
  label: string;
  /** Hides the text labels and shows tooltips instead. */
  iconOnly?: boolean;
  size?: "sm" | "default";
  className?: string;
};

/**
 * Segmented control with a sliding indicator.
 *
 * The studio switches between a handful of mutually exclusive modes — content
 * type, device, preview theme, edit vs. preview — and every one of them used
 * to be its own hand-rolled row of buttons. One component means the animation,
 * the roving keyboard focus and the `radiogroup` semantics are correct
 * everywhere instead of in whichever copy was written most recently.
 *
 * Columns are equal width so the indicator can be translated by index rather
 * than measured, which keeps the movement exact at any zoom level.
 */
export const Segmented = <T extends string>({
  value,
  options,
  onChange,
  label,
  iconOnly = false,
  size = "default",
  className,
}: SegmentedProps<T>) => {
  const activeIndex = Math.max(
    options.findIndex((option) => option.value === value),
    0
  );

  const move = (direction: 1 | -1) => {
    const enabled = options.filter((option) => !option.disabled);
    if (enabled.length === 0) return;
    const current = enabled.findIndex((option) => option.value === value);
    const next = (current + direction + enabled.length) % enabled.length;
    onChange(enabled[next].value);
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          event.preventDefault();
          move(1);
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          event.preventDefault();
          move(-1);
        }
      }}
      className={cn(
        "relative isolate grid rounded-lg border border-border/70 bg-sunken p-1",
        className
      )}
      style={{
        gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
      }}
    >
      {/* The indicator sits behind the buttons and slides between columns. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-1 left-1 -z-10 rounded-md border border-border/60 bg-surface shadow-xs transition-transform duration-200 ease-out-expo"
        style={{
          width: `calc((100% - 0.5rem) / ${options.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />

      {options.map((option) => {
        const active = option.value === value;

        return (
          <Hint
            key={option.value}
            label={iconOnly ? (option.hint ?? option.label) : (option.hint ?? "")}
          >
            <button
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={iconOnly ? option.label : undefined}
              disabled={option.disabled}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(option.value)}
              className={cn(
                "flex cursor-pointer items-center justify-center gap-1.5 rounded-md font-medium",
                "transition-colors duration-150 ease-out-quad",
                "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
                "disabled:pointer-events-none disabled:opacity-40",
                size === "sm"
                  ? "h-6 px-2 text-xs"
                  : "h-7 px-2.5 text-[0.8125rem]",
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {option.icon && (
                <option.icon
                  className={cn(size === "sm" ? "size-3.5" : "size-4")}
                  aria-hidden
                />
              )}
              {!iconOnly && <span className="truncate">{option.label}</span>}
            </button>
          </Hint>
        );
      })}
    </div>
  );
};
