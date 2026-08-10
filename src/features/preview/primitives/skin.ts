/**
 * Internal dependencies.
 */
import type { PreviewTheme } from "@/types";

/**
 * The colour contract every preview renders against.
 *
 * Platforms differ in palette but not in structure, so each one declares two
 * palettes and the shared primitives read them through CSS custom properties.
 * That removes the `isDark ? "…" : "…"` ternary from every element and makes a
 * platform's colours reviewable in one place.
 */
export type PreviewPalette = {
  /** Page background behind the card. */
  bg: string;
  /** Raised surface: cards, bubbles, inputs. */
  surface: string;
  /** Secondary raised surface: hover states, chips, rails. */
  subtle: string;
  /** Primary text. */
  fg: string;
  /** Secondary text: timestamps, handles, counts. */
  muted: string;
  /** Tertiary text and idle icons. */
  faint: string;
  border: string;
  /** Brand colour used for links, active icons and primary buttons. */
  accent: string;
  /** Text drawn on top of `accent`. */
  accentFg: string;
};

export type PreviewSkin = Record<PreviewTheme, PreviewPalette>;

/**
 * Builds a skin from a light palette plus the dark overrides.
 *
 * @param light - Full light palette.
 * @param dark - Fields that differ in dark mode.
 */
export const createSkin = (
  light: PreviewPalette,
  dark: Partial<PreviewPalette>
): PreviewSkin => ({ light, dark: { ...light, ...dark } });

/** Neutral palette used as a starting point by most platforms. */
export const NEUTRAL_LIGHT: PreviewPalette = {
  bg: "#ffffff",
  surface: "#ffffff",
  subtle: "#f2f3f5",
  fg: "#0f1419",
  muted: "#65676b",
  faint: "#8a8d91",
  border: "#e4e6eb",
  accent: "#1d9bf0",
  accentFg: "#ffffff",
};

export const NEUTRAL_DARK: Partial<PreviewPalette> = {
  bg: "#000000",
  surface: "#000000",
  subtle: "#16181c",
  fg: "#e7e9ea",
  muted: "#8b98a5",
  faint: "#71767b",
  border: "#2f3336",
};

/** Maps a palette onto the `--pv-*` custom properties the primitives read. */
export const paletteVars = (palette: PreviewPalette) =>
  ({
    "--pv-bg": palette.bg,
    "--pv-surface": palette.surface,
    "--pv-subtle": palette.subtle,
    "--pv-fg": palette.fg,
    "--pv-muted": palette.muted,
    "--pv-faint": palette.faint,
    "--pv-border": palette.border,
    "--pv-accent": palette.accent,
    "--pv-accent-fg": palette.accentFg,
  }) as React.CSSProperties;
