/**
 * External dependencies.
 */
import { Fragment } from "react";

/**
 * Internal dependencies.
 */
import { useGroupedMessages } from "./grouping";
import { displayName } from "../fallbacks";
import { MediaFrame, PreviewAvatar, RichText, TypingDots } from "../primitives";
import { cn } from "@/lib/utils";
import { formatClockTime } from "@/lib/format";
import type { MessagesConfig, Person } from "@/types";

export type ThreadStyle = {
  /** Slack squares its avatars; Discord and Teams keep them round. */
  avatarShape: "circle" | "rounded";
  /** Rule between days. */
  dayRule: boolean;
  /** Row hover tint, matching each client's list behaviour. */
  hover: string;
  nameClassName?: string;
  timeClassName?: string;
  bodyClassName?: string;
};

/**
 * Flat transcript used by workspace chat and LinkedIn messaging.
 *
 * Unlike bubble clients these render one column: avatar, author, timestamp and
 * body, with consecutive messages from the same person collapsing into a run.
 */
export const ThreadTranscript = ({
  data,
  style,
}: {
  data: MessagesConfig;
  style: ThreadStyle;
}) => {
  const grouped = useGroupedMessages(data.conversation.messages);

  return (
    <div className="-mx-3 space-y-0">
      {grouped.map((message) => {
        const person: Person =
          message.author === "self" ? data.users.self : data.users.other;

        return (
          <Fragment key={message.id}>
            {message.dayLabel && (
              <div className="flex items-center gap-3 px-3 py-3">
                {style.dayRule && (
                  <span className="h-px flex-1 bg-[var(--pv-border)]" />
                )}
                <span className="rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] px-3 py-0.5 text-[11px] font-semibold text-[var(--pv-muted)]">
                  {message.dayLabel}
                </span>
                {style.dayRule && (
                  <span className="h-px flex-1 bg-[var(--pv-border)]" />
                )}
              </div>
            )}

            <div
              className={cn(
                "flex gap-3 px-3 transition-colors",
                style.hover,
                message.startsRun ? "pt-2.5 pb-0.5" : "py-0.5"
              )}
            >
              <span className="w-9 shrink-0">
                {message.startsRun ? (
                  <PreviewAvatar
                    src={person.avatar}
                    name={person.name}
                    shape={style.avatarShape}
                    className="size-9"
                  />
                ) : (
                  <span className="block text-[10px] leading-6 text-transparent">
                    {formatClockTime(message.date || undefined)}
                  </span>
                )}
              </span>

              <div className="min-w-0 flex-1">
                {message.startsRun && (
                  <p className="flex items-baseline gap-2">
                    <span
                      className={cn(
                        "truncate text-[15px] font-bold",
                        style.nameClassName
                      )}
                    >
                      {displayName(person.name)}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 text-[11px] text-[var(--pv-muted)]",
                        style.timeClassName
                      )}
                    >
                      {formatClockTime(message.date || undefined)}
                    </span>
                  </p>
                )}

                {message.media && (
                  <div className="my-1 max-w-80 overflow-hidden rounded-lg border border-[var(--pv-border)]">
                    <MediaFrame
                      item={message.media}
                      fit="cover"
                      className="max-h-64 w-full"
                    />
                  </div>
                )}

                {message.text.trim() && (
                  <p
                    className={cn(
                      "text-[15px] leading-relaxed",
                      style.bodyClassName
                    )}
                  >
                    <RichText text={message.text} entities={["url", "mention"]} />
                  </p>
                )}

                {message.reaction && (
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-[var(--pv-border)] bg-[var(--pv-subtle)] px-2 py-0.5 text-[11px]">
                    {message.reaction} <span className="tabular-nums">1</span>
                  </span>
                )}
              </div>
            </div>
          </Fragment>
        );
      })}

      {data.conversation.typing && (
        <p className="flex items-center gap-2 px-3 py-2 text-[12px] text-[var(--pv-muted)]">
          <TypingDots />
          {displayName(data.users.other.name)} is typing…
        </p>
      )}
    </div>
  );
};
