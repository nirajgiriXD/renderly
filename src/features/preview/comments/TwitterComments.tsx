/**
 * External dependencies.
 */
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Repeat2, Upload } from "lucide-react";

/**
 * Internal dependencies.
 */
import { personOf, usePeople } from "./shared";
import type { CommentPreviewProps } from "./shared";
import { displayName, handle } from "../fallbacks";
import {
  createSkin,
  ExpandableText,
  IconAction,
  NEUTRAL_DARK,
  NEUTRAL_LIGHT,
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
  { ...NEUTRAL_LIGHT, muted: "#536471", faint: "#536471", border: "#eff3f4" },
  NEUTRAL_DARK
);

const Reply = ({
  person,
  comment,
  replyingTo,
  connected,
}: {
  person: Person;
  comment: CommentReply;
  replyingTo?: string;
  /** Draws the thread line that links a reply to the comment above it. */
  connected?: boolean;
}) => (
  <article className="flex gap-3 px-4 py-3 text-[15px] leading-5 transition-colors hover:bg-[var(--pv-subtle)]/40">
    <div className="relative flex flex-col items-center">
      {connected && (
        <span className="absolute -top-3 h-3 w-0.5 bg-[var(--pv-border)]" />
      )}
      <PreviewAvatar
        src={person.avatar}
        name={person.name}
        className="size-10"
      />
    </div>

    <div className="min-w-0 flex-1">
      <header className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-x-1">
          <span className="truncate font-bold hover:underline">
            {displayName(person.name)}
          </span>
          {person.verified && <VerifiedBadge variant="twitter" />}
          <span className="truncate text-[var(--pv-muted)]">
            @{handle(person.username)}
          </span>
          <span className="text-[var(--pv-muted)]">·</span>
          <time className="text-[var(--pv-muted)]">
            {formatRelativeTime(comment.date, "short")}
          </time>
        </div>
        <IconAction label="More" tint="blue" className="-mr-2 -mt-1 p-2">
          <MoreHorizontal className="size-4" />
        </IconAction>
      </header>

      {replyingTo && (
        <p className="text-[var(--pv-muted)]">
          Replying to{" "}
          <span className="text-[var(--pv-accent)]">@{replyingTo}</span>
        </p>
      )}

      <ExpandableText
        text={comment.text}
        limit={280}
        shortenUrls
        moreLabel="Show more"
        lessLabel="Show less"
        moreClassName="block text-[var(--pv-accent)]"
      />

      <footer className="-ml-2 mt-2 flex items-center justify-between pr-6 text-[13px] text-[var(--pv-muted)]">
        <IconAction label="Reply" tint="blue" className="pr-2">
          <span className="grid size-8 place-items-center rounded-full transition-colors group-hover/action:bg-current/10">
            <MessageCircle className="size-[18px]" />
          </span>
        </IconAction>
        <IconAction label="Repost" tint="green" className="pr-2">
          <span className="grid size-8 place-items-center rounded-full transition-colors group-hover/action:bg-current/10">
            <Repeat2 className="size-[19px]" />
          </span>
        </IconAction>
        <IconAction label="Like" tint="pink" className="pr-2">
          <span className="grid size-8 place-items-center rounded-full transition-colors group-hover/action:bg-current/10">
            <Heart className="size-[18px]" />
          </span>
          {comment.likes > 0 && (
            <span className="tabular-nums">{formatCount(comment.likes)}</span>
          )}
        </IconAction>
        <IconAction label="Bookmark" tint="blue" className="p-2">
          <Bookmark className="size-[18px]" />
        </IconAction>
        <IconAction label="Share" tint="blue" className="p-2">
          <Upload className="size-[18px]" />
        </IconAction>
      </footer>
    </div>
  </article>
);

/**
 * X reply thread.
 *
 * Replies are full posts in their own right, so each one repeats the whole
 * author line and action bar, with a "Replying to @handle" hint underneath.
 */
export const TwitterComments = ({ data }: CommentPreviewProps) => {
  const people = usePeople(data);
  const { comments } = data.thread;
  const creatorHandle = handle(data.users.creator.username);

  return (
    <PreviewSurface skin={SKIN} theme={data.appearance.theme} className="w-full">
      <PreviewCard>
        {comments.length === 0 ? (
          <div className="p-4">
            <PreviewPlaceholder
              title="No replies yet"
              hint="Add comments in the Thread section to build out the conversation."
            />
          </div>
        ) : (
          <ul className="divide-y divide-[var(--pv-border)]">
            {comments.map((comment) => (
              <li key={comment.id}>
                <Reply
                  person={personOf(people, comment.authorId)}
                  comment={comment}
                  replyingTo={creatorHandle}
                />
                {comment.replies.map((reply, index) => (
                  <div
                    key={reply.id}
                    className={cn(index === 0 && "-mt-1")}
                  >
                    <Reply
                      connected
                      person={personOf(people, reply.authorId)}
                      comment={reply}
                      replyingTo={handle(
                        personOf(people, comment.authorId).username
                      )}
                    />
                  </div>
                ))}
              </li>
            ))}
          </ul>
        )}
      </PreviewCard>
    </PreviewSurface>
  );
};
