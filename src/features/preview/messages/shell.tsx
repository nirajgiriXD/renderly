/**
 * External dependencies.
 */
import { Fragment } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Check, CheckCheck, Clock } from "lucide-react";

/**
 * Internal dependencies.
 */
import { useGroupedMessages } from "./grouping";
import { displayName } from "../fallbacks";
import {
  MediaFrame,
  PreviewAvatar,
  PreviewPlaceholder,
  PreviewSurface,
  RichText,
  TypingDots,
} from "../primitives";
import type { PreviewSkin } from "../primitives";
import { cn } from "@/lib/utils";
import { formatClockTime } from "@/lib/format";
import type { ChatMessage, MessagesConfig, Person } from "@/types";

export type MessagePreviewProps = {
  data: MessagesConfig;
};

/* -------------------------------------------------------------------------- */
/*                                   Shell                                    */
/* -------------------------------------------------------------------------- */

type ChatShellProps = {
  skin: PreviewSkin;
  data: MessagesConfig;
  header: ReactNode;
  composer?: ReactNode;
  /** Painted behind the messages, e.g. WhatsApp's doodle wallpaper. */
  wallpaper?: CSSProperties;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
};

/**
 * Frame shared by every messaging preview: a fixed header, a scrolling
 * transcript and an optional composer.
 */
export const ChatShell = ({
  skin,
  data,
  header,
  composer,
  wallpaper,
  className,
  bodyClassName,
  children,
}: ChatShellProps) => (
  <PreviewSurface
    skin={skin}
    theme={data.appearance.theme}
    className={cn(
      "flex w-full flex-col overflow-hidden bg-[var(--pv-bg)]",
      className
    )}
  >
    {header}

    <div
      className={cn(
        "relative flex-1 space-y-1 overflow-y-auto px-3 py-3",
        bodyClassName
      )}
      style={{ ...wallpaper, minHeight: 320, maxHeight: 560 }}
    >
      {data.conversation.messages.length === 0 ? (
        <PreviewPlaceholder
          title="No messages yet"
          hint="Add messages in the Conversation section to build the thread."
          className="my-10 bg-[var(--pv-bg)]/70"
        />
      ) : (
        children
      )}
    </div>

    {composer}
  </PreviewSurface>
);

/* -------------------------------------------------------------------------- */
/*                                  Bubbles                                   */
/* -------------------------------------------------------------------------- */

export type BubbleStyle = {
  /** Outgoing bubble colours. */
  self: { background: string; color: string };
  /** Incoming bubble colours. */
  other: { background: string; color: string };
  /** Corner radius classes for a standalone bubble. */
  radius: string;
  /** Tighten the outer corner on the run's tail, as iMessage and WhatsApp do. */
  tail: boolean;
  /** Show the other participant's avatar beside their bubbles. */
  avatars: boolean;
  /** Print the clock time inside the bubble instead of beneath it. */
  timeInside: boolean;
  /** Render delivery ticks on outgoing messages. */
  ticks: boolean;
  maxWidth?: string;
};

const StatusTicks = ({ status }: { status: ChatMessage["status"] }) => {
  if (status === "sending") return <Clock className="size-3 opacity-70" />;
  if (status === "sent") return <Check className="size-3.5 opacity-70" />;
  return (
    <CheckCheck
      className={cn("size-3.5", status === "read" ? "text-[#53bdeb]" : "opacity-70")}
    />
  );
};

type BubbleThreadProps = {
  data: MessagesConfig;
  style: BubbleStyle;
  /** Day separator pill styling, which differs per platform. */
  dayPillClassName?: string;
};

/**
 * The bubble transcript used by WhatsApp, Messenger, Instagram, Signal,
 * Snapchat, TikTok, LinkedIn and Reddit.
 *
 * These clients differ in colour, radius and whether the timestamp sits inside
 * the bubble — not in structure, which is what makes one implementation
 * viable and eight copies wasteful.
 */
export const BubbleThread = ({
  data,
  style,
  dayPillClassName,
}: BubbleThreadProps) => {
  const grouped = useGroupedMessages(data.conversation.messages);
  const isGroup = data.conversation.kind === "group";

  return (
    <>
      {grouped.map((message) => {
        const self = message.author === "self";
        const person: Person = self ? data.users.self : data.users.other;
        const palette = self ? style.self : style.other;

        return (
          <Fragment key={message.id}>
            {message.dayLabel && (
              <div className="flex justify-center py-2">
                <span
                  className={cn(
                    "rounded-full bg-[var(--pv-subtle)] px-3 py-1 text-[11px] font-medium text-[var(--pv-muted)]",
                    dayPillClassName
                  )}
                >
                  {message.dayLabel}
                </span>
              </div>
            )}

            {/*
              A column so the timestamp sits under the whole row: nesting it
              beside the bubble would stretch the flex row and drag the
              avatar down with it.
            */}
            <div
              className={cn(
                "flex flex-col",
                self ? "items-end" : "items-start",
                message.startsRun ? "pt-1.5" : "pt-0.5",
                message.reaction && style.timeInside && "pb-2.5"
              )}
            >
              <div
                className={cn(
                  "flex max-w-full items-end gap-2",
                  self && "flex-row-reverse"
                )}
              >
                {/* The avatar only appears on the last message of a run; the
                    spacer keeps earlier bubbles in the run aligned with it. */}
                {!self && style.avatars && (
                  <span className="w-7 shrink-0 self-end">
                    {message.endsRun && (
                      <PreviewAvatar
                        src={person.avatar}
                        name={person.name}
                        className="size-7 text-[10px]"
                      />
                    )}
                  </span>
                )}

                <div
                  className={cn("relative min-w-0", style.maxWidth ?? "max-w-[78%]")}
                >
                  {!self && isGroup && message.startsRun && (
                    <p className="mb-0.5 px-1 text-[11px] font-semibold text-[var(--pv-accent)]">
                      {displayName(person.name)}
                    </p>
                  )}

                  <div
                    className={cn(
                      "overflow-hidden text-[14.5px] leading-snug",
                      style.radius,
                      message.media ? "p-1" : "px-3 py-2",
                      style.tail &&
                        message.endsRun &&
                        (self ? "rounded-br-md" : "rounded-bl-md")
                    )}
                    style={palette}
                  >
                    {message.media && (
                      <div className="mb-1 overflow-hidden rounded-xl">
                        <MediaFrame
                          item={message.media}
                          fit="cover"
                          className="max-h-64 w-full"
                        />
                      </div>
                    )}

                    {message.text.trim() && (
                      <span className={cn(message.media && "block px-2 pb-1")}>
                        <RichText text={message.text} entities={["url"]} />
                      </span>
                    )}

                    {style.timeInside && (
                      <span
                        className={cn(
                          "float-right ml-2 mt-1 flex translate-y-0.5 items-center gap-1 text-[10.5px] opacity-70",
                          message.media && "mr-2"
                        )}
                      >
                        {formatClockTime(message.date || undefined)}
                        {self && style.ticks && (
                          <StatusTicks status={message.status} />
                        )}
                      </span>
                    )}
                  </div>

                  {/* Reactions hang off the bubble's lower edge; the column's
                      bottom padding reserves the space they need. */}
                  {message.reaction && (
                    <span
                      className={cn(
                        "absolute -bottom-2.5 rounded-full bg-[var(--pv-bg)] px-1 py-px text-[11px] leading-4 shadow ring-1 ring-[var(--pv-border)]",
                        self ? "right-2" : "left-2"
                      )}
                    >
                      {message.reaction}
                    </span>
                  )}
                </div>
              </div>

              {!style.timeInside && message.endsRun && (
                <p
                  className={cn(
                    "flex items-center gap-1 text-[10.5px] text-[var(--pv-faint)]",
                    // A reaction chip overhangs the bubble, so the timestamp
                    // has to clear it rather than sit underneath.
                    message.reaction ? "mt-2.5" : "mt-1",
                    !self && style.avatars ? "ps-10" : "px-1"
                  )}
                >
                  {formatClockTime(message.date || undefined)}
                  {self && style.ticks && (
                    <StatusTicks status={message.status} />
                  )}
                </p>
              )}
            </div>
          </Fragment>
        );
      })}

      {data.conversation.typing && (
        <div className="flex items-end gap-2 pt-1">
          {style.avatars && <span className="w-7 shrink-0" />}
          <span
            className={cn("inline-flex px-4 py-3", style.radius)}
            style={style.other}
          >
            <TypingDots />
          </span>
        </div>
      )}
    </>
  );
};
