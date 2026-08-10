/**
 * External dependencies.
 */
import { AtSign, Bell, Gift, Hash, Pin, PlusCircle, Smile, Users } from "lucide-react";

/**
 * Internal dependencies.
 */
import { useConversationIdentity } from "./identity";
import { ChatShell } from "./shell";
import type { MessagePreviewProps } from "./shell";
import { ThreadTranscript } from "./threads";
import { createSkin, PreviewAvatar } from "../primitives";
import { toHandle } from "@/lib/format";

/**
 * Discord's light theme exists but is rarely used; both palettes stay in the
 * same blurple family so the preview reads as Discord either way.
 */
const SKIN = createSkin(
  {
    bg: "#ffffff",
    surface: "#f2f3f5",
    subtle: "#ebedef",
    fg: "#060607",
    muted: "#4e5058",
    faint: "#80848e",
    border: "#e3e5e8",
    accent: "#5865f2",
    accentFg: "#ffffff",
  },
  {
    bg: "#313338",
    surface: "#2b2d31",
    subtle: "#383a40",
    fg: "#dbdee1",
    muted: "#b5bac1",
    faint: "#949ba4",
    border: "#3f4147",
    accent: "#949cf7",
  }
);

/**
 * Discord channel.
 *
 * The header is a hash-prefixed channel name with a channel-actions cluster,
 * author names are tinted with their role colour, and the composer is a single
 * rounded field with a `+` on the left.
 */
export const DiscordMessages = ({ data }: MessagePreviewProps) => {
  const identity = useConversationIdentity(data);
  const channel = identity.group
    ? toHandle(identity.title).toLowerCase() || "general"
    : identity.title;

  return (
    <ChatShell
      skin={SKIN}
      data={data}
      header={
        <header className="flex shrink-0 items-center gap-2 border-b border-[var(--pv-border)] bg-[var(--pv-bg)] px-3 py-2.5 shadow-sm">
          {identity.group ? (
            <Hash className="size-5 shrink-0 text-[var(--pv-faint)]" aria-hidden />
          ) : (
            <PreviewAvatar
              src={identity.avatar}
              name={identity.title}
              className="size-6 shrink-0"
            />
          )}
          <p className="min-w-0 flex-1 truncate text-[15px] font-semibold">
            {channel}
          </p>
          <div className="flex shrink-0 items-center gap-3 text-[var(--pv-muted)]">
            <Bell className="size-5" aria-hidden />
            <Pin className="size-5" aria-hidden />
            <Users className="size-5" aria-hidden />
          </div>
        </header>
      }
      composer={
        <footer className="shrink-0 bg-[var(--pv-bg)] px-3 pb-3">
          <div className="flex items-center gap-3 rounded-lg bg-[var(--pv-subtle)] px-3 py-2.5 text-[var(--pv-muted)]">
            <PlusCircle className="size-5 shrink-0" aria-hidden />
            <span className="min-w-0 flex-1 truncate text-sm">
              Message {identity.group ? `#${channel}` : `@${channel}`}
            </span>
            <Gift className="size-5 shrink-0" aria-hidden />
            <Smile className="size-5 shrink-0" aria-hidden />
            <AtSign className="size-5 shrink-0" aria-hidden />
          </div>
        </footer>
      }
    >
      <ThreadTranscript
        data={data}
        style={{
          avatarShape: "circle",
          dayRule: true,
          hover: "hover:bg-[var(--pv-subtle)]/60",
          nameClassName: "text-[15px] font-medium text-[var(--pv-accent)]",
          bodyClassName: "text-[var(--pv-fg)]",
        }}
      />
    </ChatShell>
  );
};
