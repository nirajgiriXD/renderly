/**
 * External dependencies.
 */
import { Globe, MessageCircle, MoreHorizontal, Share2, ThumbsUp } from "lucide-react";

/**
 * Internal dependencies.
 */
import type { PostPreviewProps } from "./types";
import { displayName } from "../fallbacks";
import {
  createSkin,
  Divider,
  ExpandableText,
  MediaGrid,
  PreviewAvatar,
  PreviewCard,
  PreviewSurface,
  VerifiedBadge,
} from "../primitives";
import { cn } from "@/lib/utils";
import { formatCount, formatRelativeTime } from "@/lib/format";

const SKIN = createSkin(
  {
    bg: "#ffffff",
    surface: "#ffffff",
    subtle: "#f0f2f5",
    fg: "#080809",
    muted: "#65676b",
    faint: "#8a8d91",
    border: "#ced0d4",
    accent: "#0866ff",
    accentFg: "#ffffff",
  },
  {
    bg: "#242526",
    surface: "#242526",
    subtle: "#3a3b3c",
    fg: "#e4e6eb",
    muted: "#b0b3b8",
    faint: "#8a8d91",
    border: "#3e4042",
    accent: "#2d88ff",
  }
);

/** Facebook shows short, media-free status updates at a much larger size. */
const LARGE_TEXT_LIMIT = 85;

/** The stacked reaction glyphs Facebook renders next to the count. */
const Reactions = ({ total }: { total: number }) => (
  <div className="flex -space-x-1">
    <span className="grid size-[18px] place-items-center rounded-full bg-[#0866ff] ring-2 ring-[var(--pv-bg)]">
      <ThumbsUp className="size-2.5 fill-white text-white" />
    </span>
    {total > 1 && (
      <span className="grid size-[18px] place-items-center rounded-full bg-[#f33e58] text-[9px] ring-2 ring-[var(--pv-bg)]">
        ❤️
      </span>
    )}
    {total > 12 && (
      <span className="grid size-[18px] place-items-center rounded-full bg-[#f7b125] text-[9px] ring-2 ring-[var(--pv-bg)]">
        😆
      </span>
    )}
  </div>
);

export const FacebookPost = ({ data }: PostPreviewProps) => {
  const { author, content, metrics, appearance } = data;

  const caption = content.caption.trim();
  const isLargeStatus =
    content.media.length === 0 &&
    caption.length > 0 &&
    caption.length <= LARGE_TEXT_LIMIT &&
    !caption.includes("\n");

  return (
    <PreviewSurface skin={SKIN} theme={appearance.theme} className="w-full">
      <PreviewCard className="rounded-lg">
        <article>
          <header className="flex items-start gap-2 px-4 pt-3">
            <PreviewAvatar
              src={author.avatar}
              name={author.name}
              className="size-10"
            />
            <div className="min-w-0 flex-1 leading-tight">
              <div className="flex items-center gap-1">
                <span className="truncate text-[15px] font-semibold hover:underline">
                  {displayName(author.name)}
                </span>
                {author.verified && <VerifiedBadge variant="facebook" />}
              </div>
              <div className="mt-0.5 flex items-center gap-1 text-[13px] text-[var(--pv-muted)]">
                <span className="hover:underline">
                  {formatRelativeTime(metrics.date, "long")}
                </span>
                <span aria-hidden>·</span>
                <Globe className="size-3" aria-hidden />
              </div>
            </div>
            <button
              type="button"
              aria-label="More options"
              className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-[var(--pv-muted)] transition-colors hover:bg-[var(--pv-subtle)]"
            >
              <MoreHorizontal className="size-5" />
            </button>
          </header>

          {caption && (
            <ExpandableText
              text={caption}
              limit={isLargeStatus ? 0 : 240}
              clampAtParagraph={!isLargeStatus}
              moreLabel="See more"
              className={cn(
                "px-4",
                isLargeStatus
                  ? "flex min-h-36 items-center justify-center py-8 text-center text-2xl font-semibold leading-snug"
                  : "pt-3 text-[15px] leading-snug"
              )}
              moreClassName="text-[var(--pv-muted)]"
            />
          )}

          {content.media.length > 0 && (
            <MediaGrid
              items={content.media}
              gridStyle="facebook"
              rounded={false}
              className="mt-3"
              singleMaxHeight="34rem"
            />
          )}

          <div className="px-4">
            {(metrics.reactions > 0 ||
              metrics.comments > 0 ||
              metrics.reposts > 0) && (
              <div className="flex items-center justify-between py-2.5 text-[15px] text-[var(--pv-muted)]">
                {metrics.reactions > 0 ? (
                  <div className="flex items-center gap-1.5">
                    <Reactions total={metrics.reactions} />
                    <span className="hover:underline">
                      {formatCount(metrics.reactions, "full")}
                    </span>
                  </div>
                ) : (
                  <span />
                )}
                <div className="flex gap-3">
                  {metrics.comments > 0 && (
                    <span className="hover:underline">
                      {formatCount(metrics.comments, "full")} comment
                      {metrics.comments === 1 ? "" : "s"}
                    </span>
                  )}
                  {metrics.reposts > 0 && (
                    <span className="hover:underline">
                      {formatCount(metrics.reposts, "full")} share
                      {metrics.reposts === 1 ? "" : "s"}
                    </span>
                  )}
                </div>
              </div>
            )}

            <Divider />

            <div className="flex items-center gap-1 py-1">
              <ActionButton icon={ThumbsUp} label="Like" />
              <ActionButton icon={MessageCircle} label="Comment" />
              <ActionButton icon={Share2} label="Share" />
            </div>
          </div>
        </article>
      </PreviewCard>
    </PreviewSurface>
  );
};

const ActionButton = ({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) => (
  <button
    type="button"
    className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md py-2 text-[15px] font-semibold text-[var(--pv-muted)] transition-colors hover:bg-[var(--pv-subtle)]"
  >
    <Icon className="size-[18px]" aria-hidden />
    {label}
  </button>
);
