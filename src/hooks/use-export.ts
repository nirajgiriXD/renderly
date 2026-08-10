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
 * Exports the rendered preview as a PNG, or the underlying config as JSON.
 *
 * The PNG path rasterises the live DOM node, so what is exported is exactly
 * what is on screen — including the device frame when it is enabled.
 */
export const useExport = () => {
  const [isExporting, setExporting] = useState(false);

  const exportPng = useCallback(
    async (node: HTMLElement | null, name: string) => {
      if (!node) throw new Error("There is nothing to export yet.");

      setExporting(true);
      try {
        // Loaded on demand: the rasteriser is a sizeable dependency that most
        // sessions never touch.
        const { toBlob } = await import("html-to-image");

        const blob = await toBlob(node, {
          pixelRatio: Math.min(window.devicePixelRatio || 1, 3) * 2,
          cacheBust: true,
          // The captured node is transparent; paint the surface behind it so
          // the PNG does not come out with a see-through background.
          backgroundColor: getComputedStyle(node).backgroundColor,
          filter: (element) =>
            !(element instanceof HTMLElement) ||
            element.dataset.exportIgnore === undefined,
        });

        if (!blob) throw new Error("The preview could not be rasterised.");
        saveBlob(blob, `${slugify(name)}.png`);
      } finally {
        setExporting(false);
      }
    },
    []
  );

  const exportJson = useCallback((data: unknown, name: string) => {
    const blob = new Blob([JSON.stringify(stripDataUrls(data), null, 2)], {
      type: "application/json",
    });
    saveBlob(blob, `${slugify(name)}.json`);
  }, []);

  return { isExporting, exportPng, exportJson };
};
