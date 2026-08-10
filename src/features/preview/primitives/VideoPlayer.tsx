/**
 * External dependencies.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize2, Pause, Play, Volume2, VolumeX } from "lucide-react";

/**
 * Internal dependencies.
 */
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/format";

export type VideoVariant =
  /** Facebook / LinkedIn / Reddit: a control bar that fades in on hover. */
  | "feed"
  /** TikTok / Reels: tap to play, minimal chrome, hairline progress. */
  | "immersive";

type VideoPlayerProps = {
  src: string;
  poster?: string;
  variant?: VideoVariant;
  className?: string;
  /** Autoplay muted, as vertical video feeds do. */
  autoPlay?: boolean;
  loop?: boolean;
  /** Progress bar colour. Defaults to the platform accent. */
  accentClassName?: string;
};

/**
 * The single video implementation shared by every preview.
 *
 * Previously each platform shipped its own copy of the same play/seek/mute
 * logic; the differences between them are entirely presentational, which is
 * what `variant` captures.
 */
export const VideoPlayer = ({
  src,
  poster,
  variant = "feed",
  className,
  autoPlay = false,
  loop = false,
  accentClassName,
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [playing, setPlaying] = useState(autoPlay);
  const [muted, setMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [failed, setFailed] = useState(false);

  // Re-arm the player when the file is swapped out from under it. Done during
  // render rather than in an effect so the new clip never inherits the old
  // one's progress or error state for a frame.
  const [lastSrc, setLastSrc] = useState(src);
  if (lastSrc !== src) {
    setLastSrc(src);
    setFailed(false);
    setCurrentTime(0);
    setDuration(0);
    setPlaying(autoPlay);
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTime = () => setCurrentTime(video.currentTime);
    const onMeta = () =>
      setDuration(Number.isFinite(video.duration) ? video.duration : 0);
    const onEnded = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onError = () => setFailed(true);

    video.addEventListener("timeupdate", onTime);
    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("ended", onEnded);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("error", onError);

    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("error", onError);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    // `play()` rejects when autoplay is blocked; the pause state stays honest.
    if (video.paused) void video.play().catch(() => setPlaying(false));
    else video.pause();
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }, []);

  const seek = useCallback((ratio: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    video.currentTime = Math.min(Math.max(ratio, 0), 1) * video.duration;
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (failed) {
    return (
      <div
        className={cn(
          "flex aspect-video w-full items-center justify-center bg-[var(--pv-subtle)] px-4 text-center text-xs text-[var(--pv-muted)]",
          className
        )}
      >
        This video could not be decoded by your browser.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("group relative overflow-hidden bg-black", className)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted={muted}
        loop={loop}
        autoPlay={autoPlay}
        playsInline
        preload="metadata"
        className={cn(
          "size-full",
          variant === "immersive" ? "object-cover" : "object-contain"
        )}
        onClick={togglePlay}
      />

      {/* Tap target + centred play glyph while paused. */}
      <button
        type="button"
        onClick={togglePlay}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute inset-0 flex cursor-pointer items-center justify-center"
      >
        {!playing && (
          <span className="grid size-14 place-items-center rounded-full bg-black/45 backdrop-blur-sm">
            <Play className="size-6 translate-x-px fill-white text-white" />
          </span>
        )}
      </button>

      {variant === "immersive" ? (
        <>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Unmute video" : "Mute video"}
            className="absolute right-2 top-2 grid size-8 cursor-pointer place-items-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
          >
            {muted ? (
              <VolumeX className="size-4" />
            ) : (
              <Volume2 className="size-4" />
            )}
          </button>
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/25">
            <div
              className="h-full bg-white/90 transition-[width] duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </>
      ) : (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-8 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="pointer-events-auto flex items-center gap-3 text-white">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Pause video" : "Play video"}
              className="cursor-pointer transition hover:scale-110"
            >
              {playing ? (
                <Pause className="size-4 fill-white" />
              ) : (
                <Play className="size-4 fill-white" />
              )}
            </button>

            <input
              type="range"
              min={0}
              max={1000}
              value={Math.round(progress * 10)}
              aria-label="Seek"
              onChange={(event) => seek(Number(event.target.value) / 1000)}
              className={cn(
                "h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/30 accent-[var(--pv-accent)]",
                accentClassName
              )}
              style={{
                background: `linear-gradient(to right, currentColor ${progress}%, rgba(255,255,255,.3) ${progress}%)`,
              }}
            />

            <span className="min-w-10 text-right text-[11px] tabular-nums">
              {formatDuration(Math.max(duration - currentTime, 0))}
            </span>

            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? "Unmute video" : "Mute video"}
              className="cursor-pointer transition hover:scale-110"
            >
              {muted ? (
                <VolumeX className="size-4" />
              ) : (
                <Volume2 className="size-4" />
              )}
            </button>

            <button
              type="button"
              aria-label="Enter fullscreen"
              onClick={() => void containerRef.current?.requestFullscreen?.()}
              className="cursor-pointer transition hover:scale-110"
            >
              <Maximize2 className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
