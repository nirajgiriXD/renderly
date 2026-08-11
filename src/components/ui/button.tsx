import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * The studio's button.
 *
 * Variants are named for the *role* a button plays rather than its colour, so
 * the visual language can change in one place: `default` is the single action
 * that matters in a given area, `soft` marks a brand-tinted secondary,
 * `outline` a neutral secondary, `ghost` a low-noise contextual action.
 */
const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap",
    "font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out-quad",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "disabled:pointer-events-none disabled:opacity-45",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    // A press should feel physical without moving neighbouring layout.
    "active:scale-[0.985] motion-reduce:active:scale-100",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary-hover",
        soft: "bg-brand-soft text-brand-text hover:bg-brand-soft/70",
        outline:
          "border border-border bg-surface text-foreground shadow-xs hover:border-border-strong hover:bg-accent",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/70",
        ghost: "text-muted-foreground hover:bg-accent hover:text-foreground",
        destructive:
          "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90",
        "destructive-ghost":
          "text-muted-foreground hover:bg-destructive-soft hover:text-destructive",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-7 gap-1.5 rounded-md px-2 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 gap-1.5 rounded-md px-2.5 text-[0.8125rem] has-[>svg]:px-2",
        default: "h-9 rounded-lg px-3.5 text-sm has-[>svg]:px-3",
        lg: "h-10 rounded-lg px-5 text-sm",
        icon: "size-9 rounded-lg",
        "icon-sm": "size-8 rounded-md [&_svg:not([class*='size-'])]:size-4",
        "icon-xs": "size-7 rounded-md [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
