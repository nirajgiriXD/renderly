/**
 * External dependencies.
 */
import { Heart } from "lucide-react";

/**
 * Internal dependencies.
 */
import { isCreator, personOf, usePeople } from "./shared";
import type { CommentPreviewProps } from "./shared";
import { displayName } from "../fallbacks";
import {
  createSkin,
  ExpandableText,
  PreviewAvatar,
  PreviewCard,
  PreviewPlaceholder,
  PreviewSurface,
  VerifiedBadge,
} from "../primitives";
import { formatCount, formatRelativeTime } from "@/lib/format";
import type { CommentReply, Person } from "@/types";

const SKIN = createSkin(
  {
    bg: "#ffffff",
    surface: "#ffffff",
    subtle: "#f1f1f2",
    fg: "#161823",
    muted: "rgba(22,24,35,.6)",
    faint: "rgba(22,24,35,.4)",
    border: "rgba(22,24,35,.12)",
    accent: "#fe2c55",
    accentFg: "#ffffff",
  },
  {
    bg: "#121212",
    surface: "#121212",
    subtle: "#1f1f1f",
    fg: "rgba(255,255,255,.9)",
    muted: "rgba(255,255,255,.55)",
    faint: "rgba(255,255,255,.4)",
    border: "rgba(255,255,255,.12)",
  }
);

const CommentRow = ({
  person,
  comment,
  creator,
  compact,
}: {
  person: Person;
  comment: CommentReply;
  creator: boolean;
  compact?: boolean;
}) => (
  <div className="flex gap-2.5">
    <PreviewAvatar
      src={person.avatar}
      name={person.name}
      className={compact ? "size-7" : "size-9"}
    />

    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-1 text-[13px] font-semibold text-[var(--pv-muted)]">
        <span className="truncate">{displayName(person.name)}</span>
        {person.verified && <VerifiedBadge variant="tiktok" className="size-3" />}
        {creator && (
          <span className="rounded-sm bg-[var(--pv-subtle)] px-1 text-[10px] font-semibold">
            Creator
          </span>
        )}
      </div>

      <ExpandableText
        text={comment.text}
        limit={compact ? 100 : 150}
        moreLabel="See more"
        className="mt-0.5 text-sm leading-snug"
        moreClassName="text-[var(--pv-muted)]"
      />

      <div className="mt-1 flex items-center gap-3 text-xs text-[var(--pv-muted)]">
        <span>{formatRelativeTime(comment.date, "short")}</span>
        <button type="button" className="cursor-pointer font-semibold">
          Reply
        </button>
      </div>
    </div>

    <button
      type="button"
      aria-label="Like comment"
      className="flex w-6 shrink-0 cursor-pointer flex-col items-center gap-1 pt-1 text-[var(--pv-faint)] transition hover:text-[var(--pv-accent)]"
    >
      <Heart className="size-4" />
      {comment.likes > 0 && (
        <span className="text-[11px] tabular-nums">
          {formatCount(comment.likes)}
        </span>
      )}
    </button>
  </div>
);

/**
 * TikTok comment sheet.
 *
 * TikTok leads with the display name rather than the handle, keeps the like
 * heart in a narrow right rail, and marks the video owner with a Creator chip.
 */
export const TiktokComments = ({ data }: CommentPreviewProps) => {
  const people = usePeople(data);
  const { comments, totalCount } = data.thread;

  return (
    <PreviewSurface skin={SKIN} theme={data.appearance.theme} className="w-full">
      <PreviewCard className="rounded-xl">
        <header className="border-b border-[var(--pv-border)] py-3 text-center text-sm font-semibold">
          {formatCount(Math.max(totalCount, comments.length))} comments
        </header>

        <div className="p-4">
          {comments.length === 0 ? (
            <PreviewPlaceholder
              title="Be the first to comment"
              hint="Add comments in the Thread section."
            />
          ) : (
            <ul className="space-y-4">
              {comments.map((comment) => (
                <li key={comment.id} className="space-y-3">
                  {comment.pinned && (
                    <p className="text-xs font-semibold text-[var(--pv-accent)]">
                      Pinned
                    </p>
                  )}

                  <CommentRow
                    person={personOf(people, comment.authorId)}
                    comment={comment}
                    creator={isCreator(data, comment.authorId)}
                  />

                  {comment.replies.length > 0 && (
                    <ul className="space-y-3 pl-11">
                      {comment.replies.map((reply) => (
                        <li key={reply.id}>
                          <CommentRow
                            compact
                            person={personOf(people, reply.authorId)}
                            comment={reply}
                            creator={isCreator(data, reply.authorId)}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="flex items-center gap-2 border-t border-[var(--pv-border)] p-3">
          <div className="flex-1 rounded-lg bg-[var(--pv-subtle)] px-3 py-2 text-sm text-[var(--pv-muted)]">
            Add comment…
          </div>
        </footer>
      </PreviewCard>
    </PreviewSurface>
  );
};
