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

/** Whether the browser can put an image on the clipboard. */
export const canCopyImages = () =>
  typeof window !== "undefined" &&
  typeof window.ClipboardItem !== "undefined" &&
  typeof navigator.clipboard?.write === "function";

/**
 * Exports the rendered preview as a PNG, or the underlying config as JSON.
 *
 * The PNG path rasterises the live DOM node, so what is exported is exactly
 * what is on screen — including the device frame when it is enabled.
 */
export const useExport = () => {
  const [isExporting, setExporting] = useState(false);

  const rasterise = useCallback(async (node: HTMLElement | null) => {
    if (!node) throw new Error("There is nothing to export yet.");

    // Loaded on demand: the rasteriser is a sizeable dependency that most
    // sessions never touch.
    const { toBlob } = await import("html-to-image");

    const blob = await toBlob(node, {
      pixelRatio: Math.min(window.devicePixelRatio || 1, 3) * 2,
      cacheBust: true,
      // Previews render in the host's own fonts (see `--font-platform`), so
      // there is no web font to inline and walking every stylesheet to look
      // for one is pure cost.
      skipFonts: true,
      // The captured node is transparent; paint the surface behind it so
      // the PNG does not come out with a see-through background.
      backgroundColor: getComputedStyle(node).backgroundColor,
      filter: (element) =>
        !(element instanceof HTMLElement) ||
        element.dataset.exportIgnore === undefined,
    });

    if (!blob) throw new Error("The preview could not be rasterised.");
    return blob;
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
