/**
 * External dependencies.
 */
import { useCallback } from "react";
import { toast } from "sonner";

/**
 * Internal dependencies.
 */
import { canCopyImages, useExport } from "./use-export";
import { CATEGORY_MAP } from "@/constants";
import { useConfig, useWorkspace } from "@/store";

export type StageExport = {
  isExporting: boolean;
  /** False where the browser has no clipboard image support. */
  canCopyImage: boolean;
  downloadPng: () => void;
  copyImage: () => void;
  downloadJson: () => void;
};

/**
 * The three export actions, bound to the live stage and to the active
 * category's filename.
 *
 * Kept in one hook because the toolbar and the command palette offer exactly
 * the same three actions, and because it puts every read of the stage ref
 * inside a callback — the shell can hand the resulting functions around
 * without passing a DOM ref through the component tree.
 */
export const useStageExport = (
  target: React.RefObject<HTMLElement | null>,
  /** Runs first, so a canvas that is off screen can be brought forward. */
  beforeExport?: () => Promise<void>
): StageExport => {
  const { category } = useWorkspace();
  const config = useConfig();
  const { isExporting, exportPng, copyPng, exportJson } = useExport();

  const filename = `post-preview-${CATEGORY_MAP[category].label}`;

  const run = useCallback(
    async (action: () => Promise<void>, success: string) => {
      try {
        await beforeExport?.();
        await action();
        toast.success(success);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "The export failed."
        );
      }
    },
    [beforeExport]
  );

  const downloadPng = useCallback(
    () =>
      void run(
        () => exportPng(target.current, filename),
        "Saved the preview as a PNG."
      ),
    [exportPng, filename, run, target]
  );

  const copyImage = useCallback(
    () =>
      void run(
        () => copyPng(target.current),
        "Copied the preview to the clipboard."
      ),
    [copyPng, run, target]
  );

  const downloadJson = useCallback(() => {
    exportJson(config[category], filename);
    toast.success("Saved the configuration as JSON.");
  }, [category, config, exportJson, filename]);

  return {
    isExporting,
    canCopyImage: canCopyImages(),
    downloadPng,
    copyImage,
    downloadJson,
  };
};
