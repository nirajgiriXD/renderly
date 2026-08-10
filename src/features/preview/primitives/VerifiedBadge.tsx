/**
 * Internal dependencies.
 */
import { cn } from "@/lib/utils";

/**
 * The scalloped "burst" outline used by X and Meta verification badges.
 */
const BURST_PATH =
  "M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81C14.67 2.63 13.43 1.75 12 1.75s-2.67.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91c-1.31.67-2.19 1.91-2.19 3.34s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z";

export type BadgeVariant =
  | "twitter"
  | "facebook"
  | "instagram"
  | "tiktok"
  | "youtube"
  | "linkedin"
  | "reddit";

const VARIANTS: Record<
  BadgeVariant,
  { shape: "burst" | "circle"; color: string; label: string }
> = {
  twitter: { shape: "burst", color: "#1d9bf0", label: "Verified account" },
  facebook: { shape: "burst", color: "#0866ff", label: "Verified page" },
  instagram: { shape: "burst", color: "#0095f6", label: "Verified account" },
  tiktok: { shape: "circle", color: "#20d5ec", label: "Verified account" },
  youtube: { shape: "circle", color: "#aaaaaa", label: "Verified channel" },
  linkedin: { shape: "circle", color: "#0a66c2", label: "Verified member" },
  reddit: { shape: "circle", color: "#ff4500", label: "Verified" },
};

/**
 * Platform verification badge.
 *
 * Each network draws its own mark; rendering the same generic check
 * everywhere is the fastest way for a preview to look wrong.
 */
export const VerifiedBadge = ({
  variant,
  className,
}: {
  variant: BadgeVariant;
  className?: string;
}) => {
  const { shape, color, label } = VARIANTS[variant];

  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label={label}
      className={cn("size-[1.05em] shrink-0", className)}
      fill={color}
    >
      {shape === "burst" ? (
        <path d={BURST_PATH} />
      ) : (
        <>
          <circle cx="12" cy="12" r="10" />
          <path
            d="M10.6 16.2 6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36z"
            fill="#fff"
          />
        </>
      )}
    </svg>
  );
};
