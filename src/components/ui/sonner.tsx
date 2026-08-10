import { Toaster as Sonner } from "sonner";
import type { ComponentProps } from "react";

import { useSettings } from "@/store";

/**
 * Toast host. Follows the editor's resolved colour scheme rather than the
 * previewed platform's theme.
 */
const Toaster = ({ ...props }: ComponentProps<typeof Sonner>) => {
  const { resolvedScheme } = useSettings();

  return (
    <Sonner
      theme={resolvedScheme}
      className="toaster group"
      position="bottom-right"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
