/**
 * External dependencies.
 */
import { Camera, Plus, Phone, Sticker, Video } from "lucide-react";

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
    fg: "#111111",
    muted: "#6b6b6b",
    faint: "#8f8f8f",
    border: "#e5e5e5",
    accent: "#3a76f0",
    accentFg: "#ffffff",
  },
  {
    bg: "#1b1c1f",
    surface: "#1b1c1f",
    subtle: "#2c2c2e",
    fg: "#f5f5f5",
    muted: "#a3a3a3",
    faint: "#8f8f8f",
    border: "#2c2c2e",
    accent: "#5b8ef5",
  }
);

const styleFor = (dark: boolean): BubbleStyle => ({
  self: { background: dark ? "#2c6bed" : "#3a76f0", color: "#ffffff" },
  other: {
    background: dark ? "#2c2c2e" : "#f0f0f0",
    color: dark ? "#f5f5f5" : "#111111",
  },
  radius: "rounded-[18px]",
  tail: true,
  avatars: false,
  timeInside: true,
  ticks: true,
  maxWidth: "max-w-[78%]",
});

/**
 * Signal conversation.
 *
 * Signal keeps the interface almost entirely chrome-free: a plain header, blue
 * outgoing bubbles and the timestamp with delivery ticks inside the bubble.
 */
export const SignalMessages = ({ data }: MessagePreviewProps) => {
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
          subtitle={identity.group ? identity.subtitle : undefined}
          actions={
            <>
              <Video className="size-5" aria-hidden />
              <Phone className="size-5" aria-hidden />
            </>
          }
        />
      }
      composer={
        <Composer
          placeholder="Signal message"
          leading={<Plus className="size-6 shrink-0" aria-hidden />}
          trailing={
            <>
              <Sticker className="-ml-16 size-5 shrink-0" aria-hidden />
              <Camera className="size-5 shrink-0" aria-hidden />
            </>
          }
        />
      }
    >
      <BubbleThread data={data} style={styleFor(data.appearance.theme === "dark")} />
    </ChatShell>
  );
};
