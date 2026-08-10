/**
 * External dependencies.
 */
import { AtSign, Bold, Hash, Italic, Plus, Send, Smile, Users } from "lucide-react";

/**
 * Internal dependencies.
 */
import { useConversationIdentity } from "./identity";
import { ChatShell } from "./shell";
import type { MessagePreviewProps } from "./shell";
import { ThreadTranscript } from "./threads";
import { createSkin, PreviewAvatar } from "../primitives";
import { toHandle } from "@/lib/format";

const SKIN = createSkin(
  {
    bg: "#ffffff",
    surface: "#f8f8f8",
    subtle: "#f1f1f1",
    fg: "#1d1c1d",
    muted: "#616061",
    faint: "#868686",
    border: "#e2e2e2",
    accent: "#1264a3",
    accentFg: "#ffffff",
  },
  {
    bg: "#1a1d21",
    surface: "#222529",
    subtle: "#2c2d30",
    fg: "#d1d2d3",
    muted: "#ababad",
    faint: "#868686",
    border: "#35373b",
    accent: "#78b9ff",
  }
);

/**
 * Slack channel or direct message.
 *
 * Slack squares its avatars, prefixes channels with `#`, and puts the
 * formatting toolbar inside a bordered composer box.
 */
export const SlackMessages = ({ data }: MessagePreviewProps) => {
  const identity = useConversationIdentity(data);
  const channel = identity.group
    ? `#${toHandle(identity.title).toLowerCase() || "general"}`
    : identity.title;

  return (
    <ChatShell
      skin={SKIN}
      data={data}
      header={
        <header className="flex shrink-0 items-center gap-2 border-b border-[var(--pv-border)] bg-[var(--pv-bg)] px-3 py-2.5">
          {identity.group ? (
            <Hash className="size-4 shrink-0" aria-hidden />
          ) : (
            <PreviewAvatar
              src={identity.avatar}
              name={identity.title}
              shape="rounded"
              className="size-5 shrink-0"
            />
          )}
          <p className="min-w-0 flex-1 truncate text-[15px] font-bold">
            {channel}
          </p>
          <span className="flex shrink-0 items-center gap-1 rounded border border-[var(--pv-border)] px-2 py-0.5 text-xs text-[var(--pv-muted)]">
            <Users className="size-3.5" aria-hidden />
            {identity.group ? Math.max(data.conversation.memberCount, 2) : 2}
          </span>
        </header>
      }
      composer={
        <footer className="shrink-0 bg-[var(--pv-bg)] p-3">
          <div className="rounded-lg border border-[var(--pv-border)]">
            <div className="flex items-center gap-3 border-b border-[var(--pv-border)] px-3 py-1.5 text-[var(--pv-muted)]">
              <Bold className="size-3.5" aria-hidden />
              <Italic className="size-3.5" aria-hidden />
            </div>
            <p className="px-3 py-2 text-sm text-[var(--pv-muted)]">
              Message {channel}
            </p>
            <div className="flex items-center justify-between px-3 pb-2 text-[var(--pv-muted)]">
              <div className="flex items-center gap-3">
                <Plus className="size-4" aria-hidden />
                <Smile className="size-4" aria-hidden />
                <AtSign className="size-4" aria-hidden />
              </div>
              <span className="grid size-6 place-items-center rounded bg-[#007a5a] text-white">
                <Send className="size-3" aria-hidden />
              </span>
            </div>
          </div>
        </footer>
      }
    >
      <ThreadTranscript
        data={data}
        style={{
          avatarShape: "rounded",
          dayRule: true,
          hover: "hover:bg-[var(--pv-subtle)]",
          nameClassName: "text-[15px] font-black",
        }}
      />
    </ChatShell>
  );
};
