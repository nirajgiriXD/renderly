/**
 * External dependencies.
 */
import { useRef, useState } from "react";
import { Loader2, Trash2, Upload, User } from "lucide-react";
import { toast } from "sonner";

/**
 * Internal dependencies.
 */
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { MediaError, fileToMediaItem } from "@/lib/media";
import { getInitials } from "@/lib/format";

/**
 * Compact avatar picker.
 *
 * Avatars are a single image and are shown at small sizes everywhere, so they
 * get their own control rather than reusing the multi-file media field. The
 * thumbnail is itself the upload target — the buttons beside it are the
 * discoverable path to the same thing.
 */
export const AvatarField = ({
  value,
  name,
  onChange,
  className,
  size = "size-12",
}: {
  value: string | null;
  name?: string;
  onChange: (src: string | null) => void;
  className?: string;
  size?: string;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const initials = getInitials(name ?? "");

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setLoading(true);
    try {
      const item = await fileToMediaItem(file);
      onChange(item.src);
    } catch (error) {
      toast.error(
        error instanceof MediaError
          ? error.message
          : "That image could not be read."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void pick(event.dataTransfer.files?.[0]);
        }}
        aria-label={value ? "Replace profile picture" : "Add a profile picture"}
        className={cn(
          "group relative grid shrink-0 cursor-pointer place-items-center overflow-hidden rounded-full",
          "border border-border bg-muted text-muted-foreground shadow-xs",
          "transition-[border-color,box-shadow] duration-150",
          "hover:border-brand-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          dragging && "border-primary ring-[3px] ring-ring/22",
          size
        )}
      >
        {value ? (
          <img src={value} alt="" className="size-full object-cover" />
        ) : initials ? (
          <span className="text-sm font-semibold">{initials}</span>
        ) : (
          <User className="size-1/2" strokeWidth={1.5} aria-hidden />
        )}

        {loading && (
          <span className="absolute inset-0 grid place-items-center bg-surface/75">
            <Loader2 className="size-4 animate-spin text-primary" aria-hidden />
          </span>
        )}
      </button>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={loading}
          onClick={() => inputRef.current?.click()}
        >
          <Upload />
          {value ? "Replace" : "Upload"}
        </Button>
        {value && (
          <Hint label="Remove profile picture">
            <Button
              type="button"
              size="icon-sm"
              variant="destructive-ghost"
              aria-label="Remove profile picture"
              onClick={() => onChange(null)}
            >
              <Trash2 />
            </Button>
          </Hint>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => {
          void pick(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
    </div>
  );
};
