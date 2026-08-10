/**
 * External dependencies.
 */
import type { LucideIcon } from "lucide-react";

/**
 * Internal dependencies.
 */
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Icon-only on/off button used inside dense list rows, where a full switch
 * with its own label would not fit.
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
  <Button
    type="button"
    size="icon"
    variant={pressed ? "secondary" : "ghost"}
    aria-pressed={pressed}
    aria-label={label}
    title={label}
    onClick={() => onPressedChange(!pressed)}
    className={cn(pressed && "text-foreground", className)}
  >
    <Icon className={cn(pressed && "fill-current")} />
  </Button>
);
