/**
 * External dependencies.
 */
import { useState } from "react";
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Send } from "lucide-react";

/**
 * Internal dependencies.
 */
import type { PostPreviewProps } from "./types";
import { handle } from "../fallbacks";
import {
  CarouselDots,
  createSkin,
  ExpandableText,
  MediaCarousel,
  PreviewAvatar,
  PreviewCard,
  PreviewPlaceholder,
  PreviewSurface,
  VerifiedBadge,
} from "../primitives";
import { aspectRatioOf } from "@/lib/media";
import { formatCount, formatRelativeTime } from "@/lib/format";

const SKIN = createSkin(
  {
    bg: "#ffffff",
    surface: "#ffffff",
    subtle: "#efefef",
    fg: "#000000",
    muted: "#737373",
    faint: "#a8a8a8",
    border: "#dbdbdb",
    accent: "#0095f6",
    accentFg: "#ffffff",
  },
  {
    bg: "#000000",
    surface: "#000000",
    subtle: "#1a1a1a",
    fg: "#f5f5f5",
    muted: "#a8a8a8",
    faint: "#737373",
    border: "#262626",
  }
);

/**
 * Instagram feed post.
 *
 * Instagram crops every attachment into one of three ratios — 1:1, 4:5
 * portrait or 1.91:1 landscape — chosen from the first item, so the album
 * stays a single consistent shape while swiping.
 */
const feedAspect = (ratio: number) => {
  if (ratio < 1) return 4 / 5;
  if (ratio > 1.4) return 1.91;
  return 1;
};

export const InstagramPost = ({ data }: PostPreviewProps) => {
  const { author, content, metrics, appearance } = data;
  const [slide, setSlide] = useState(0);

  const aspect =
    content.media.length > 0 ? feedAspect(aspectRatioOf(content.media[0])) : 1;

  return (
    <PreviewSurface skin={SKIN} theme={appearance.theme} className="w-full">
      <PreviewCard className="rounded-lg">
        <article className="text-sm">
          <header className="flex items-center gap-3 p-3">
            <PreviewAvatar
              src={author.avatar}
              name={author.name}
              className="size-8"
              ring="story"
            />
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-1">
              <span className="truncate font-semibold">
                {handle(author.username)}
              </span>
              {author.verified && <VerifiedBadge variant="instagram" />}
              <span className="text-[var(--pv-muted)]" aria-hidden>
                •
              </span>
              <time className="text-[var(--pv-muted)]">
                {formatRelativeTime(metrics.date, "short")}
              </time>
            </div>
            <button
              type="button"
              aria-label="More options"
              className="cursor-pointer text-[var(--pv-fg)]"
            >
              <MoreHorizontal className="size-5" />
            </button>
          </header>

          {content.media.length > 0 ? (
            <MediaCarousel
              items={content.media}
              aspect={aspect}
              onIndexChange={setSlide}
            />
          ) : (
            <PreviewPlaceholder
              title="Add a photo or video"
              hint="Instagram posts always lead with media — the caption sits underneath it."
              className="mx-3 aspect-square rounded-none border-x-0"
            />
          )}

          <div className="space-y-2 p-3">
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  aria-label="Like"
                  className="cursor-pointer transition hover:opacity-50"
                >
                  <Heart className="size-6" strokeWidth={1.8} />
                </button>
                <button
                  type="button"
                  aria-label="Comment"
                  className="cursor-pointer transition hover:opacity-50"
                >
                  <MessageCircle
                    className="size-6 -scale-x-100"
                    strokeWidth={1.8}
                  />
                </button>
                <button
                  type="button"
                  aria-label="Share"
                  className="cursor-pointer transition hover:opacity-50"
                >
                  <Send className="size-6 -rotate-12" strokeWidth={1.8} />
                </button>
              </div>

              <CarouselDots
                count={content.media.length}
                active={slide}
                className="absolute left-1/2 -translate-x-1/2"
              />

              <button
                type="button"
                aria-label="Save"
                className="cursor-pointer transition hover:opacity-50"
              >
                <Bookmark className="size-6" strokeWidth={1.8} />
              </button>
            </div>

            {metrics.reactions > 0 && (
              <p className="font-semibold">
                {formatCount(metrics.reactions, "full")} like
                {metrics.reactions === 1 ? "" : "s"}
              </p>
            )}

            {content.caption.trim() && (
              <ExpandableText
                text={content.caption}
                limit={125}
                moreLabel="more"
                className="leading-snug"
                moreClassName="text-[var(--pv-muted)]"
                prefix={
                  <span className="mr-1.5 font-semibold">
                    {handle(author.username)}
                  </span>
                }
              />
            )}

            {metrics.comments > 0 && (
              <button
                type="button"
                className="block cursor-pointer text-[var(--pv-muted)]"
              >
                View all {formatCount(metrics.comments, "full")} comments
              </button>
            )}

            {metrics.views > 0 && (
              <p className="text-[var(--pv-muted)]">
                {formatCount(metrics.views)} views
              </p>
            )}
          </div>
        </article>
      </PreviewCard>
    </PreviewSurface>
  );
};
