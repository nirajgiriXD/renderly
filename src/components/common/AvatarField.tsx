/**
 * External dependencies.
 */
import { useRef, useState } from "react";
import { Trash2, Upload, User } from "lucide-react";
import { toast } from "sonner";

/**
 * Internal dependencies.
 */
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MediaError, fileToMediaItem } from "@/lib/media";
import { getInitials } from "@/lib/format";

/**
 * Compact avatar picker.
 *
 * Avatars are a single image and are shown at small sizes everywhere, so they
 * get their own control rather than reusing the multi-file media field.
 */
export const AvatarField = ({
  value,
  name,
  onChange,
  className,
  size = "size-11",
}: {
  value: string | null;
  name?: string;
  onChange: (src: string | null) => void;
  className?: string;
  size?: string;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
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
        aria-label={value ? "Replace profile picture" : "Add a profile picture"}
        className={cn(
          "grid shrink-0 cursor-pointer place-items-center overflow-hidden rounded-full border bg-muted text-muted-foreground transition-colors hover:border-primary",
          size
        )}
      >
        {value ? (
          <img src={value} alt="" className="size-full object-cover" />
        ) : initials ? (
          <span className="text-xs font-semibold">{initials}</span>
        ) : (
          <User className="size-1/2" strokeWidth={1.5} aria-hidden />
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
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="Remove profile picture"
            onClick={() => onChange(null)}
          >
            <Trash2 className="text-destructive" />
          </Button>
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
