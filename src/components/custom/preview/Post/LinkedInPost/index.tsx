/**
 * External dependencies.
 */
import {
  ThumbsUp,
  MessageSquare,
  Repeat,
  Send,
  MoreHorizontal,
  Globe,
  ShieldCheck,
  Play,
  Pause,
  Maximize,
  Volume2,
  VolumeX,
  Check,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

/**
 * Internal dependencies.
 */
import { UserProfile } from "@/components/custom/UserProfile";
import { TrimmedText } from "@/components/custom/TrimmedText";
import type { PostsConfig } from "@/types";
import { formatCount, timeAgo } from "@/utils";

export const LinkedInPost = ({ data }: { data: PostsConfig }) => {
  const { author, content, metrics, appearance } = data;
  const isDark = appearance.theme === "dark";

  return (
    <div
      className={`max-w-xl w-full rounded-xl border shadow-sm ${
        isDark
          ? "bg-[#1B1F23] text-white"
          : "bg-white border-gray-200 text-black"
      }`}
    >
      {/* Header */}
      <div className="p-3">
        <div className="flex gap-3">
          <UserProfile
            profilePicture={author.profilePicture}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm hover:underline hover:text-blue-600 cursor-pointer">
                {author.name}
              </span>
              {author.verificationStatus === "verified" && (
                <ShieldCheck
                  className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                />
              )}
              <span
                className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                • 1st
              </span>
            </div>
            <div
              className={`text-xs truncate ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              {author.jobTitle || "Professional"}
            </div>
            <div
              className={`flex items-center gap-1 text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              <span>
                {timeAgo({
                  date: metrics.date ? new Date(metrics.date) : new Date(),
                  isShortHand: true,
                })}
              </span>
              <span>•</span>
              <Globe className="w-3 h-3" />
            </div>
          </div>
          <button className="self-start p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
            <MoreHorizontal
              className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-600"}`}
            />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <TrimmedText
          maxLength={200}
          showMoreSuffix="...more"
          text={content.caption}
          className={`px-4 text-sm ${isDark ? "text-gray-100" : "text-[#191919]"}`}
        />

        {content.media && (
          <div className="w-full bg-[#FAFAFA] dark:bg-black">
            {content.media.startsWith("data:video") ? (
              <LinkedInVideo src={content.media} />
            ) : (
              <img
                src={content.media}
                alt="Post content"
                className="w-full h-auto object-contain max-h-[500px]"
              />
            )}
          </div>
        )}
      </div>

      {/* Metrics */}
      <div className="px-4 py-2">
        <div
          className={`flex items-center justify-between text-xs py-2 border-b ${isDark ? "text-gray-400 border-white/10" : "text-gray-500 border-gray-100"}`}
        >
          <div>
            {metrics.reactions > 0 && (
              <div className="flex items-center gap-1">
                <div className="flex -space-x-1">
                  <div className="rounded-full p-1 border border-muted bg-blue-400">
                    <ThumbsUp className="w-2 h-2 text-white fill-white" />
                  </div>
                  {metrics.reactions > 1 && (
                    <div className="rounded-full p-1 z-10 border border-muted bg-green-200">
                      <div className="w-2 h-2 flex items-center justify-center">
                        👏
                      </div>
                    </div>
                  )}
                  {metrics.reactions > 2 && (
                    <div className="rounded-full p-1 z-20 border border-muted bg-red-200">
                      <div className="w-2 h-2 flex items-center justify-center">
                        ❤️
                      </div>
                    </div>
                  )}
                </div>
                <span className="ml-1 hover:text-blue-600 hover:underline cursor-pointer">
                  {formatCount(metrics.reactions)}
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {metrics.comments > 0 && (
              <span className="hover:text-blue-600 hover:underline cursor-pointer">
                {formatCount(metrics.comments)} comment
                {metrics.comments > 1 ? "s" : ""}
              </span>
            )}
            {metrics.comments > 0 && metrics.reposts > 0 ? (
              <span>•</span>
            ) : null}
            {metrics.reposts > 0 && (
              <span className="hover:text-blue-600 hover:underline cursor-pointer">
                {formatCount(metrics.reposts)} repost
                {metrics.reposts > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-1">
          <ActionButton icon={ThumbsUp} label="Like" isDark={isDark} />
          <ActionButton icon={MessageSquare} label="Comment" isDark={isDark} />
          <ActionButton icon={Repeat} label="Repost" isDark={isDark} />
          <ActionButton icon={Send} label="Send" isDark={isDark} />
        </div>
      </div>
    </div>
  );
};

const LinkedInVideo = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Speed options
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
        setCurrentTime(video.currentTime);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("ended", handleEnded);
    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (videoRef.current && videoRef.current.duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.min(Math.max(x / rect.width, 0), 1);
      videoRef.current.currentTime = percentage * videoRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSpeedChange = (speed: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackRate(speed);
      setShowSpeedMenu(false);
    }
  };

  const formatTime = (time: number) => {
    if (!Number.isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      ref={containerRef}
      className={`relative group bg-black flex items-center justify-center ${
        isFullscreen ? "w-full h-full" : "w-full"
      }`}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={src}
        className={`w-full ${
          isFullscreen ? "h-screen object-contain" : "h-auto max-h-[500px]"
        }`}
        onClick={togglePlay}
      />

      {/* Controls Overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 py-3 px-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col gap-2 transition-opacity duration-200 opacity-0 group-hover:opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bar + Time/Duration (Optional, but progress is requested) */}
        <div className="flex items-center gap-2">
          {/* Play/Pause (Left) */}
          <button
            onClick={togglePlay}
            className="hover:scale-110 transition text-white"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-white" />
            ) : (
              <Play className="w-5 h-5 fill-white" />
            )}
          </button>

          {/* Progress Bar (Middle) */}
          <div
            className="flex-1 h-1 bg-white/30 rounded-full cursor-pointer relative group/progress"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-blue-400 rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full scale-0 group-hover/progress:scale-100 transition-transform" />
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center relative">
            {/* Time Display */}
            <div className="text-white text-xs font-medium mr-2 min-w-[35px] text-right">
              {formatTime(currentTime)}
            </div>

            {/* Speed Control */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSpeedMenu(!showSpeedMenu);
                }}
                className="hover:bg-white/20 p-1.5 rounded-md transition text-white font-medium text-xs w-8 text-center"
              >
                {playbackRate}x
              </button>

              {showSpeedMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-[#1B1F23] border border-gray-700 rounded-md shadow-xl overflow-hidden min-w-[100px] z-50">
                  <div className="flex flex-col py-1">
                    {speeds.map((speed) => (
                      <button
                        key={speed}
                        className={`px-3 py-2 text-left text-sm hover:bg-white/10 flex items-center justify-between ${
                          playbackRate === speed
                            ? "text-blue-400"
                            : "text-white"
                        }`}
                        onClick={(e) => handleSpeedChange(speed, e)}
                      >
                        <span>{speed}x</span>
                        {playbackRate === speed && (
                          <Check className="w-3 h-3" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mute Toggle */}
            <button
              onClick={toggleMute}
              className="hover:bg-white/20 p-1.5 rounded-md transition text-white"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="hover:bg-white/20 p-1.5 rounded-md transition text-white"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({
  icon: Icon,
  label,
  isDark,
}: {
  icon: React.ElementType;
  label: string;
  isDark: boolean;
}) => (
  <button
    className={`flex items-center gap-2 px-3 py-3 rounded-md transition-colors font-semibold text-sm ${
      isDark
        ? "text-gray-300 hover:bg-[#313335]"
        : "text-[#666666] hover:bg-gray-100"
    }`}
  >
    <Icon className={`w-5 h-5 ${isDark ? "" : "stroke-[1.5]"}`} />
    <span className="hidden sm:inline">{label}</span>
  </button>
);
