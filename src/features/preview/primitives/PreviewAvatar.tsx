/**
 * External dependencies.
 */
import { User } from "lucide-react";

/**
 * Internal dependencies.
 */
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/format";

type PreviewAvatarProps = {
  src?: string | null;
  /** Used for the initials fallback and the image's alt text. */
  name?: string;
  className?: string;
  /** Instagram stories and Slack use squared avatars. */
  shape?: "circle" | "rounded";
  /** Ring drawn around the avatar, e.g. Instagram's gradient story ring. */
  ring?: "none" | "story" | "border";
};

/**
 * Avatar used inside previews.
 *
 * Deliberately not the shadcn `Avatar`: previews must not inherit editor
 * tokens, and the fallback needs to sit on the platform palette instead.
 */
export const PreviewAvatar = ({
  src,
  name = "",
  className,
  shape = "circle",
  ring = "none",
}: PreviewAvatarProps) => {
  const initials = getInitials(name);
  const radius = shape === "circle" ? "rounded-full" : "rounded-[30%]";

  const avatar = (
    <span
      className={cn(
        "relative flex size-9 shrink-0 select-none items-center justify-center overflow-hidden bg-[var(--pv-subtle)] text-[var(--pv-muted)]",
        radius,
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={name ? `${name}'s profile picture` : "Profile picture"}
          className="size-full object-cover"
          draggable={false}
        />
      ) : initials ? (
        <span className="text-[0.72em] font-semibold tracking-tight">
          {initials}
        </span>
      ) : (
        <User className="size-[55%]" strokeWidth={1.75} aria-hidden />
      )}
    </span>
  );

  if (ring === "none") return avatar;

  if (ring === "border") {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 p-[1.5px] ring-1 ring-[var(--pv-border)]",
          radius
        )}
      >
        {avatar}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 bg-[conic-gradient(from_0deg,#f9ce34,#ee2a7b,#6228d7,#f9ce34)] p-[2px]",
        radius
      )}
    >
      <span className={cn("bg-[var(--pv-bg)] p-[2px]", radius)}>{avatar}</span>
    </span>
  );
};
