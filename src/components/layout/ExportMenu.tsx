/**
 * External dependencies.
 */
import { useState } from "react";
import { Braces, Download, Image, Loader2 } from "lucide-react";
import { toast } from "sonner";

/**
 * Internal dependencies.
 */
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CATEGORY_MAP } from "@/constants";
import { useExport } from "@/hooks";
import { useConfig, useWorkspace } from "@/store";

/**
 * Download the rendered preview as a PNG, or the config as JSON.
 *
 * The PNG is rasterised from the live DOM node, so it captures exactly what is
 * on screen — device frame included.
 */
export const ExportMenu = ({
  targetRef,
}: {
  targetRef: React.RefObject<HTMLElement | null>;
}) => {
  const [open, setOpen] = useState(false);
  const { category } = useWorkspace();
  const config = useConfig();
  const { isExporting, exportPng, exportJson } = useExport();

  const name = `post-preview-${CATEGORY_MAP[category].label}`;

  const handlePng = async () => {
    setOpen(false);
    try {
      await exportPng(targetRef.current, name);
      toast.success("Saved the preview as a PNG.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "The export failed."
      );
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline" disabled={isExporting}>
          {isExporting ? <Loader2 className="animate-spin" /> : <Download />}
          <span className="hidden lg:inline">Export</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-56 p-1">
        <button
          type="button"
          onClick={handlePng}
          className="flex w-full cursor-pointer items-start gap-2.5 rounded-md p-2 text-left transition-colors hover:bg-accent"
        >
          <Image className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>
            <span className="block text-sm font-medium">Preview as PNG</span>
            <span className="block text-xs text-muted-foreground">
              Everything currently on the stage
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setOpen(false);
            exportJson(config[category], name);
            toast.success("Saved the configuration as JSON.");
          }}
          className="flex w-full cursor-pointer items-start gap-2.5 rounded-md p-2 text-left transition-colors hover:bg-accent"
        >
          <Braces className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>
            <span className="block text-sm font-medium">Content as JSON</span>
            <span className="block text-xs text-muted-foreground">
              Re-importable from Settings
            </span>
          </span>
        </button>
      </PopoverContent>
    </Popover>
  );
};
