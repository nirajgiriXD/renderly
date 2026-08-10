/**
 * External dependencies.
 */
import type { CSSProperties, ReactNode } from "react";

/**
 * Internal dependencies.
 */
import { paletteVars } from "./skin";
import type { PreviewSkin } from "./skin";
import { cn } from "@/lib/utils";
import type { PreviewTheme } from "@/types";

type PreviewSurfaceProps = {
  skin: PreviewSkin;
  theme: PreviewTheme;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/**
 * Root of every platform preview.
 *
 * Publishes the platform palette as CSS custom properties and pins
 * `color-scheme` so scrollbars, selection and native controls inside the
 * preview follow the *previewed* theme rather than the editor's.
 */
export const PreviewSurface = ({
  skin,
  theme,
  className,
  style,
  children,
}: PreviewSurfaceProps) => (
  <div
    data-preview-theme={theme}
    className={cn(
      "text-[var(--pv-fg)] [font-synthesis:none] antialiased",
      className
    )}
    style={{
      ...paletteVars(skin[theme]),
      colorScheme: theme,
      ...style,
    }}
  >
    {children}
  </div>
);

/**
 * Card container shared by feed-style previews (posts, comment threads).
 *
 * @param bleed - Removes the border and radius, for previews that fill a
 * device frame edge to edge.
 */
export const PreviewCard = ({
  className,
  bleed = false,
  children,
}: {
  className?: string;
  bleed?: boolean;
  children: ReactNode;
}) => (
  <div
    className={cn(
      "w-full bg-[var(--pv-bg)] overflow-hidden",
      !bleed && "rounded-2xl border border-[var(--pv-border)] shadow-sm",
      className
    )}
  >
    {children}
  </div>
);
