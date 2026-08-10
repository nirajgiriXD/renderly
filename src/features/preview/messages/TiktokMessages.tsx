/**
 * External dependencies.
 */
import { Image, Smile } from "lucide-react";

/**
 * Internal dependencies.
 */
import { BackAndAvatar, ChatHeader, Composer } from "./chrome";
import { useConversationIdentity } from "./identity";
import { BubbleThread, ChatShell } from "./shell";
import type { BubbleStyle, MessagePreviewProps } from "./shell";
import { createSkin } from "../primitives";
import { handle } from "../fallbacks";

const SKIN = createSkin(
  {
    bg: "#ffffff",
    surface: "#ffffff",
    subtle: "#f1f1f2",
    fg: "#161823",
    muted: "rgba(22,24,35,.6)",
    faint: "rgba(22,24,35,.4)",
    border: "rgba(22,24,35,.12)",
    accent: "#fe2c55",
    accentFg: "#ffffff",
  },
  {
    bg: "#121212",
    surface: "#121212",
    subtle: "#2f2f2f",
    fg: "rgba(255,255,255,.9)",
    muted: "rgba(255,255,255,.55)",
    faint: "rgba(255,255,255,.4)",
    border: "rgba(255,255,255,.12)",
  }
);

const styleFor = (dark: boolean): BubbleStyle => ({
  self: { background: "#fe2c55", color: "#ffffff" },
  other: {
    background: dark ? "#2f2f2f" : "#f1f1f2",
    color: dark ? "rgba(255,255,255,.9)" : "#161823",
  },
  radius: "rounded-lg",
  tail: false,
  avatars: true,
  timeInside: false,
  ticks: false,
  maxWidth: "max-w-[76%]",
});

/**
 * TikTok direct messages.
 *
 * TikTok tints outgoing messages with its brand red and keeps the corners
 * comparatively square next to the other mobile messengers.
 */
export const TiktokMessages = ({ data }: MessagePreviewProps) => {
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
          subtitle={
            identity.group
              ? identity.subtitle
              : `@${handle(data.users.other.username)}`
          }
        />
      }
      composer={
        <Composer
          placeholder="Send a message…"
          inputClassName="rounded-lg"
          trailing={
            <>
              <Smile className="-ml-16 size-5 shrink-0" aria-hidden />
              <Image className="size-5 shrink-0" aria-hidden />
            </>
          }
        />
      }
    >
      <BubbleThread data={data} style={styleFor(data.appearance.theme === "dark")} />
    </ChatShell>
  );
};
