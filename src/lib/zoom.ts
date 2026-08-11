/**
 * Canvas zoom.
 *
 * The canvas scales with the CSS `zoom` property rather than a transform.
 * `zoom` is a layout-level scale: the browser re-lays out and re-rasterises
 * the subtree, so text stays sharp at every level, the scroll container sees
 * the scaled size without a spacer propping it open, and `clientWidth` on the
 * stage still reports unzoomed layout pixels — which is exactly what the PNG
 * rasteriser measures, so an export is 1:1 whatever the canvas is showing.
 *
 * A transform does none of those things: it paints a snapshot at the old
 * raster scale, which is what made zoomed previews look blurry.
 */

export const MIN_ZOOM = 0.25;
export const MAX_ZOOM = 2;

/** The stops the +/− buttons and the keyboard shortcuts walk through. */
export const ZOOM_STEPS = [0.25, 0.5, 0.65, 0.8, 1, 1.25, 1.5, 2] as const;

export const clampZoom = (value: number) =>
  Math.min(Math.max(value, MIN_ZOOM), MAX_ZOOM);

/**
 * The next stop above or below `current`.
 *
 * Works from an arbitrary value, not just from a stop, because the wheel
 * zooms continuously and the buttons have to pick up wherever it left off.
 */
export const stepZoom = (current: number, direction: 1 | -1) => {
  const epsilon = 0.001;

  if (direction === 1) {
    return ZOOM_STEPS.find((step) => step > current + epsilon) ?? MAX_ZOOM;
  }

  return (
    [...ZOOM_STEPS].reverse().find((step) => step < current - epsilon) ??
    MIN_ZOOM
  );
};

/**
 * Continuous zoom for a wheel or trackpad gesture.
 *
 * Exponential rather than linear so a notch feels the same size at 30% as it
 * does at 150%.
 */
export const zoomByWheel = (current: number, deltaY: number) =>
  clampZoom(
    Math.round(current * Math.exp(-deltaY * 0.0015) * 100) / 100
  );

/**
 * Whether the browser can scale the canvas at all.
 *
 * `zoom` is universal in Blink and WebKit and reached Firefox in 126. Rather
 * than fall back to a transform — which is the blurry thing this exists to
 * avoid — the zoom controls are simply not offered where it is missing.
 */
export const supportsCanvasZoom = () =>
  typeof CSS !== "undefined" && CSS.supports("zoom", "1.5");
