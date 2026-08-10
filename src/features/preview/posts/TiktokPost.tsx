/**
 * External dependencies.
 */
import { Bookmark, Heart, MessageCircle, Music2, Plus, Share2 } from "lucide-react";

/**
 * Internal dependencies.
 */
import type { PostPreviewProps } from "./types";
import { handle } from "../fallbacks";
import {
  createSkin,
  ExpandableText,
  MediaFrame,
  PreviewAvatar,
  PreviewSurface,
  VerifiedBadge,
} from "../primitives";
import { formatCount } from "@/lib/format";

/** TikTok's player is always dark; only the surrounding chrome changes. */
const SKIN = createSkin(
  {
    bg: "#000000",
    surface: "#121212",
    subtle: "#1f1f1f",
    fg: "#ffffff",
    muted: "rgba(255,255,255,.75)",
    faint: "rgba(255,255,255,.5)",
    border: "rgba(255,255,255,.12)",
    accent: "#fe2c55",
    accentFg: "#ffffff",
  },
  {}
);

const RailAction = ({
  icon,
  count,
  label,
  filled = true,
}: {
  icon: React.ReactNode;
  count?: number;
  label: string;
  filled?: boolean;
}) => (
  <button
    type="button"
    aria-label={label}
    className="flex cursor-pointer flex-col items-center gap-1 transition hover:scale-105"
  >
    <span
      className={
        filled
          ? "grid size-11 place-items-center rounded-full bg-white/10 backdrop-blur-sm"
          : ""
      }
    >
      {icon}
    </span>
    {count !== undefined && (
      <span className="text-xs font-semibold tabular-nums text-white drop-shadow">
        {formatCount(count)}
      </span>
    )}
  </button>
);

/**
 * TikTok full-screen video post.
 *
 * Everything is an overlay on a 9:16 surface: the caption and sound sit
 * bottom-left, the action rail runs up the right edge, and the album art disc
 * spins at the bottom of that rail.
 */
export const TiktokPost = ({ data }: PostPreviewProps) => {
  const { author, content, metrics, appearance } = data;
  const [media] = content.media;

  return (
    <PreviewSurface
      skin={SKIN}
      theme={appearance.theme}
      className="mx-auto w-full max-w-[320px]"
    >
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-black">
        {media ? (
          <MediaFrame
            item={media}
            fit="cover"
            videoVariant="immersive"
            autoPlayVideo
            loopVideo
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 bg-[#161616] text-white/40">
            <Music2 className="size-10" aria-hidden />
            <p className="px-8 text-center text-xs">
              Add a vertical video or photo to fill the frame
            </p>
          </div>
        )}

        {/* Bottom scrim so white overlay text stays readable on light media. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 flex items-end gap-3 p-3">
          <div className="min-w-0 flex-1 space-y-1.5 text-white">
            <p className="flex items-center gap-1 text-[15px] font-bold drop-shadow">
              @{handle(author.username)}
              {author.verified && <VerifiedBadge variant="tiktok" />}
            </p>

            {content.caption.trim() && (
              <ExpandableText
                text={content.caption}
                limit={70}
                moreLabel="more"
                className="text-sm leading-snug drop-shadow"
                entityClassName="font-semibold text-white"
                moreClassName="font-semibold text-white/80"
              />
            )}

            <p className="flex items-center gap-1.5 overflow-hidden text-[13px] drop-shadow">
              <Music2 className="size-3.5 shrink-0" aria-hidden />
              <span className="truncate">
                {content.soundName || `original sound - ${handle(author.username)}`}
              </span>
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-center gap-3">
            <div className="relative mb-2">
              <PreviewAvatar
                src={author.avatar}
                name={author.name}
                className="size-11 ring-2 ring-white"
              />
              <span className="absolute -bottom-2 left-1/2 grid size-5 -translate-x-1/2 place-items-center rounded-full bg-[#fe2c55]">
                <Plus className="size-3.5 text-white" aria-hidden />
              </span>
            </div>

            <RailAction
              label="Like"
              count={metrics.reactions}
              icon={<Heart className="size-6 fill-white text-white" />}
            />
            <RailAction
              label="Comments"
              count={metrics.comments}
              icon={
                <MessageCircle className="size-6 -scale-x-100 fill-white text-white" />
              }
            />
            <RailAction
              label="Favourites"
              count={metrics.bookmarks}
              icon={<Bookmark className="size-6 fill-white text-white" />}
            />
            <RailAction
              label="Share"
              count={metrics.reposts}
              icon={<Share2 className="size-6 text-white" />}
            />

            <span className="grid size-9 animate-[spin_6s_linear_infinite] place-items-center rounded-full bg-gradient-to-br from-neutral-700 to-black p-1">
              <PreviewAvatar
                src={author.avatar}
                name={author.name}
                className="size-full"
              />
            </span>
          </div>
        </div>
      </div>
    </PreviewSurface>
  );
};
