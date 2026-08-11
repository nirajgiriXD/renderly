/**
 * External dependencies.
 */
import { useCallback, useState } from "react";

/**
 * Internal dependencies.
 */
import { stripDataUrls } from "@/lib/storage";

const saveBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  // Revoking synchronously can cancel the download in Safari.
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "preview";

/**
 * The box an image export should cover, in the node's own layout pixels:
 * the union of the device frames it holds, or the whole node when it holds
 * none (a preview that failed to render leaves no frame behind).
 *
 * Cropping to the frames is what keeps the canvas — its dot grid and the
 * gutter it holds the previews in — out of the exported image.
 */
const cropToFrames = (node: HTMLElement) => {
  const frames = node.querySelectorAll<HTMLElement>("[data-export-frame]");

  if (frames.length === 0) {
    return { x: 0, y: 0, width: node.offsetWidth, height: node.offsetHeight };
  }

  /*
   * Client rects are measured through the canvas's CSS `zoom`, but layout
   * boxes are not — so the zoom is recovered from the node's own two
   * measurements and divided back out. That keeps the crop 1:1 with the
   * layout whatever the canvas is currently showing.
   */
  const stage = node.getBoundingClientRect();
  const scale =
    stage.width > 0 && node.offsetWidth > 0
      ? stage.width / node.offsetWidth
      : 1;

  let left = Infinity;
  let top = Infinity;
  let right = -Infinity;
  let bottom = -Infinity;

  frames.forEach((frame) => {
    const rect = frame.getBoundingClientRect();
    left = Math.min(left, rect.left);
    top = Math.min(top, rect.top);
    right = Math.max(right, rect.right);
    bottom = Math.max(bottom, rect.bottom);
  });

  // Rounded outwards: a fractional edge would otherwise shave a hairline off
  // the device, and the pixel it gains instead is transparent.
  const x = Math.floor((left - stage.left) / scale);
  const y = Math.floor((top - stage.top) / scale);

  return {
    x,
    y,
    width: Math.ceil((right - stage.left) / scale) - x,
    height: Math.ceil((bottom - stage.top) / scale) - y,
  };
};

/** Whether the browser can put an image on the clipboard. */
export const canCopyImages = () =>
  typeof window !== "undefined" &&
  typeof window.ClipboardItem !== "undefined" &&
  typeof navigator.clipboard?.write === "function";

/**
 * Exports the rendered preview as a PNG, or the underlying config as JSON.
 *
 * The PNG path rasterises the live DOM node, so what is exported is exactly
 * what is on screen — but cropped to the device frames, so the canvas the
 * previews sit on is not part of the image and the corners the frame rounds
 * off come out transparent.
 */
export const useExport = () => {
  const [isExporting, setExporting] = useState(false);

  const rasterise = useCallback(async (node: HTMLElement | null) => {
    if (!node) throw new Error("There is nothing to export yet.");

    // Loaded on demand: the rasteriser is a sizeable dependency that most
    // sessions never touch.
    const { toBlob } = await import("html-to-image");

    const crop = cropToFrames(node);
    // Read by the stylesheet, which drops the frame shadows for the duration
    // of the capture — a crop that stops at the device edge would otherwise
    // slice them open and leave a dark smudge in every corner.
    node.dataset.exportCapture = "";

    try {
      const blob = await toBlob(node, {
        pixelRatio: Math.min(window.devicePixelRatio || 1, 3) * 2,
        cacheBust: true,
        // Previews render in the host's own fonts (see `--font-platform`), so
        // there is no web font to inline and walking every stylesheet to look
        // for one is pure cost.
        skipFonts: true,
        // Sizes the image to the crop. `width`/`height` also resize the clone
        // itself, so the node's own box is restored below before the shift
        // that brings the crop to the image's top-left corner.
        width: crop.width,
        height: crop.height,
        style: {
          width: `${node.offsetWidth}px`,
          height: `${node.offsetHeight}px`,
          // Whatever shows through the frame's rounded corners, or between
          // two of them, is canvas — and the canvas is what the crop is
          // there to leave out.
          background: "transparent",
          transform: `translate(${-crop.x}px, ${-crop.y}px)`,
          transformOrigin: "top left",
        },
        filter: (element) =>
          !(element instanceof HTMLElement) ||
          element.dataset.exportIgnore === undefined,
      });

      if (!blob) throw new Error("The preview could not be rasterised.");
      return blob;
    } finally {
      delete node.dataset.exportCapture;
    }
  }, []);

  const exportPng = useCallback(
    async (node: HTMLElement | null, name: string) => {
      setExporting(true);
      try {
        saveBlob(await rasterise(node), `${slugify(name)}.png`);
      } finally {
        setExporting(false);
      }
    },
    [rasterise]
  );

  /**
   * Puts the rendered preview on the clipboard.
   *
   * Safari only honours a clipboard write inside the gesture that triggered
   * it, so the promise — not the resolved blob — is handed to `ClipboardItem`
   * and the rasterising happens inside it.
   */
  const copyPng = useCallback(
    async (node: HTMLElement | null) => {
      if (!canCopyImages()) {
        throw new Error("This browser cannot copy images to the clipboard.");
      }

      setExporting(true);
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": rasterise(node) }),
        ]);
      } finally {
        setExporting(false);
      }
    },
    [rasterise]
  );

  const exportJson = useCallback((data: unknown, name: string) => {
    const blob = new Blob([JSON.stringify(stripDataUrls(data), null, 2)], {
      type: "application/json",
    });
    saveBlob(blob, `${slugify(name)}.json`);
  }, []);

  return { isExporting, exportPng, copyPng, exportJson };
};
