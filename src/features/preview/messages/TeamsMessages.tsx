/**
 * External dependencies.
 */
import { Paperclip, Send, Smile, Video, Phone, MoreHorizontal } from "lucide-react";

/**
 * Internal dependencies.
 */
import { useConversationIdentity } from "./identity";
import { ChatShell } from "./shell";
import type { MessagePreviewProps } from "./shell";
import { ThreadTranscript } from "./threads";
import { createSkin, PreviewAvatar } from "../primitives";

const SKIN = createSkin(
  {
    bg: "#ffffff",
    surface: "#f5f5f5",
    subtle: "#f0f0f0",
    fg: "#242424",
    muted: "#616161",
    faint: "#8a8a8a",
    border: "#e0e0e0",
    accent: "#5b5fc7",
    accentFg: "#ffffff",
  },
  {
    bg: "#1f1f1f",
    surface: "#292929",
    subtle: "#333333",
    fg: "#f5f5f5",
    muted: "#adadad",
    faint: "#8a8a8a",
    border: "#3d3d3d",
    accent: "#9299f7",
  }
);

/**
 * Microsoft Teams chat.
 *
 * Teams pairs a presence-badged avatar in the header with a tab strip, and its
 * composer is a bordered box with the send button on the right.
 */
export const TeamsMessages = ({ data }: MessagePreviewProps) => {
  const identity = useConversationIdentity(data);

  return (
    <ChatShell
      skin={SKIN}
      data={data}
      header={
        <header className="shrink-0 border-b border-[var(--pv-border)] bg-[var(--pv-bg)]">
          <div className="flex items-center gap-3 px-3 pt-2.5">
            <span className="relative shrink-0">
              <PreviewAvatar
                src={identity.avatar}
                name={identity.title}
                className="size-8"
              />
              <span
                className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full ring-2 ring-[var(--pv-bg)]"
                style={{
                  backgroundColor: data.conversation.online
                    ? "#6bb700"
                    : "#8a8a8a",
                }}
              />
            </span>
            <p className="min-w-0 flex-1 truncate text-[15px] font-semibold">
              {identity.title}
            </p>
            <div className="flex shrink-0 items-center gap-3 text-[var(--pv-muted)]">
              <Video className="size-5" aria-hidden />
              <Phone className="size-5" aria-hidden />
              <MoreHorizontal className="size-5" aria-hidden />
            </div>
          </div>

          <nav className="flex gap-4 px-3 text-[13px]">
            {["Chat", "Files", "Organisation"].map((tab, index) => (
              <span
                key={tab}
                className={
                  index === 0
                    ? "border-b-2 border-[var(--pv-accent)] py-2 font-semibold text-[var(--pv-accent)]"
                    : "py-2 text-[var(--pv-muted)]"
                }
              >
                {tab}
              </span>
            ))}
          </nav>
        </header>
      }
      composer={
        <footer className="shrink-0 bg-[var(--pv-bg)] p-3">
          <div className="flex items-center gap-2 rounded-lg border border-[var(--pv-border)] bg-[var(--pv-surface)] px-3 py-2 text-[var(--pv-muted)]">
            <span className="min-w-0 flex-1 truncate text-sm">
              Type a message
            </span>
            <Paperclip className="size-4 shrink-0" aria-hidden />
            <Smile className="size-4 shrink-0" aria-hidden />
            <Send className="size-4 shrink-0 text-[var(--pv-accent)]" aria-hidden />
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
