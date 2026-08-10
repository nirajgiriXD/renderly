/**
 * External dependencies.
 */
import {
  Globe,
  MessageSquare,
  MoreHorizontal,
  Repeat,
  Send,
  ThumbsUp,
} from "lucide-react";

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
import { formatCount, formatRelativeTime } from "@/lib/format";

const SKIN = createSkin(
  {
    bg: "#ffffff",
    surface: "#f4f2ee",
    subtle: "#eef3f8",
    fg: "rgba(0,0,0,.9)",
    muted: "rgba(0,0,0,.6)",
    faint: "rgba(0,0,0,.45)",
    border: "rgba(0,0,0,.08)",
    accent: "#0a66c2",
    accentFg: "#ffffff",
  },
  {
    bg: "#1b1f23",
    surface: "#000000",
    subtle: "#2b3236",
    fg: "rgba(255,255,255,.9)",
    muted: "rgba(255,255,255,.6)",
    faint: "rgba(255,255,255,.45)",
    border: "rgba(255,255,255,.13)",
    accent: "#71b7fb",
  }
);

/** LinkedIn's three most common reactions, stacked left to right. */
const ReactionStack = ({ total }: { total: number }) => (
  <div className="flex -space-x-1">
    <span className="grid size-4 place-items-center rounded-full bg-[#378fe9] ring-1 ring-[var(--pv-bg)]">
      <ThumbsUp className="size-2 fill-white text-white" />
    </span>
    {total > 1 && (
      <span className="grid size-4 place-items-center rounded-full bg-[#6dae4f] text-[8px] ring-1 ring-[var(--pv-bg)]">
        👏
      </span>
    )}
    {total > 8 && (
      <span className="grid size-4 place-items-center rounded-full bg-[#df704d] text-[8px] ring-1 ring-[var(--pv-bg)]">
        ❤️
      </span>
    )}
  </div>
);

export const LinkedInPost = ({ data }: PostPreviewProps) => {
  const { author, content, metrics, appearance } = data;

  return (
    <PreviewSurface skin={SKIN} theme={appearance.theme} className="w-full">
      <PreviewCard className="rounded-lg">
        <article className="text-sm">
          <header className="flex gap-2 px-4 pt-3">
            <PreviewAvatar
              src={author.avatar}
              name={author.name}
              className="size-12"
            />
            <div className="min-w-0 flex-1 leading-tight">
              <div className="flex items-center gap-1">
                <span className="truncate font-semibold hover:text-[var(--pv-accent)] hover:underline">
                  {displayName(author.name)}
                </span>
                {author.verified && (
                  <VerifiedBadge variant="linkedin" className="size-3.5" />
                )}
                <span className="shrink-0 text-xs text-[var(--pv-faint)]">
                  • 1st
                </span>
              </div>
              <p className="truncate text-xs text-[var(--pv-muted)]">
                {author.jobTitle || "Add a headline to fill this line"}
              </p>
              <div className="flex items-center gap-1 text-xs text-[var(--pv-faint)]">
                <span>{formatRelativeTime(metrics.date, "short")}</span>
                <span aria-hidden>•</span>
                <Globe className="size-3" aria-hidden />
              </div>
            </div>
            <button
              type="button"
              aria-label="More options"
              className="grid size-8 shrink-0 cursor-pointer place-items-center self-start rounded-full text-[var(--pv-muted)] transition-colors hover:bg-[var(--pv-subtle)]"
            >
              <MoreHorizontal className="size-5" />
            </button>
          </header>

          {content.caption.trim() && (
            <ExpandableText
              text={content.caption}
              limit={210}
              moreLabel="…more"
              className="px-4 pt-3 text-sm leading-snug"
              moreClassName="text-[var(--pv-faint)]"
            />
          )}

          {content.media.length > 0 && (
            <MediaGrid
              items={content.media}
              gridStyle="facebook"
              rounded={false}
              className="mt-2"
              singleMaxHeight="32rem"
            />
          )}

          <div className="px-4">
            {(metrics.reactions > 0 ||
              metrics.comments > 0 ||
              metrics.reposts > 0) && (
              <div className="flex items-center justify-between py-2 text-xs text-[var(--pv-muted)]">
                {metrics.reactions > 0 ? (
                  <div className="flex items-center gap-1">
                    <ReactionStack total={metrics.reactions} />
                    <span className="hover:text-[var(--pv-accent)] hover:underline">
                      {formatCount(metrics.reactions, "full")}
                    </span>
                  </div>
                ) : (
                  <span />
                )}
                <div className="flex items-center gap-1">
                  {metrics.comments > 0 && (
                    <span className="hover:text-[var(--pv-accent)] hover:underline">
                      {formatCount(metrics.comments, "full")} comment
                      {metrics.comments === 1 ? "" : "s"}
                    </span>
                  )}
                  {metrics.comments > 0 && metrics.reposts > 0 && (
                    <span aria-hidden>•</span>
                  )}
                  {metrics.reposts > 0 && (
                    <span className="hover:text-[var(--pv-accent)] hover:underline">
                      {formatCount(metrics.reposts, "full")} repost
                      {metrics.reposts === 1 ? "" : "s"}
                    </span>
                  )}
                </div>
              </div>
            )}

            <Divider />

            <div className="flex items-center justify-between py-1">
              <ActionButton icon={ThumbsUp} label="Like" />
              <ActionButton icon={MessageSquare} label="Comment" />
              <ActionButton icon={Repeat} label="Repost" />
              <ActionButton icon={Send} label="Send" />
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
    className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded px-2 py-2.5 text-sm font-semibold text-[var(--pv-muted)] transition-colors hover:bg-[var(--pv-subtle)]"
  >
    <Icon className="size-5" strokeWidth={1.6} aria-hidden />
    <span>{label}</span>
  </button>
);
