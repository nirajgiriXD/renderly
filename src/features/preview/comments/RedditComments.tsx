/**
 * External dependencies.
 */
import {
  ArrowBigDown,
  ArrowBigUp,
  ArrowUpDown,
  MessageSquare,
  MoreHorizontal,
  Share,
} from "lucide-react";

/**
 * Internal dependencies.
 */
import { isCreator, personOf, usePeople } from "./shared";
import type { CommentPreviewProps } from "./shared";
import { handle } from "../fallbacks";
import {
  createSkin,
  ExpandableText,
  PreviewAvatar,
  PreviewCard,
  PreviewPlaceholder,
  PreviewSurface,
} from "../primitives";
import { formatCount, formatRelativeTime } from "@/lib/format";
import type { CommentReply, Person } from "@/types";

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

const CommentBody = ({
  person,
  comment,
  op,
}: {
  person: Person;
  comment: CommentReply;
  op: boolean;
}) => (
  <>
    <div className="flex items-center gap-1.5 text-xs">
      <PreviewAvatar
        src={person.avatar}
        name={person.name}
        className="size-6"
      />
      <span className="font-semibold hover:underline">
        u/{handle(person.username)}
      </span>
      {op && (
        <span className="font-bold text-[var(--pv-accent)]">OP</span>
      )}
      <span className="text-[var(--pv-muted)]" aria-hidden>
        •
      </span>
      <span className="text-[var(--pv-muted)]">
        {formatRelativeTime(comment.date, "short")}
      </span>
    </div>

    <ExpandableText
      text={comment.text}
      limit={400}
      entities={["url", "mention"]}
      moreLabel="Read more"
      className="mt-1.5 pl-8 text-sm leading-snug"
      moreClassName="text-[var(--pv-accent)]"
    />

    <div className="mt-1 flex items-center gap-1 pl-6 text-xs text-[var(--pv-muted)]">
      <button
        type="button"
        aria-label="Upvote"
        className="group grid size-7 cursor-pointer place-items-center rounded-full transition-colors hover:bg-[#ff4500]/15"
      >
        <ArrowBigUp className="size-4 group-hover:fill-[#ff4500] group-hover:text-[#ff4500]" />
      </button>
      <span className="min-w-5 text-center font-semibold tabular-nums">
        {formatCount(comment.likes)}
      </span>
      <button
        type="button"
        aria-label="Downvote"
        className="group grid size-7 cursor-pointer place-items-center rounded-full transition-colors hover:bg-[#7193ff]/15"
      >
        <ArrowBigDown className="size-4 group-hover:fill-[#7193ff] group-hover:text-[#7193ff]" />
      </button>
      <button
        type="button"
        className="ml-1 flex cursor-pointer items-center gap-1.5 rounded-full px-2 py-1 font-semibold transition-colors hover:bg-[var(--pv-subtle)]"
      >
        <MessageSquare className="size-4" aria-hidden />
        Reply
      </button>
      <button
        type="button"
        className="flex cursor-pointer items-center gap-1.5 rounded-full px-2 py-1 font-semibold transition-colors hover:bg-[var(--pv-subtle)]"
      >
        <Share className="size-4" aria-hidden />
        Share
      </button>
      <button
        type="button"
        aria-label="More"
        className="grid size-7 cursor-pointer place-items-center rounded-full transition-colors hover:bg-[var(--pv-subtle)]"
      >
        <MoreHorizontal className="size-4" />
      </button>
    </div>
  </>
);

/**
 * Reddit comment tree.
 *
 * The defining feature is the thread line: replies are indented behind a
 * vertical rail that runs from the parent's avatar down the whole subtree.
 */
export const RedditComments = ({ data }: CommentPreviewProps) => {
  const people = usePeople(data);
  const { comments, totalCount, sort } = data.thread;

  return (
    <PreviewSurface skin={SKIN} theme={data.appearance.theme} className="w-full">
      <PreviewCard className="rounded-2xl p-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-semibold">
            {formatCount(Math.max(totalCount, comments.length))} comments
          </span>
          <button
            type="button"
            className="flex cursor-pointer items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold text-[var(--pv-muted)] transition-colors hover:bg-[var(--pv-subtle)]"
          >
            <ArrowUpDown className="size-3.5" aria-hidden />
            {sort === "top" ? "Best" : "New"}
          </button>
        </div>

        {comments.length === 0 ? (
          <PreviewPlaceholder
            title="No comments yet"
            hint="Be the first to share what you think."
          />
        ) : (
          <ul className="space-y-5">
            {comments.map((comment) => (
              <li key={comment.id}>
                <CommentBody
                  person={personOf(people, comment.authorId)}
                  comment={comment}
                  op={isCreator(data, comment.authorId)}
                />

                {comment.replies.length > 0 && (
                  <ul className="mt-3 ml-3 space-y-4 border-l border-[var(--pv-border)] pl-4">
                    {comment.replies.map((reply) => (
                      <li key={reply.id}>
                        <CommentBody
                          person={personOf(people, reply.authorId)}
                          comment={reply}
                          op={isCreator(data, reply.authorId)}
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
