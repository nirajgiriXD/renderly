/**
 * External dependencies.
 */
import {
  Heart,
  MessageCircleMore,
  Bookmark,
  Forward,
  Music2,
  Plus,
  Volume2,
  MoreHorizontal,
  VolumeX,
} from "lucide-react";
import { useRef, useState } from "react";

/**
 * Internal dependencies.
 */
import { UserProfile } from "@/components/custom/UserProfile";
import type { PostsConfig } from "@/types";
import { formatCount } from "@/utils";
import { TrimmedText } from "@/components/custom/TrimmedText";

export const TiktokPost = ({ data }: { data: PostsConfig }) => {
  const { author, content, metrics, appearance } = data;
  const isDark = appearance.theme === "dark";

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      // Toggle the muted property on the video element
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div
      className={`relative max-w-[300px] w-full aspect-[9/16] rounded-md overflow-hidden bg-black text-white shadow-sm sm:border ${
        isDark ? "border-gray-800" : "border-gray-200"
      }`}
    >
      {/* Background Media */}
      <div
        className="absolute inset-0 bg-gray-900 flex items-center justify-center cursor-pointer"
        onClick={togglePlay}
      >
        {content.media ? (
          content.media.startsWith("data:video") ? (
            <video
              ref={videoRef}
              src={content.media}
              className="w-full h-full object-cover"
              loop
              autoPlay
              muted={isMuted} // Controlled by state
              playsInline
            />
          ) : (
            <img
              src={content.media}
              alt="Post content"
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500">
            <Music2 className="w-12 h-12 mb-2 opacity-50" />
            <span>No Media</span>
          </div>
        )}

        {/* Top Controls (Video Only) */}
        {content.media && content.media.startsWith("data:video") && (
          <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-start z-10 bg-gradient-to-b from-black/40 to-transparent">
            {/* Volume Control */}
            <button
              className="hover:bg-white/20 hover:backdrop-blur-sm hover:bg-white/30 transition-colors p-2 rounded-full"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </button>

            {/* Settings Control */}
            <button className="hover:bg-white/20 p-2 rounded-full hover:backdrop-blur-sm hover:bg-white/30 transition-colors">
              <MoreHorizontal className="w-5 h-5 text-white" />
            </button>
          </div>
        )}
      </div>

      {/* Overlay UI */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none">
        <div className="flex items-end justify-between">
          {/* Bottom Left Info */}
          <div
            className="flex-1 mr-4 text-shadow-sm pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-bold text-base mb-2 hover:underline cursor-pointer">
              {author.username}
            </div>
            <TrimmedText
              text={content.caption}
              className="truncate w-54 text-sm"
            />
          </div>

          {/* Right Side Actions */}
          <div
            className="flex flex-col items-center gap-4 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Profile */}
            <div className="relative mb-2">
              <UserProfile
                profilePicture={author.profilePicture}
                className="w-10 h-10 rounded-full border border-white"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-500 rounded-full p-0.5">
                <Plus className="w-3 h-3 text-white" />
              </div>
            </div>

            {/* Likes */}
            <div className="flex flex-col items-center gap-1">
              <div className="bg-white/10 p-2 rounded-full backdrop-blur-sm">
                <Heart className="w-5 h-5 fill-white text-white" />
              </div>
              <span className="text-xs font-semibold">
                {formatCount(metrics.reactions)}
              </span>
            </div>

            {/* Comments */}
            <div className="flex flex-col items-center gap-1">
              <div className="bg-white/10 p-2 rounded-full backdrop-blur-sm">
                <MessageCircleMore className="w-5 h-5 fill-white text-white transform -scale-x-100" />
              </div>
              <span className="text-xs font-semibold">
                {formatCount(metrics.comments)}
              </span>
            </div>

            {/* Save */}
            <div className="flex flex-col items-center gap-1">
              <div className="bg-white/10 p-2 rounded-full backdrop-blur-sm">
                <Bookmark className="w-5 h-5 fill-white text-white" />
              </div>
              <span className="text-xs font-semibold">
                {formatCount(metrics.reactions / 10)}
              </span>
            </div>

            {/* Share */}
            <div className="flex flex-col items-center gap-1">
              <div className="bg-white/10 p-2 rounded-full backdrop-blur-sm">
                <Forward className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-semibold">
                {formatCount(metrics.reposts)}
              </span>
            </div>

            {/* Vinyl Record Animation */}
            <div className="mt-4 animate-spin-slow">
              <UserProfile
                profilePicture={author.profilePicture}
                className="w-10 h-10 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
