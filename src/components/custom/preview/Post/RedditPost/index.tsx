import {
  ArrowBigUp,
  ArrowBigDown,
  MessageCircle,
  Share,
  MoreHorizontal,
} from "lucide-react";

/**
 * Internal dependencies.
 */
import { UserProfile } from "@/components/custom/UserProfile";
import type { PostsConfig } from "@/types";
import { formatCount, timeAgo } from "@/utils";
import { TrimmedText } from "@/components/custom/TrimmedText";
import { RedditVideo } from "./RedditVideo";

export const RedditPost = ({ data }: { data: PostsConfig }) => {
  const { author, content, metrics, appearance } = data;
  const isDark = appearance.theme === "dark";

  return (
    <div
      className={`max-w-[700px] w-full rounded-2xl shadow-sm border overflow-hidden ${
        isDark
          ? "bg-[#0B1416] text-[#D7DADC]"
          : "bg-white text-[#222222] border-gray-200"
      }`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs">
            <UserProfile
              profilePicture={author.profilePicture}
              className="size-8"
            />
            <div className="flex items-center gap-1">
              <span className="font-medium text-muted-foreground">
                r/{author.username}
              </span>
              <span className="text-[#818384]">•</span>
              <span className="text-[#818384]">
                {timeAgo({
                  date: metrics.date ? new Date(metrics.date) : new Date(),
                })}
              </span>
            </div>
          </div>
          <button className="text-[#818384] hover:bg-white/5 p-1 rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Title */}
        <h3
          className={`text-xl font-bold mb-2 ${
            isDark ? "text-[#D7DADC]" : "text-[#1A1A1B]"
          }`}
        >
          {content.caption ? (
            <TrimmedText
              text={content.caption.split("\n")[0]}
              maxLength={100}
              className="inline"
            />
          ) : (
            "Post Title"
          )}
        </h3>

        {/* Body Text (if caption has more lines) */}
        {content.caption && content.caption.includes("\n") && (
          <TrimmedText
            text={content.caption.split("\n").slice(1).join("\n")}
            maxLength={200}
            trimOnNewline={false}
            className={`text-sm mb-3 ${isDark ? "text-[#D7DADC]" : "text-[#222222]"}`}
          />
        )}

        {/* Media Container */}
        {content.media && (
          <div className="w-full mb-2 rounded-lg overflow-hidden">
            {content.media.startsWith("data:video") ? (
              <RedditVideo src={content.media} />
            ) : (
              <img
                src={content.media}
                alt="Post content"
                className="w-full h-auto max-h-[600px] object-contain mx-auto"
              />
            )}
          </div>
        )}

        {/* Footer Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Vote Pill */}
          <div
            className={`flex items-center rounded-full ${
              isDark ? "bg-[#1A282D]" : "bg-[#F2F4F5]"
            }`}
          >
            <button
              className={`p-1.5 hover:bg-muted-foreground/5 rounded-full group transition-colors ${isDark ? "hover:bg-muted-foreground/50" : "hover:bg-muted-foreground/5"}`}
            >
              <ArrowBigUp className="w-4 h-4 group-hover:text-[#FF4500]" />
            </button>
            <span className="text-sm font-medium tabular-nums">
              {formatCount(metrics.reactions)}
            </span>
            <button
              className={`p-1.5 hover:bg-muted-foreground/5 rounded-full group transition-colors ${isDark ? "hover:bg-muted-foreground/50" : "hover:bg-muted-foreground/5"}`}
            >
              <ArrowBigDown className="w-4 h-4 group-hover:text-[#7193FF]" />
            </button>
          </div>

          {/* Comment Pill */}
          <button
            className={`${
              isDark
                ? "bg-[#1A282D] hover:bg-muted-foreground/50"
                : "bg-[#F2F4F5] hover:bg-muted-foreground/5"
            } flex items-center gap-2 px-3 py-2 rounded-full transition-colors font-medium text-sm`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{formatCount(metrics.comments)}</span>
          </button>

          {/* Share Pill */}
          <button
            className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors font-bold text-sm ${
              isDark
                ? "bg-[#1A282D] hover:bg-muted-foreground/50"
                : "bg-[#F2F4F5] hover:bg-muted-foreground/5"
            }`}
          >
            <Share className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};
