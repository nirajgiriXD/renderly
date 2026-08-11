/**
 * External dependencies.
 */
import { useCallback, useId, useRef, useState } from "react";
import { Film, ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

/**
 * Internal dependencies.
 */
import { Field } from "./fields";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { MAX_MEDIA_BYTES, filesToMediaItems, formatBytes } from "@/lib/media";
import type { MediaItem } from "@/types";

type MediaFieldProps = {
  label: React.ReactNode;
  hint?: React.ReactNode;
  value: MediaItem[];
  onChange: (items: MediaItem[]) => void;
  /** `1` renders a single-slot control; higher values allow an album. */
  max?: number;
  accept?: string;
  className?: string;
};

/**
 * Upload control for images and video.
 *
 * Handles the drop target, decoding, per-file errors and thumbnail management
 * in one place, so the four categories that accept media do not each grow
 * their own file-input logic.
 */
export const MediaField = ({
  label,
  hint,
  value,
  onChange,
  max = 10,
  accept = "image/*,video/*",
  className,
}: MediaFieldProps) => {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const remaining = Math.max(max - value.length, 0);
  const isEmpty = value.length === 0;

  const ingest = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      if (list.length === 0) return;

      if (remaining === 0) {
        toast.error(
          max === 1
            ? "Remove the current file before adding another."
            : `You can attach up to ${max} files.`
        );
        return;
      }

      setLoading(true);
      try {
        const { items, errors } = await filesToMediaItems(
          list.slice(0, remaining)
        );

        for (const message of errors) toast.error(message);

        if (items.length > 0) {
          onChange(max === 1 ? items.slice(0, 1) : [...value, ...items]);
        }

        if (list.length > remaining) {
          toast.warning(
            `Only the first ${remaining} file${remaining === 1 ? "" : "s"} were added.`
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [max, onChange, remaining, value]
  );

  return (
    <Field label={label} hint={hint} className={className}>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void ingest(event.dataTransfer.files);
        }}
        className={cn(
          "rounded-xl border border-dashed transition-[background-color,border-color] duration-150",
          dragging
            ? "border-primary bg-brand-soft/60"
            : "border-border-strong/70 bg-sunken/40"
        )}
      >
        {isEmpty ? (
          /* Nothing uploaded: the whole box is the affordance. */
          <button
            type="button"
            disabled={loading}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex w-full cursor-pointer flex-col items-center gap-2 rounded-xl px-4 py-6 text-center",
              "transition-colors duration-150 hover:bg-accent/50",
              "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
              "disabled:pointer-events-none disabled:opacity-60"
            )}
          >
            <span className="grid size-9 place-items-center rounded-lg bg-brand-soft text-brand-text">
              {loading ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <UploadCloud className="size-4" aria-hidden />
              )}
            </span>
            <span className="text-[0.8125rem] font-medium">
              {loading ? "Reading files…" : "Drop files here, or click to browse"}
            </span>
            <span className="text-xs text-muted-foreground">
              Images and video · up to {formatBytes(MAX_MEDIA_BYTES)} each
              {max > 1 && ` · ${max} max`}
            </span>
          </button>
        ) : (
          <div className="space-y-3 p-3">
            <ul
              className={cn(
                "grid gap-2",
                max === 1 ? "grid-cols-1" : "grid-cols-3 @md:grid-cols-4"
              )}
            >
              {value.map((item) => (
                <li
                  key={item.id}
                  className="group/media relative overflow-hidden rounded-lg border border-border bg-surface shadow-xs"
                >
                  {item.kind === "image" ? (
                    <img
                      src={item.src}
                      alt={item.name}
                      className={cn(
                        "w-full object-cover",
                        max === 1 ? "max-h-44" : "aspect-square"
                      )}
                    />
                  ) : (
                    <div
                      className={cn(
                        "flex w-full flex-col items-center justify-center gap-1.5 bg-muted text-muted-foreground",
                        max === 1 ? "h-32" : "aspect-square"
                      )}
                    >
                      <Film className="size-5" aria-hidden />
                      <span className="max-w-full truncate px-2 text-[11px]">
                        {item.name}
                      </span>
                    </div>
                  )}

                  <Hint label={`Remove ${item.name}`}>
                    <button
                      type="button"
                      aria-label={`Remove ${item.name}`}
                      onClick={() =>
                        onChange(value.filter((entry) => entry.id !== item.id))
                      }
                      className={cn(
                        "absolute right-1.5 top-1.5 grid size-6 cursor-pointer place-items-center rounded-md",
                        "bg-surface/95 text-destructive shadow-sm backdrop-blur-sm",
                        "opacity-0 transition-opacity duration-150",
                        "group-hover/media:opacity-100 focus-visible:opacity-100",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      )}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </Hint>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={loading || remaining === 0}
                onClick={() => inputRef.current?.click()}
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <ImagePlus />
                )}
                {max === 1 ? "Replace" : "Add more"}
              </Button>

              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => onChange([])}
              >
                Clear
              </Button>

              {max > 1 && (
                <p
                  data-numeric
                  className="ml-auto text-xs text-muted-foreground"
                >
                  {value.length} of {max}
                </p>
              )}
            </div>
          </div>
        )}

        <input
          id={id}
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={max > 1}
          className="sr-only"
          onChange={(event) => {
            if (event.target.files) void ingest(event.target.files);
            // Reset so re-selecting the same file fires `change` again.
            event.target.value = "";
          }}
        />
      </div>
    </Field>
  );
};
