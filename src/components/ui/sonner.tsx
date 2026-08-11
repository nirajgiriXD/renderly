import { Toaster as Sonner } from "sonner";
import type { ComponentProps } from "react";

import { useSettings } from "@/store";

/**
 * Toast host. Follows the studio's resolved colour scheme rather than the
 * previewed platform's theme.
 */
const Toaster = ({ ...props }: ComponentProps<typeof Sonner>) => {
  const { resolvedScheme } = useSettings();

  return (
    <Sonner
      theme={resolvedScheme}
      className="toaster group"
      position="bottom-center"
      offset={20}
      gap={10}
      toastOptions={{
        classNames: {
          toast:
            "!rounded-xl !border-border !bg-elevated !text-foreground !shadow-lg !font-sans !text-[0.8125rem] !gap-2.5",
          description: "!text-muted-foreground",
          icon: "!size-4",
          success: "[&_[data-icon]]:!text-success",
          error: "[&_[data-icon]]:!text-destructive",
          warning: "[&_[data-icon]]:!text-warning",
        },
      }}
      style={
        {
          "--normal-bg": "var(--elevated)",
          "--normal-text": "var(--foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
