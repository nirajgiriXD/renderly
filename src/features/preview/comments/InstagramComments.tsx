/**
 * External dependencies.
 */
import { Heart } from "lucide-react";

/**
 * Internal dependencies.
 */
import { personOf, usePeople } from "./shared";
import type { CommentPreviewProps } from "./shared";
import { handle } from "../fallbacks";
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
 * Instagram runs the handle and the comment together on one line, with the
 * like heart pinned to the right and the meta row underneath.
 */
const CommentRow = ({
  person,
  comment,
  hearted,
  compact,
}: {
  person: Person;
  comment: CommentReply;
  hearted?: boolean;
  compact?: boolean;
}) => (
  <div className="flex items-start gap-3">
    <PreviewAvatar
      src={person.avatar}
      name={person.name}
      className={compact ? "size-6" : "size-8"}
    />

    <div className="min-w-0 flex-1">
      <ExpandableText
        text={comment.text}
        limit={compact ? 90 : 140}
        moreLabel="more"
        className="text-sm leading-snug"
        moreClassName="text-[var(--pv-muted)]"
        prefix={
          <span className="mr-1.5 inline-flex items-center gap-0.5 align-baseline font-semibold">
            {handle(person.username)}
            {person.verified && <VerifiedBadge variant="instagram" />}
          </span>
        }
      />

      <div className="mt-1 flex items-center gap-3 text-xs text-[var(--pv-muted)]">
        <span>{formatRelativeTime(comment.date, "short")}</span>
        {comment.likes > 0 && (
          <button type="button" className="cursor-pointer font-semibold">
            {formatCount(comment.likes, "full")} like
            {comment.likes === 1 ? "" : "s"}
          </button>
        )}
        <button type="button" className="cursor-pointer font-semibold">
          Reply
        </button>
        {hearted && (
          <span className="inline-flex items-center gap-1 font-semibold">
            <Heart className="size-3 fill-[#ed4956] text-[#ed4956]" aria-hidden />
            Liked by creator
          </span>
        )}
      </div>
    </div>

    <button
      type="button"
      aria-label="Like comment"
      className="mt-1 cursor-pointer text-[var(--pv-muted)] transition hover:opacity-60"
    >
      <Heart className="size-3.5" />
    </button>
  </div>
);

export const InstagramComments = ({ data }: CommentPreviewProps) => {
  const people = usePeople(data);
  const { comments } = data.thread;

  return (
    <PreviewSurface skin={SKIN} theme={data.appearance.theme} className="w-full">
      <PreviewCard className="rounded-lg">
        <header className="border-b border-[var(--pv-border)] px-4 py-3 text-center text-sm font-semibold">
          Comments
        </header>

        <div className="p-4">
          {comments.length === 0 ? (
            <PreviewPlaceholder
              title="No comments yet"
              hint="Start the conversation in the Thread section."
            />
          ) : (
            <ul className="space-y-4">
              {comments.map((comment) => (
                <li key={comment.id} className="space-y-3">
                  {comment.pinned && (
                    <p className="text-xs font-semibold text-[var(--pv-muted)]">
                      Pinned comment
                    </p>
                  )}

                  <CommentRow
                    person={personOf(people, comment.authorId)}
                    comment={comment}
                    hearted={comment.hearted}
                  />

                  {comment.replies.length > 0 && (
                    <div className="space-y-3 pl-11">
                      <div className="flex items-center gap-3 text-xs font-semibold text-[var(--pv-muted)]">
                        <span className="h-px w-6 bg-[var(--pv-border)]" />
                        View replies ({comment.replies.length})
                      </div>
                      <ul className="space-y-3">
                        {comment.replies.map((reply) => (
                          <li key={reply.id}>
                            <CommentRow
                              compact
                              person={personOf(people, reply.authorId)}
                              comment={reply}
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
        </div>

        <footer className="flex items-center gap-3 border-t border-[var(--pv-border)] px-4 py-3">
          <PreviewAvatar
            src={data.users.creator.avatar}
            name={data.users.creator.name}
            className="size-7"
          />
          <span className="flex-1 text-sm text-[var(--pv-muted)]">
            Add a comment…
          </span>
        </footer>
      </PreviewCard>
    </PreviewSurface>
  );
};
