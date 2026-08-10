/**
 * Internal dependencies.
 */
import { cn } from "@/lib/utils";

/*
 * Assistant marks, inlined rather than loaded from `src/icons`.
 *
 * The shipped SVG assets are hard-coded black, which disappears against a dark
 * transcript. Inlining them lets the mark inherit `currentColor` and follow
 * the previewed theme.
 */

type GlyphProps = { className?: string };

export const OpenAiGlyph = ({ className }: GlyphProps) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden
    className={cn("size-4 fill-current", className)}
  >
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91a6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9a6.046 6.046 0 0 0 .743 7.097a5.98 5.98 0 0 0 .51 4.911a6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206a5.99 5.99 0 0 0 3.997-2.9a6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081l4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085l4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355l-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085l-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5l2.607 1.5v2.999l-2.597 1.5l-2.607-1.5Z" />
  </svg>
);

export const AnthropicGlyph = ({ className }: GlyphProps) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden
    className={cn("size-4 fill-current", className)}
  >
    <path d="M17.304 3.541h-3.672l6.696 16.918H24Zm-10.608 0L0 20.459h3.744l1.37-3.553h7.005l1.369 3.553h3.744L10.536 3.541Zm-.371 10.223L8.616 7.82l2.291 5.945Z" />
  </svg>
);

export const GeminiGlyph = ({ className }: GlyphProps) => (
  <svg viewBox="0 0 16 16" aria-hidden className={cn("size-4", className)}>
    <defs>
      <linearGradient id="gemini-spark" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#4285f4" />
        <stop offset="45%" stopColor="#9b72cb" />
        <stop offset="100%" stopColor="#d96570" />
      </linearGradient>
    </defs>
    <path
      fill="url(#gemini-spark)"
      d="M15 8.014A7.457 7.457 0 0 0 8.014 15h-.028A7.456 7.456 0 0 0 1 8.014v-.028A7.456 7.456 0 0 0 7.986 1h.028A7.457 7.457 0 0 0 15 7.986z"
    />
  </svg>
);

export const GrokGlyph = ({ className }: GlyphProps) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden
    className={cn("size-4 fill-current", className)}
  >
    <path d="M7 9H3l9 13h4zm-.85 8.502L3 22h4l1.138-1.625zm6.75-3.932L21 2h-4l-6.088 8.698zm5.1-3.36V22h3V5.924z" />
  </svg>
);
