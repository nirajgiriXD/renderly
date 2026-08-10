/**
 * External dependencies.
 */
import { useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

/**
 * Internal dependencies.
 */
import { VideoPlayer } from "./VideoPlayer";
import type { VideoVariant } from "./VideoPlayer";
import { cn } from "@/lib/utils";
import { aspectRatioOf } from "@/lib/media";
import type { MediaItem } from "@/types";

type FitMode = "cover" | "contain";

type MediaFrameProps = {
  item: MediaItem;
  className?: string;
  fit?: FitMode;
  videoVariant?: VideoVariant;
  autoPlayVideo?: boolean;
  loopVideo?: boolean;
};

/** A single image or video, with a graceful failure state. */
export const MediaFrame = ({
  item,
  className,
  fit = "cover",
  videoVariant = "feed",
  autoPlayVideo = false,
  loopVideo = false,
}: MediaFrameProps) => {
  // Reset during render when the source changes, rather than in an effect —
  // an effect would paint the previous file's error state for one frame.
  const [state, setState] = useState({ src: item.src, broken: false });
  if (state.src !== item.src) setState({ src: item.src, broken: false });
  const broken = state.broken && state.src === item.src;

  if (item.kind === "video") {
    return (
      <VideoPlayer
        src={item.src}
        variant={videoVariant}
        autoPlay={autoPlayVideo}
        loop={loopVideo}
        className={cn("size-full", className)}
      />
    );
  }

  if (broken) {
    return (
      <div
        className={cn(
          "flex size-full flex-col items-center justify-center gap-1 bg-[var(--pv-subtle)] p-4 text-center text-[var(--pv-faint)]",
          className
        )}
      >
        <ImageOff className="size-5" aria-hidden />
        <span className="text-[11px]">Image unavailable</span>
      </div>
    );
  }

  return (
    <img
      src={item.src}
      alt={item.name || "Attached media"}
      onError={() => setState({ src: item.src, broken: true })}
      draggable={false}
      className={cn(
        "size-full",
        fit === "cover" ? "object-cover" : "object-contain",
        className
      )}
    />
  );
};

type GalleryProps = {
  items: MediaItem[];
  className?: string;
  /** Grid packing rules. Networks differ in how they tile 2–4 attachments. */
  gridStyle?: "twitter" | "facebook";
  rounded?: boolean;
  videoVariant?: VideoVariant;
  autoPlayVideo?: boolean;
  /** Cap for a lone attachment rendered at its natural aspect ratio. */
  singleMaxHeight?: string;
  /** Force a ratio for a lone attachment, e.g. Instagram's 4:5 crop. */
  singleAspect?: number;
  fit?: FitMode;
};

/**
 * Tiled attachments, matching how feeds pack 1–4+ items.
 *
 * A single attachment keeps its own aspect ratio (letterboxed within a cap);
 * multiples are cropped into a tile grid the way the real clients do.
 */
export const MediaGrid = ({
  items,
  className,
  gridStyle = "twitter",
  rounded = true,
  videoVariant,
  autoPlayVideo,
  singleMaxHeight = "32rem",
  singleAspect,
  fit = "cover",
}: GalleryProps) => {
  if (items.length === 0) return null;

  const radius = rounded ? "rounded-2xl" : "";

  if (items.length === 1) {
    const [item] = items;
    const ratio = singleAspect ?? aspectRatioOf(item, 16 / 9);

    return (
      <div
        className={cn(
          "w-full overflow-hidden bg-[var(--pv-subtle)]",
          radius,
          className
        )}
        style={{
          aspectRatio: singleAspect ? String(singleAspect) : undefined,
          maxHeight: singleAspect ? undefined : singleMaxHeight,
        }}
      >
        <MediaFrame
          item={item}
          fit={singleAspect ? "cover" : fit}
          videoVariant={videoVariant}
          autoPlayVideo={autoPlayVideo}
          className={
            singleAspect
              ? undefined
              : cn("h-auto w-full", ratio < 1 && "mx-auto w-auto")
          }
        />
      </div>
    );
  }

  const visible = items.slice(0, 4);
  const overflow = items.length - visible.length;

  const tile = (item: MediaItem, index: number, extraClass?: string) => (
    <div
      key={item.id}
      className={cn("relative overflow-hidden bg-[var(--pv-subtle)]", extraClass)}
    >
      <MediaFrame
        item={item}
        fit="cover"
        videoVariant={videoVariant}
        autoPlayVideo={autoPlayVideo}
      />
      {overflow > 0 && index === visible.length - 1 && (
        <div className="absolute inset-0 grid place-items-center bg-black/45 text-2xl font-semibold text-white">
          +{overflow}
        </div>
      )}
    </div>
  );

  // Facebook stacks a full-bleed hero above the remainder; X splits vertically.
  const threeUp =
    gridStyle === "facebook"
      ? "grid-cols-2 [&>*:first-child]:col-span-2"
      : "grid-cols-2 grid-rows-2 [&>*:first-child]:row-span-2";

  return (
    <div
      className={cn(
        "grid w-full gap-0.5 overflow-hidden",
        radius,
        visible.length === 2 && "aspect-[16/9] grid-cols-2",
        visible.length === 3 && cn("aspect-[16/10]", threeUp),
        visible.length === 4 && "aspect-square grid-cols-2 grid-rows-2",
        className
      )}
    >
      {visible.map((item, index) => tile(item, index))}
    </div>
  );
};

/**
 * Swipeable album used by Instagram, TikTok photo posts and Reddit galleries.
 */
export const MediaCarousel = ({
  items,
  className,
  aspect = 1,
  rounded = false,
  showCounter = true,
  videoVariant,
  fit = "cover",
  onIndexChange,
}: {
  items: MediaItem[];
  className?: string;
  aspect?: number;
  rounded?: boolean;
  showCounter?: boolean;
  videoVariant?: VideoVariant;
  fit?: FitMode;
  /** Lets the caller render page dots outside the media box, as Instagram does. */
  onIndexChange?: (index: number) => void;
}) => {
  const [index, setIndex] = useState(0);

  if (items.length === 0) return null;

  // Clamped on read so deleting the trailing slide cannot leave the carousel
  // pointing past the end of the list.
  const active = Math.min(index, items.length - 1);
  const multiple = items.length > 1;

  const go = (next: number) => {
    setIndex(next);
    onIndexChange?.(next);
  };

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-black",
        rounded && "rounded-xl",
        className
      )}
      style={{ aspectRatio: String(aspect) }}
    >
      <div
        className="flex size-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {items.map((item) => (
          <div key={item.id} className="size-full shrink-0 basis-full">
            <MediaFrame item={item} fit={fit} videoVariant={videoVariant} />
          </div>
        ))}
      </div>

      {multiple && (
        <>
          {active > 0 && (
            <button
              type="button"
              aria-label="Previous item"
              onClick={() => go(active - 1)}
              className="absolute left-2 top-1/2 grid size-7 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/85 text-black shadow transition hover:bg-white"
            >
              <ChevronLeft className="size-4" />
            </button>
          )}
          {active < items.length - 1 && (
            <button
              type="button"
              aria-label="Next item"
              onClick={() => go(active + 1)}
              className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/85 text-black shadow transition hover:bg-white"
            >
              <ChevronRight className="size-4" />
            </button>
          )}

          {showCounter && (
            <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white">
              {active + 1}/{items.length}
            </span>
          )}
        </>
      )}
    </div>
  );
};

/** Page dots that Instagram renders *below* the media, not on top of it. */
export const CarouselDots = ({
  count,
  active,
  className,
}: {
  count: number;
  active: number;
  className?: string;
}) => {
  if (count < 2) return null;
  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      {Array.from({ length: count }, (_, dot) => (
        <span
          key={dot}
          className={cn(
            "size-1.5 rounded-full transition-colors",
            dot === active ? "bg-[var(--pv-accent)]" : "bg-[var(--pv-border)]"
          )}
        />
      ))}
    </div>
  );
};
