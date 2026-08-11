/**
 * External dependencies.
 */
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Braces,
  ChevronDown,
  ClipboardCopy,
  Download,
  ImageDown,
  Loader2,
} from "lucide-react";

/**
 * Internal dependencies.
 */
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { StageExport } from "@/hooks";

/** One row of the export menu. */
const ExportOption = ({
  icon: Icon,
  title,
  description,
  onSelect,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  onSelect: () => void;
}) => (
  <button
    type="button"
    onClick={onSelect}
    className={cn(
      "flex w-full cursor-pointer items-start gap-3 rounded-lg p-2.5 text-left",
      "transition-colors duration-150 hover:bg-accent",
      "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
    )}
  >
    <span className="mt-px grid size-8 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand-text">
      <Icon className="size-4" aria-hidden />
    </span>
    <span className="min-w-0">
      <span className="block text-[0.8125rem] font-medium leading-5">
        {title}
      </span>
      <span className="block text-xs leading-relaxed text-muted-foreground">
        {description}
      </span>
    </span>
  </button>
);

/**
 * Download the rendered preview as a PNG, copy it, or save the config as JSON.
 *
 * The PNG is rasterised from the live DOM node, so it captures exactly what is
 * on screen — device frame included.
 */
export const ExportMenu = ({ actions }: { actions: StageExport }) => {
  const [open, setOpen] = useState(false);

  const select = (action: () => void) => {
    setOpen(false);
    action();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="sm" disabled={actions.isExporting} className="gap-1.5">
          {actions.isExporting ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Download className="size-3.5" />
          )}
          <span className="hidden sm:inline">
            {actions.isExporting ? "Exporting…" : "Export"}
          </span>
          <ChevronDown
            aria-hidden
            className={cn(
              "size-3 opacity-70 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-72">
        <p className="px-2.5 pb-1 pt-1.5 text-[0.6875rem] font-semibold uppercase tracking-widest text-faint">
          Export
        </p>

        <ExportOption
          icon={ImageDown}
          title="Download PNG"
          description="Everything currently on the stage, at 2× resolution."
          onSelect={() => select(actions.downloadPng)}
        />

        {actions.canCopyImage && (
          <ExportOption
            icon={ClipboardCopy}
            title="Copy image"
            description="Paste straight into a doc, deck or chat."
            onSelect={() => select(actions.copyImage)}
          />
        )}

        <ExportOption
          icon={Braces}
          title="Download JSON"
          description="The content of this workspace, re-importable from Settings."
          onSelect={() => select(actions.downloadJson)}
        />

        <p className="border-t border-border px-2.5 pb-1 pt-2 text-xs leading-relaxed text-muted-foreground">
          Uploaded media is embedded in the PNG but stripped from the JSON.
        </p>
      </PopoverContent>
    </Popover>
  );
};
