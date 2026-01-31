/**
 * External dependencies.
 */
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  BadgeCheck,
} from "lucide-react";

/**
 * Internal dependencies.
 */
import { UserProfile } from "@/components/custom/UserProfile";
import type { PostsConfig } from "@/types";
import { formatCount, timeAgo } from "@/utils";
import { TrimmedText } from "@/components/custom/TrimmedText";

export const InstagramPost = ({ data }: { data: PostsConfig }) => {
  const { author, content, metrics, appearance } = data;
  const isDark = appearance.theme === "dark";

  return (
    <div
      className={`max-w-md w-full rounded-xl border shadow-sm overflow-hidden ${
        isDark ? "bg-black text-white" : "bg-white border-gray-200 text-black"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <UserProfile
            profilePicture={author.profilePicture}
            className="w-8 h-8 rounded-full ring-1 ring-gray-200 p-[1px]"
          />
          <div className="flex items-center gap-1">
            <span className="font-semibold text-sm">{author.username}</span>
            {author.verificationStatus === "verified" && (
              <BadgeCheck className="w-3.5 h-3.5 fill-blue-500 text-white" />
            )}
            <span
              className={`text-[10px] uppercase ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              •
            </span>
            <span
              className={`text-[10px] ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              {timeAgo({
                date: metrics.date ? new Date(metrics.date) : new Date(),
                isShortHand: true,
              })}
            </span>
          </div>
        </div>
        <button>
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="w-full bg-black/5">
        {content.media ? (
          content.media.startsWith("data:video") ? (
            <video
              src={content.media}
              className="w-full h-auto object-cover max-h-[500px]"
              controls
            />
          ) : (
            <img
              src={content.media}
              alt="Post content"
              className="w-full h-auto object-cover max-h-[500px]"
            />
          )
        ) : (
          <div className="w-full aspect-square bg-gray-100 flex items-center justify-center text-gray-400">
            No media
          </div>
        )}
      </div>

      {/* Footer / Actions */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="hover:opacity-60 transition-opacity flex items-center gap-2 font-semibold">
              <Heart className="w-6 h-6" />
              {formatCount(metrics.reactions)}
            </button>
            <button className="hover:opacity-60 transition-opacity flex items-center gap-2 font-semibold">
              <MessageCircle className="w-6 h-6 -rotate-90" />
              {formatCount(metrics.comments)}
            </button>
            <button className="hover:opacity-60 transition-opacity">
              <Send className="w-6 h-6" />
            </button>
          </div>
          <button className="hover:opacity-60 transition-opacity">
            <Bookmark className="w-6 h-6" />
          </button>
        </div>

        {/* Caption */}
        {content.caption && (
          <div className="text-sm">
            <span className="font-semibold mr-2">{author.username}</span>
            <TrimmedText text={content.caption} className="inline" />
          </div>
        )}
      </div>
    </div>
  );
};
