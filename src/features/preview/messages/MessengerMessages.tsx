/**
 * External dependencies.
 */
import { Camera, Image, Info, Mic, Phone, Plus, Smile, ThumbsUp, Video } from "lucide-react";

/**
 * Internal dependencies.
 */
import { BackAndAvatar, ChatHeader, Composer } from "./chrome";
import { useConversationIdentity } from "./identity";
import { BubbleThread, ChatShell } from "./shell";
import type { BubbleStyle, MessagePreviewProps } from "./shell";
import { createSkin } from "../primitives";

const SKIN = createSkin(
  {
    bg: "#ffffff",
    surface: "#ffffff",
    subtle: "#f0f0f0",
    fg: "#050505",
    muted: "#65676b",
    faint: "#8a8d91",
    border: "#e4e6eb",
    accent: "#0084ff",
    accentFg: "#ffffff",
  },
  {
    bg: "#000000",
    surface: "#000000",
    subtle: "#303030",
    fg: "#e4e6eb",
    muted: "#b0b3b8",
    faint: "#8a8d91",
    border: "#242526",
  }
);

const styleFor = (dark: boolean): BubbleStyle => ({
  self: { background: "#0084ff", color: "#ffffff" },
  other: {
    background: dark ? "#303030" : "#f0f0f0",
    color: dark ? "#e4e6eb" : "#050505",
  },
  radius: "rounded-[18px]",
  tail: true,
  avatars: true,
  timeInside: false,
  ticks: false,
  maxWidth: "max-w-[72%]",
});

/**
 * Messenger conversation.
 *
 * Messenger keeps the solid blue outgoing bubble, shows the recipient's small
 * avatar on the last message of each run, and parks a thumbs-up shortcut at
 * the end of the composer.
 */
export const MessengerMessages = ({ data }: MessagePreviewProps) => {
  const identity = useConversationIdentity(data);

  return (
    <ChatShell
      skin={SKIN}
      data={data}
      header={
        <ChatHeader
          leading={
            <BackAndAvatar avatar={identity.avatar} name={identity.title} />
          }
          title={identity.title}
          subtitle={identity.subtitle}
          className="text-[var(--pv-accent)] [&_p:first-child]:text-[var(--pv-fg)]"
          actions={
            <>
              <Phone className="size-5 text-[var(--pv-accent)]" aria-hidden />
              <Video className="size-5 text-[var(--pv-accent)]" aria-hidden />
              <Info className="size-5 text-[var(--pv-accent)]" aria-hidden />
            </>
          }
        />
      }
      composer={
        <Composer
          placeholder="Aa"
          leading={
            <>
              <Plus className="size-6 shrink-0 text-[var(--pv-accent)]" aria-hidden />
              <Camera className="size-6 shrink-0 text-[var(--pv-accent)]" aria-hidden />
              <Image className="size-6 shrink-0 text-[var(--pv-accent)]" aria-hidden />
              <Mic className="size-6 shrink-0 text-[var(--pv-accent)]" aria-hidden />
            </>
          }
          trailing={
            <>
              <Smile className="-ml-9 size-5 shrink-0" aria-hidden />
              <ThumbsUp
                className="size-6 shrink-0 fill-current text-[var(--pv-accent)]"
                aria-hidden
              />
            </>
          }
        />
      }
    >
      <BubbleThread data={data} style={styleFor(data.appearance.theme === "dark")} />
    </ChatShell>
  );
};
