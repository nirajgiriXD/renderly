/**
 * External dependencies.
 */
import { Gift, Image, Info, Smile } from "lucide-react";

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
    subtle: "#eaedef",
    fg: "#0f1a1c",
    muted: "#5c6c74",
    faint: "#7c8b93",
    border: "#d2dadd",
    accent: "#0045ac",
    accentFg: "#ffffff",
  },
  {
    bg: "#0e1113",
    surface: "#0e1113",
    subtle: "#1a282d",
    fg: "#d7dadc",
    muted: "#8ba2ad",
    faint: "#7c8b93",
    border: "#1e2a30",
    accent: "#3a8ee6",
  }
);

const styleFor = (dark: boolean): BubbleStyle => ({
  self: { background: dark ? "#0f4c9a" : "#0045ac", color: "#ffffff" },
  other: {
    background: dark ? "#1a282d" : "#eaedef",
    color: dark ? "#d7dadc" : "#0f1a1c",
  },
  radius: "rounded-2xl",
  tail: false,
  avatars: true,
  timeInside: false,
  ticks: false,
  maxWidth: "max-w-[76%]",
});

/**
 * Reddit chat.
 *
 * Reddit titles conversations with the `u/` handle rather than a display name,
 * and uses its deep blue for outgoing bubbles.
 */
export const RedditMessages = ({ data }: MessagePreviewProps) => {
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
          title={
            identity.group
              ? identity.title
              : `u/${handle(data.users.other.username)}`
          }
          subtitle={identity.group ? identity.subtitle : identity.title}
          actions={<Info className="size-5" aria-hidden />}
        />
      }
      composer={
        <Composer
          placeholder="Message"
          leading={<Gift className="size-5 shrink-0" aria-hidden />}
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
