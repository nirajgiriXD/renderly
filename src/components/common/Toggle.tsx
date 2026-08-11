/**
 * External dependencies.
 */
import type { LucideIcon } from "lucide-react";

/**
 * Internal dependencies.
 */
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/**
 * Icon-only on/off button used inside dense list rows, where a full switch
 * with its own label would not fit.
 *
 * The pressed state fills the glyph as well as tinting the button — colour
 * alone is not a state anyone should have to read.
 */
export const Toggle = ({
  pressed,
  onPressedChange,
  label,
  icon: Icon,
  className,
}: {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  label: string;
  icon: LucideIcon;
  className?: string;
}) => (
  <Hint label={label}>
    <Button
      type="button"
      size="icon-sm"
      variant={pressed ? "soft" : "ghost"}
      aria-pressed={pressed}
      aria-label={label}
      onClick={() => onPressedChange(!pressed)}
      className={className}
    >
      <Icon className={cn(pressed && "fill-current")} />
    </Button>
  </Hint>
);
