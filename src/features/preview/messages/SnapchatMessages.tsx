/**
 * External dependencies.
 */
import { Fragment } from "react";
import { Camera, ChevronLeft, Phone, Smile, Video } from "lucide-react";

/**
 * Internal dependencies.
 */
import { useConversationIdentity } from "./identity";
import { ChatShell } from "./shell";
import { useGroupedMessages } from "./grouping";
import type { MessagePreviewProps } from "./shell";
import { ChatHeader, Composer } from "./chrome";
import { displayName } from "../fallbacks";
import { createSkin, MediaFrame, PreviewAvatar, RichText } from "../primitives";
import { cn } from "@/lib/utils";
import { formatClockTime } from "@/lib/format";
import type { MessagesConfig } from "@/types";

const SKIN = createSkin(
  {
    bg: "#ffffff",
    surface: "#ffffff",
    subtle: "#f2f2f2",
    fg: "#000000",
    muted: "#8a8a8f",
    faint: "#b0b0b5",
    border: "#e5e5e5",
    accent: "#0fadff",
    accentFg: "#ffffff",
  },
  {
    bg: "#000000",
    surface: "#0d0d0d",
    subtle: "#1c1c1e",
    fg: "#ffffff",
    muted: "#8a8a8f",
    faint: "#6b6b70",
    border: "#1c1c1e",
  }
);

/**
 * Snapchat chat.
 *
 * Snapchat is the outlier in this set: there are no bubbles. Each message is a
 * left-aligned row prefixed by a coloured status bar — blue for the person you
 * are talking to, red for you — with the sender's name above it in small caps.
 */
export const SnapchatMessages = ({ data }: MessagePreviewProps) => {
  const identity = useConversationIdentity(data);

  return (
    <ChatShell
      skin={SKIN}
      data={data}
      bodyClassName="px-0"
      header={
        <ChatHeader
          className="border-b-0"
          leading={
            <>
              <ChevronLeft className="-ml-1 size-5 shrink-0" aria-hidden />
              <PreviewAvatar
                src={identity.avatar}
                name={identity.title}
                className="size-8 shrink-0 bg-[#fffc00] text-black"
              />
            </>
          }
          title={identity.title}
          subtitle={identity.group ? identity.subtitle : undefined}
          actions={
            <>
              <Phone className="size-5" aria-hidden />
              <Video className="size-5" aria-hidden />
            </>
          }
        />
      }
      composer={
        <Composer
          className="border-t-0"
          placeholder="Send a chat"
          leading={
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#fffc00] text-black">
              <Camera className="size-4" aria-hidden />
            </span>
          }
          trailing={<Smile className="-ml-14 size-5 shrink-0" aria-hidden />}
        />
      }
    >
      <ChatRows data={data} />
    </ChatShell>
  );
};

const ChatRows = ({ data }: { data: MessagesConfig }) => {
  const grouped = useGroupedMessages(data.conversation.messages);

  return (
    <div className="space-y-2 py-1">
      {grouped.map((message) => {
        const self = message.author === "self";
        const person = self ? data.users.self : data.users.other;
        // Snapchat colours you red and everyone else blue.
        const accent = self ? "#f23c57" : "#00b3ff";

        return (
          <Fragment key={message.id}>
            {message.dayLabel && (
              <p className="py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-[var(--pv-muted)]">
                {message.dayLabel}
              </p>
            )}

            <div className="flex gap-2 px-3">
              <span
                className="mt-0.5 w-[3px] shrink-0 rounded-full"
                style={{ backgroundColor: accent }}
              />
              <div className="min-w-0 flex-1">
                {message.startsRun && (
                  <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-[var(--pv-muted)]">
                    {displayName(person.name, self ? "Me" : "Them")}
                    <span className="font-medium normal-case tracking-normal">
                      {formatClockTime(message.date || undefined)}
                    </span>
                  </p>
                )}

                {message.media && (
                  <div className="my-1 max-w-52 overflow-hidden rounded-lg">
                    <MediaFrame
                      item={message.media}
                      fit="cover"
                      className="aspect-[9/16] w-full"
                    />
                  </div>
                )}

                {message.text.trim() && (
                  <p
                    className={cn(
                      "text-[15px] leading-snug",
                      self ? "font-semibold" : "font-medium"
                    )}
                  >
                    <RichText text={message.text} entities={["url"]} />
                  </p>
                )}

                {message.reaction && (
                  <span className="text-sm">{message.reaction}</span>
                )}
              </div>
            </div>
          </Fragment>
        );
      })}

      {data.conversation.typing && (
        <p className="px-3 text-[11px] font-bold uppercase tracking-wide text-[var(--pv-muted)]">
          {displayName(data.users.other.name, "Them")} is typing…
        </p>
      )}
    </div>
  );
};
