/**
 * External dependencies.
 */
import { ChevronDown, Heart, ListFilter, MoreVertical, ThumbsDown, ThumbsUp } from "lucide-react";

/**
 * Internal dependencies.
 */
import { isCreator, personOf, usePeople } from "./shared";
import type { CommentPreviewProps } from "./shared";
import { displayName, handle } from "../fallbacks";
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
    surface: "#ffffff",
    subtle: "#f2f2f2",
    fg: "#0f0f0f",
    muted: "#606060",
    faint: "#909090",
    border: "#e5e5e5",
    accent: "#065fd4",
    accentFg: "#ffffff",
  },
  {
    bg: "#0f0f0f",
    surface: "#0f0f0f",
    subtle: "#272727",
    fg: "#f1f1f1",
    muted: "#aaaaaa",
    faint: "#717171",
    border: "#303030",
    accent: "#3ea6ff",
  }
);

const CommentRow = ({
  person,
  comment,
  creator,
  hearted,
  creatorAvatar,
  creatorName,
  compact,
}: {
  person: Person;
  comment: CommentReply;
  creator: boolean;
  hearted?: boolean;
  creatorAvatar: string | null;
  creatorName: string;
  compact?: boolean;
}) => (
  <div className="flex gap-3">
    {/*
      The wrapper is sized to the avatar so the creator-heart badge anchors to
      its corner rather than to the full height of the comment row.
    */}
    <div className={cn("relative shrink-0", compact ? "size-6" : "size-10")}>
      <PreviewAvatar
        src={person.avatar}
        name={person.name}
        className="size-full"
      />
      {hearted && (
        <span className="absolute -bottom-1 -right-1 rounded-full bg-[var(--pv-bg)] p-px">
          <PreviewAvatar
            src={creatorAvatar}
            name={creatorName}
            className="size-4 text-[7px]"
          />
          <Heart className="absolute -bottom-0.5 -right-0.5 size-2.5 fill-[#ff0033] text-[#ff0033]" />
        </span>
      )}
    </div>

    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-1.5 text-[13px]">
        <span
          className={
            creator
              ? "rounded-full bg-[var(--pv-subtle)] px-2 py-0.5 font-medium"
              : "font-medium"
          }
        >
          @{handle(person.username)}
        </span>
        {person.verified && <VerifiedBadge variant="youtube" className="size-3" />}
        <span className="text-[var(--pv-muted)]">
          {formatRelativeTime(comment.date, "long")}
        </span>
      </div>

      <ExpandableText
        text={comment.text}
        limit={compact ? 180 : 260}
        moreLabel="Read more"
        lessLabel="Show less"
        className="mt-1 text-sm leading-snug"
        moreClassName="font-medium text-[var(--pv-muted)]"
      />

      <div className="mt-1.5 flex items-center gap-2 text-[var(--pv-muted)]">
        <button
          type="button"
          aria-label="Like"
          className="flex cursor-pointer items-center gap-1.5 rounded-full py-1 pr-2 text-xs transition-colors hover:text-[var(--pv-fg)]"
        >
          <ThumbsUp className="size-4" />
          {comment.likes > 0 && <span>{formatCount(comment.likes)}</span>}
        </button>
        <button
          type="button"
          aria-label="Dislike"
          className="cursor-pointer rounded-full p-1 transition-colors hover:text-[var(--pv-fg)]"
        >
          <ThumbsDown className="size-4" />
        </button>
        <button
          type="button"
          className="cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors hover:bg-[var(--pv-subtle)]"
        >
          Reply
        </button>
      </div>
    </div>

    <button
      type="button"
      aria-label="More"
      className="h-6 shrink-0 cursor-pointer text-[var(--pv-muted)]"
    >
      <MoreVertical className="size-4" />
    </button>
  </div>
);

/**
 * YouTube comment thread.
 *
 * Distinctive bits: handles rather than display names, a creator heart badge
 * layered on the avatar, a "Pinned by" line, and replies collapsed behind a
 * blue disclosure.
 */
export const YoutubeComments = ({ data }: CommentPreviewProps) => {
  const people = usePeople(data);
  const { comments, totalCount, sort } = data.thread;
  const creator = data.users.creator;

  return (
    <PreviewSurface skin={SKIN} theme={data.appearance.theme} className="w-full">
      <PreviewCard className="rounded-lg p-4">
        <div className="mb-4 flex items-center gap-6">
          <h3 className="text-base font-bold">
            {formatCount(Math.max(totalCount, comments.length), "full")} Comments
          </h3>
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2 text-sm font-medium"
          >
            <ListFilter className="size-4" aria-hidden />
            {sort === "top" ? "Top comments" : "Newest first"}
          </button>
        </div>

        {comments.length === 0 ? (
          <PreviewPlaceholder
            title="Comments are turned off"
            hint="Add comments in the Thread section to populate the list."
          />
        ) : (
          <ul className="space-y-5">
            {comments.map((comment) => (
              <li key={comment.id} className="space-y-3">
                {comment.pinned && (
                  <p className="text-xs font-medium text-[var(--pv-muted)]">
                    Pinned by {displayName(creator.name, "the creator")}
                  </p>
                )}

                <CommentRow
                  person={personOf(people, comment.authorId)}
                  comment={comment}
                  creator={isCreator(data, comment.authorId)}
                  hearted={comment.hearted}
                  creatorAvatar={creator.avatar}
                  creatorName={creator.name}
                />

                {comment.replies.length > 0 && (
                  <div className="pl-13">
                    <button
                      type="button"
                      className="mb-3 flex cursor-pointer items-center gap-2 rounded-full px-3 py-1.5 text-[13px] font-medium text-[var(--pv-accent)] transition-colors hover:bg-[var(--pv-accent)]/10"
                    >
                      <ChevronDown className="size-4" aria-hidden />
                      {comment.replies.length}{" "}
                      {comment.replies.length === 1 ? "reply" : "replies"}
                    </button>
                    <ul className="space-y-4">
                      {comment.replies.map((reply) => (
                        <li key={reply.id}>
                          <CommentRow
                            compact
                            person={personOf(people, reply.authorId)}
                            comment={reply}
                            creator={isCreator(data, reply.authorId)}
                            creatorAvatar={creator.avatar}
                            creatorName={creator.name}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </PreviewCard>
    </PreviewSurface>
  );
};
