/**
 * External dependencies.
 */
import {
  BarChart3,
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Upload,
} from "lucide-react";

/**
 * Internal dependencies.
 */
import type { PostPreviewProps } from "./types";
import { displayName, handle } from "../fallbacks";
import {
  createSkin,
  ExpandableText,
  IconAction,
  MediaGrid,
  NEUTRAL_DARK,
  NEUTRAL_LIGHT,
  PreviewAvatar,
  PreviewCard,
  PreviewSurface,
  VerifiedBadge,
} from "../primitives";
import { formatCount, formatRelativeTime } from "@/lib/format";

const SKIN = createSkin(
  { ...NEUTRAL_LIGHT, muted: "#536471", faint: "#536471", border: "#eff3f4" },
  NEUTRAL_DARK
);

/**
 * X (Twitter) timeline post.
 *
 * Notable details: the whole tweet is one hover surface, counts sit beside the
 * glyph rather than under it, and views use a dedicated analytics icon.
 */
export const TwitterPost = ({ data }: PostPreviewProps) => {
  const { author, content, metrics, appearance } = data;

  return (
    <PreviewSurface skin={SKIN} theme={appearance.theme} className="w-full">
      <PreviewCard className="transition-colors hover:bg-[var(--pv-subtle)]/50">
        <article className="flex gap-3 px-3 py-3 text-[15px] leading-5">
          <PreviewAvatar
            src={author.avatar}
            name={author.name}
            className="size-10"
          />

          <div className="min-w-0 flex-1">
            <header className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 flex-wrap items-center gap-x-1">
                <span className="truncate font-bold hover:underline">
                  {displayName(author.name)}
                </span>
                {author.verified && <VerifiedBadge variant="twitter" />}
                <span className="truncate text-[var(--pv-muted)]">
                  @{handle(author.username)}
                </span>
                <span className="text-[var(--pv-muted)]">·</span>
                <time className="text-[var(--pv-muted)] hover:underline">
                  {formatRelativeTime(metrics.date, "short")}
                </time>
              </div>

              <IconAction
                label="More"
                tint="blue"
                className="-mr-2 -mt-1 shrink-0 p-2"
              >
                <MoreHorizontal className="size-4" />
              </IconAction>
            </header>

            {content.caption.trim() && (
              <ExpandableText
                text={content.caption}
                limit={280}
                moreLabel="Show more"
                lessLabel="Show less"
                shortenUrls
                className="mt-0.5"
                moreClassName="block text-[var(--pv-accent)]"
              />
            )}

            {content.media.length > 0 && (
              <MediaGrid
                items={content.media}
                gridStyle="twitter"
                className="mt-3 border border-[var(--pv-border)]"
                singleMaxHeight="30rem"
              />
            )}

            {/*
              Six affordances have to fit a 390px handset, so the counted
              actions flex down and only the two icon-only buttons keep a
              fixed footprint.
            */}
            <footer className="-ml-1.5 mt-3 flex items-center justify-between text-[13px] text-[var(--pv-muted)]">
              <Action
                icon={<MessageCircle className="size-[17px]" />}
                count={metrics.comments}
                label="Reply"
                tint="blue"
              />
              <Action
                icon={<Repeat2 className="size-[18px]" />}
                count={metrics.reposts}
                label="Repost"
                tint="green"
              />
              <Action
                icon={<Heart className="size-[17px]" />}
                count={metrics.reactions}
                label="Like"
                tint="pink"
              />
              <Action
                icon={<BarChart3 className="size-[17px]" />}
                count={metrics.views}
                label="Views"
                tint="blue"
              />
              <Action
                icon={<Bookmark className="size-[17px]" />}
                count={metrics.bookmarks}
                label="Bookmark"
                tint="blue"
              />
              <IconAction label="Share" tint="blue" className="shrink-0 p-1">
                <Upload className="size-[17px]" />
              </IconAction>
            </footer>
          </div>
        </article>
      </PreviewCard>
    </PreviewSurface>
  );
};

const Action = ({
  icon,
  count,
  label,
  tint,
}: {
  icon: React.ReactNode;
  count: number;
  label: string;
  tint: "blue" | "green" | "pink";
}) => (
  <IconAction label={label} tint={tint} className="shrink-0 gap-0.5">
    <span className="grid size-6.5 shrink-0 place-items-center rounded-full transition-colors group-hover/action:bg-current/10">
      {icon}
    </span>
    {count > 0 && (
      <span className="whitespace-nowrap text-[12.5px] tabular-nums">
        {formatCount(count)}
      </span>
    )}
  </IconAction>
);
