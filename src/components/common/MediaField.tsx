/**
 * External dependencies.
 */
import { useCallback, useId, useRef, useState } from "react";
import { Film, ImagePlus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

/**
 * Internal dependencies.
 */
import { Field } from "./fields";
import { Button } from "@/components/ui/button";
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
          "rounded-xl border border-dashed p-3 transition-colors",
          dragging ? "border-primary bg-primary/5" : "border-input"
        )}
      >
        {value.length > 0 && (
          <ul
            className={cn(
              "mb-3 grid gap-2",
              max === 1 ? "grid-cols-1" : "grid-cols-3 @md:grid-cols-4"
            )}
          >
            {value.map((item) => (
              <li
                key={item.id}
                className="group relative overflow-hidden rounded-lg border bg-muted"
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
                      "flex w-full flex-col items-center justify-center gap-1 text-muted-foreground",
                      max === 1 ? "h-32" : "aspect-square"
                    )}
                  >
                    <Film className="size-5" aria-hidden />
                    <span className="max-w-full truncate px-2 text-[11px]">
                      {item.name}
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  aria-label={`Remove ${item.name}`}
                  onClick={() =>
                    onChange(value.filter((entry) => entry.id !== item.id))
                  }
                  className="absolute right-1 top-1 grid size-6 cursor-pointer place-items-center rounded-md bg-background/90 text-destructive opacity-0 shadow-sm transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={loading || remaining === 0}
            onClick={() => inputRef.current?.click()}
          >
            {loading ? (
              <Upload className="animate-pulse" />
            ) : (
              <ImagePlus />
            )}
            {value.length === 0 ? "Choose file" : "Add more"}
          </Button>

          {value.length > 0 && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => onChange([])}
            >
              Clear
            </Button>
          )}

          <p className="text-xs text-muted-foreground">
            Drop files here · up to {formatBytes(MAX_MEDIA_BYTES)} each
            {max > 1 && ` · ${value.length}/${max}`}
          </p>
        </div>

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
