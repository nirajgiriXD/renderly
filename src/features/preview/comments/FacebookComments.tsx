/**
 * External dependencies.
 */
import { ChevronDown, MoreHorizontal, ThumbsUp } from "lucide-react";

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
import { cn } from "@/lib/utils";
import { formatCount, formatRelativeTime } from "@/lib/format";
import type { CommentReply, Person } from "@/types";

const SKIN = createSkin(
  {
    bg: "#ffffff",
    surface: "#f0f2f5",
    subtle: "#e4e6eb",
    fg: "#080809",
    muted: "#65676b",
    faint: "#8a8d91",
    border: "#ced0d4",
    accent: "#0866ff",
    accentFg: "#ffffff",
  },
  {
    bg: "#242526",
    surface: "#3a3b3c",
    subtle: "#4e4f50",
    fg: "#e4e6eb",
    muted: "#b0b3b8",
    faint: "#8a8d91",
    border: "#3e4042",
    accent: "#2d88ff",
  }
);

type BubbleProps = {
  person: Person;
  comment: CommentReply;
  creator: boolean;
  compact?: boolean;
};

/**
 * Facebook wraps the name and body together in a grey pill, then hangs the
 * Like/Reply/timestamp row underneath it in small caps-height text.
 */
const CommentBubble = ({ person, comment, creator, compact }: BubbleProps) => (
  <div className="flex gap-2">
    <PreviewAvatar
      src={person.avatar}
      name={person.name}
      className={compact ? "size-6" : "size-8"}
    />

    <div className="min-w-0 flex-1">
      <div className="group relative inline-block max-w-full">
        <div className="rounded-2xl bg-[var(--pv-surface)] px-3 py-2">
          <div className="flex items-center gap-1">
            <span className="text-[13px] font-semibold hover:underline">
              {displayName(person.name)}
            </span>
            {person.verified && <VerifiedBadge variant="facebook" />}
            {creator && (
              <span className="rounded bg-[var(--pv-subtle)] px-1 text-[10px] font-semibold text-[var(--pv-muted)]">
                Author
              </span>
            )}
          </div>
          <ExpandableText
            text={comment.text}
            limit={compact ? 160 : 240}
            moreLabel="See more"
            className="text-[15px] leading-snug"
            moreClassName="text-[var(--pv-muted)]"
          />
        </div>

        {comment.likes > 0 && (
          <span className="absolute -bottom-2 right-1 flex items-center gap-0.5 rounded-full bg-[var(--pv-bg)] px-1 py-0.5 text-[11px] text-[var(--pv-muted)] shadow ring-1 ring-[var(--pv-border)]">
            <span className="grid size-3.5 place-items-center rounded-full bg-[#0866ff]">
              <ThumbsUp className="size-2 fill-white text-white" />
            </span>
            {formatCount(comment.likes, "full")}
          </span>
        )}
      </div>

      <div className="ml-3 mt-1.5 flex items-center gap-3 text-xs font-semibold text-[var(--pv-muted)]">
        <span>{formatRelativeTime(comment.date, "short")}</span>
        <button type="button" className="cursor-pointer hover:underline">
          Like
        </button>
        <button type="button" className="cursor-pointer hover:underline">
          Reply
        </button>
        <button
          type="button"
          aria-label="More"
          className="cursor-pointer opacity-0 transition-opacity group-hover:opacity-100"
        >
          <MoreHorizontal className="size-4" />
        </button>
      </div>
    </div>
  </div>
);

export const FacebookComments = ({ data }: CommentPreviewProps) => {
  const people = usePeople(data);
  const { comments, totalCount, sort } = data.thread;

  return (
    <PreviewSurface skin={SKIN} theme={data.appearance.theme} className="w-full">
      <PreviewCard className="rounded-lg p-4">
        <div className="mb-3 flex items-center justify-between text-[15px]">
          <span className="font-semibold">
            {formatCount(Math.max(totalCount, comments.length), "full")} comment
            {totalCount === 1 ? "" : "s"}
          </span>
          <button
            type="button"
            className="flex cursor-pointer items-center gap-1 text-[13px] font-semibold text-[var(--pv-muted)]"
          >
            {sort === "top" ? "Most relevant" : "Newest"}
            <ChevronDown className="size-4" aria-hidden />
          </button>
        </div>

        {comments.length === 0 ? (
          <PreviewPlaceholder
            title="No comments yet"
            hint="Add comments in the Thread section to see them stack up here."
          />
        ) : (
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li key={comment.id} className="space-y-3">
                {comment.pinned && (
                  <p className="ml-10 text-xs font-semibold text-[var(--pv-muted)]">
                    Pinned by {displayName(data.users.creator.name)}
                  </p>
                )}

                <CommentBubble
                  person={personOf(people, comment.authorId)}
                  comment={comment}
                  creator={isCreator(data, comment.authorId)}
                />

                {comment.replies.length > 0 && (
                  <ul className={cn("space-y-3 pl-10")}>
                    {comment.replies.map((reply) => (
                      <li key={reply.id}>
                        <CommentBubble
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
      </PreviewCard>
    </PreviewSurface>
  );
};
