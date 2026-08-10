/**
 * External dependencies.
 */
import { Camera, MoreVertical, Paperclip, Phone, Smile, Video } from "lucide-react";

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
    bg: "#efe7dd",
    surface: "#f6f5f3",
    subtle: "#e4ded7",
    fg: "#111b21",
    muted: "#667781",
    faint: "#8696a0",
    border: "#d9d3cc",
    accent: "#25d366",
    accentFg: "#ffffff",
  },
  {
    bg: "#0b141a",
    surface: "#202c33",
    subtle: "#2a3942",
    fg: "#e9edef",
    muted: "#8696a0",
    faint: "#8696a0",
    border: "#222d34",
    accent: "#00a884",
  }
);

/**
 * WhatsApp's chat wallpaper.
 *
 * The real client uses a tiled doodle texture; a soft two-tone wash keeps the
 * same warm feel without shipping a bitmap.
 */
const WALLPAPER = {
  backgroundImage:
    "radial-gradient(circle at 20% 15%, rgba(0,0,0,.03) 0 2px, transparent 2px), radial-gradient(circle at 70% 60%, rgba(0,0,0,.03) 0 2px, transparent 2px)",
  backgroundSize: "48px 48px, 64px 64px",
};

const styleFor = (dark: boolean): BubbleStyle => ({
  self: {
    background: dark ? "#005c4b" : "#d9fdd3",
    color: dark ? "#e9edef" : "#111b21",
  },
  other: {
    background: dark ? "#202c33" : "#ffffff",
    color: dark ? "#e9edef" : "#111b21",
  },
  radius: "rounded-lg",
  tail: true,
  avatars: false,
  timeInside: true,
  ticks: true,
  maxWidth: "max-w-[80%]",
});

/**
 * WhatsApp conversation.
 *
 * Signature details: the wallpapered transcript, the timestamp and delivery
 * ticks tucked inside the bubble, and blue double ticks once read.
 */
export const WhatsappMessages = ({ data }: MessagePreviewProps) => {
  const identity = useConversationIdentity(data);
  const dark = data.appearance.theme === "dark";

  return (
    <ChatShell
      skin={SKIN}
      data={data}
      wallpaper={WALLPAPER}
      header={
        <ChatHeader
          className="border-b-0"
          leading={
            <BackAndAvatar avatar={identity.avatar} name={identity.title} />
          }
          title={identity.title}
          subtitle={identity.subtitle}
          actions={
            <>
              <Video className="size-5" aria-hidden />
              <Phone className="size-[18px]" aria-hidden />
              <MoreVertical className="size-5" aria-hidden />
            </>
          }
        />
      }
      composer={
        <Composer
          className="border-t-0 bg-transparent px-2 pb-3"
          inputClassName="bg-[var(--pv-surface)] rounded-3xl px-4"
          placeholder="Type a message"
          leading={<Smile className="size-6 shrink-0" aria-hidden />}
          trailing={
            <>
              <Paperclip className="size-5 shrink-0 -rotate-45" aria-hidden />
              <Camera className="size-5 shrink-0" aria-hidden />
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--pv-accent)] text-white">
                <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden>
                  <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V22h2v-3.08A7 7 0 0 0 19 12h-2Z" />
                </svg>
              </span>
            </>
          }
        />
      }
    >
      <BubbleThread
        data={data}
        style={styleFor(dark)}
        dayPillClassName="bg-[var(--pv-surface)] shadow-sm"
      />
    </ChatShell>
  );
};
