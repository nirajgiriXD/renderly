/**
 * External dependencies.
 */
import { Image, MoreHorizontal, Paperclip, Smile, Video } from "lucide-react";

/**
 * Internal dependencies.
 */
import { ChatHeader } from "./chrome";
import { useConversationIdentity } from "./identity";
import { ChatShell } from "./shell";
import type { MessagePreviewProps } from "./shell";
import { ThreadTranscript } from "./threads";
import { createSkin, PreviewAvatar } from "../primitives";

const SKIN = createSkin(
  {
    bg: "#ffffff",
    surface: "#ffffff",
    subtle: "#f3f2ef",
    fg: "rgba(0,0,0,.9)",
    muted: "rgba(0,0,0,.6)",
    faint: "rgba(0,0,0,.45)",
    border: "rgba(0,0,0,.12)",
    accent: "#0a66c2",
    accentFg: "#ffffff",
  },
  {
    bg: "#1b1f23",
    surface: "#1b1f23",
    subtle: "#2b3236",
    fg: "rgba(255,255,255,.9)",
    muted: "rgba(255,255,255,.6)",
    faint: "rgba(255,255,255,.45)",
    border: "rgba(255,255,255,.15)",
    accent: "#71b7fb",
  }
);

/**
 * LinkedIn messaging.
 *
 * LinkedIn does not use bubbles at all: the thread is a flat list of rows with
 * the sender's headline under their name, which is why it shares the workspace
 * transcript rather than the mobile bubble one.
 */
export const LinkedInMessages = ({ data }: MessagePreviewProps) => {
  const identity = useConversationIdentity(data);

  return (
    <ChatShell
      skin={SKIN}
      data={data}
      header={
        <ChatHeader
          leading={
            <PreviewAvatar
              src={identity.avatar}
              name={identity.title}
              className="size-9 shrink-0"
            />
          }
          title={identity.title}
          subtitle={
            identity.group
              ? identity.subtitle
              : data.users.other.username.trim() || "1st degree connection"
          }
          actions={
            <>
              <Video className="size-5" aria-hidden />
              <MoreHorizontal className="size-5" aria-hidden />
            </>
          }
        />
      }
      composer={
        <footer className="shrink-0 border-t border-[var(--pv-border)] bg-[var(--pv-surface)] p-3">
          <div className="rounded-lg border border-[var(--pv-border)] bg-[var(--pv-bg)] px-3 py-2 text-sm text-[var(--pv-muted)]">
            Write a message…
          </div>
          <div className="mt-2 flex items-center justify-between text-[var(--pv-muted)]">
            <div className="flex items-center gap-4">
              <Image className="size-5" aria-hidden />
              <Paperclip className="size-5" aria-hidden />
              <Smile className="size-5" aria-hidden />
            </div>
            <span className="rounded-full bg-[var(--pv-accent)] px-4 py-1 text-sm font-semibold text-[var(--pv-accent-fg)]">
              Send
            </span>
          </div>
        </footer>
      }
    >
      <ThreadTranscript
        data={data}
        style={{
          avatarShape: "circle",
          dayRule: true,
          hover: "hover:bg-[var(--pv-subtle)]",
          nameClassName: "text-sm font-semibold",
        }}
      />
    </ChatShell>
  );
};
