/**
 * External dependencies.
 */
import { Camera, Heart, Image, Mic, Phone, Smile, Sticker, Video } from "lucide-react";

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
    subtle: "#efefef",
    fg: "#000000",
    muted: "#737373",
    faint: "#a8a8a8",
    border: "#dbdbdb",
    accent: "#0095f6",
    accentFg: "#ffffff",
  },
  {
    bg: "#000000",
    surface: "#000000",
    subtle: "#262626",
    fg: "#f5f5f5",
    muted: "#a8a8a8",
    faint: "#737373",
    border: "#262626",
  }
);

const styleFor = (dark: boolean): BubbleStyle => ({
  // Instagram fills outgoing bubbles with its purple-to-blue gradient.
  self: {
    background: "linear-gradient(100deg, #4f5bd5 0%, #962fbf 55%, #d62976 100%)",
    color: "#ffffff",
  },
  other: {
    background: dark ? "#262626" : "#efefef",
    color: dark ? "#f5f5f5" : "#000000",
  },
  radius: "rounded-[22px]",
  tail: false,
  avatars: true,
  timeInside: false,
  ticks: false,
  maxWidth: "max-w-[74%]",
});

/**
 * Instagram direct messages.
 *
 * The gradient outgoing bubble and fully rounded corners are what make an
 * Instagram DM instantly recognisable.
 */
export const InstagramMessages = ({ data }: MessagePreviewProps) => {
  const identity = useConversationIdentity(data);

  return (
    <ChatShell
      skin={SKIN}
      data={data}
      header={
        <ChatHeader
          leading={
            <BackAndAvatar
              avatar={identity.avatar}
              name={identity.title}
              size="size-9"
            />
          }
          title={identity.title}
          subtitle={
            identity.group
              ? identity.subtitle
              : `@${handle(data.users.other.username)}`
          }
          actions={
            <>
              <Phone className="size-5" aria-hidden />
              <Video className="size-6" aria-hidden />
            </>
          }
        />
      }
      composer={
        <Composer
          placeholder="Message…"
          inputClassName="border border-[var(--pv-border)] bg-transparent"
          leading={
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--pv-accent)] text-white">
              <Camera className="size-4" aria-hidden />
            </span>
          }
          trailing={
            <>
              <Smile className="-ml-24 size-5 shrink-0" aria-hidden />
              <Mic className="size-5 shrink-0" aria-hidden />
              <Image className="size-5 shrink-0" aria-hidden />
              <Sticker className="size-5 shrink-0" aria-hidden />
              <Heart className="size-5 shrink-0" aria-hidden />
            </>
          }
        />
      }
    >
      <BubbleThread data={data} style={styleFor(data.appearance.theme === "dark")} />
    </ChatShell>
  );
};
