/**
 * External dependencies.
 */
import {
  ArrowBigDown,
  ArrowBigUp,
  MessageCircle,
  MoreHorizontal,
  Share,
} from "lucide-react";

/**
 * Internal dependencies.
 */
import type { PostPreviewProps } from "./types";
import { handle } from "../fallbacks";
import {
  createSkin,
  ExpandableText,
  MediaCarousel,
  PreviewAvatar,
  PreviewCard,
  PreviewSurface,
} from "../primitives";
import { aspectRatioOf } from "@/lib/media";
import { formatCount, formatRelativeTime } from "@/lib/format";

const SKIN = createSkin(
  {
    bg: "#ffffff",
    surface: "#ffffff",
    subtle: "#e5ebee",
    fg: "#0f1a1c",
    muted: "#5c6c74",
    faint: "#5c6c74",
    border: "#d2dadd",
    accent: "#0079d3",
    accentFg: "#ffffff",
  },
  {
    bg: "#0e1113",
    surface: "#0e1113",
    subtle: "#1a282d",
    fg: "#d7dadc",
    muted: "#8ba2ad",
    faint: "#8ba2ad",
    border: "#1e2a30",
    accent: "#4fbcff",
  }
);

/**
 * Reddit post card.
 *
 * Reddit is the one network here where the title is a separate field from the
 * body, and where the vote control is the primary action rather than a like.
 */
export const RedditPost = ({ data }: PostPreviewProps) => {
  const { author, content, metrics, appearance } = data;

  const title =
    content.title.trim() || content.caption.trim().split("\n")[0] || "Post title";

  // The title line is promoted out of the caption when no explicit title is set.
  const body = content.title.trim()
    ? content.caption.trim()
    : content.caption.trim().split("\n").slice(1).join("\n").trim();

  return (
    <PreviewSurface skin={SKIN} theme={appearance.theme} className="w-full">
      <PreviewCard className="rounded-2xl">
        <article className="p-4 text-sm">
          <header className="mb-2 flex items-center gap-2">
            <PreviewAvatar
              src={author.avatar}
              name={content.subreddit || author.name}
              className="size-8"
            />
            <div className="flex min-w-0 flex-1 flex-col leading-tight">
              <span className="truncate text-xs font-semibold">
                r/{handle(content.subreddit, "subreddit")}
              </span>
              <span className="truncate text-xs text-[var(--pv-muted)]">
                u/{handle(author.username)} ·{" "}
                {formatRelativeTime(metrics.date, "short")}
              </span>
            </div>
            <button
              type="button"
              className="cursor-pointer rounded-full bg-[var(--pv-accent)] px-4 py-1.5 text-xs font-bold text-[var(--pv-accent-fg)] transition hover:opacity-90"
            >
              Join
            </button>
            <button
              type="button"
              aria-label="More options"
              className="grid size-8 cursor-pointer place-items-center rounded-full text-[var(--pv-muted)] transition-colors hover:bg-[var(--pv-subtle)]"
            >
              <MoreHorizontal className="size-5" />
            </button>
          </header>

          <h3 className="text-[18px] font-semibold leading-6">{title}</h3>

          {body && (
            <ExpandableText
              text={body}
              limit={280}
              entities={["url", "mention"]}
              moreLabel="Read more"
              className="mt-2 text-sm leading-snug text-[var(--pv-fg)]"
              moreClassName="text-[var(--pv-accent)]"
            />
          )}

          {content.media.length > 0 && (
            <MediaCarousel
              items={content.media}
              rounded
              fit="contain"
              aspect={Math.min(
                Math.max(aspectRatioOf(content.media[0], 4 / 3), 0.6),
                1.9
              )}
              className="mt-3 border border-[var(--pv-border)]"
            />
          )}

          <footer className="mt-3 flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-full bg-[var(--pv-subtle)]">
              <button
                type="button"
                aria-label="Upvote"
                className="group grid size-8 cursor-pointer place-items-center rounded-full transition-colors hover:bg-[#ff4500]/15"
              >
                <ArrowBigUp className="size-5 group-hover:fill-[#ff4500] group-hover:text-[#ff4500]" />
              </button>
              <span className="min-w-6 text-center text-xs font-semibold tabular-nums">
                {metrics.reactions > 0 ? formatCount(metrics.reactions) : "Vote"}
              </span>
              <button
                type="button"
                aria-label="Downvote"
                className="group grid size-8 cursor-pointer place-items-center rounded-full transition-colors hover:bg-[#7193ff]/15"
              >
                <ArrowBigDown className="size-5 group-hover:fill-[#7193ff] group-hover:text-[#7193ff]" />
              </button>
            </div>

            <button
              type="button"
              className="flex cursor-pointer items-center gap-2 rounded-full bg-[var(--pv-subtle)] px-3 py-2 text-xs font-semibold transition-colors hover:brightness-95"
            >
              <MessageCircle className="size-4" aria-hidden />
              {formatCount(metrics.comments)}
            </button>

            <button
              type="button"
              className="flex cursor-pointer items-center gap-2 rounded-full bg-[var(--pv-subtle)] px-3 py-2 text-xs font-semibold transition-colors hover:brightness-95"
            >
              <Share className="size-4" aria-hidden />
              {metrics.reposts > 0 ? formatCount(metrics.reposts) : "Share"}
            </button>

            {metrics.views > 0 && (
              <span className="ml-auto text-xs text-[var(--pv-muted)]">
                {formatCount(metrics.views)} views
              </span>
            )}
          </footer>
        </article>
      </PreviewCard>
    </PreviewSurface>
  );
};
