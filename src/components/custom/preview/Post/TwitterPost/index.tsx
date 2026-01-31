/**
 * External dependencies.
 */
import {
  MessageCircle,
  Repeat2,
  Heart,
  BarChart2,
  Share,
  MoreHorizontal,
  Bookmark,
} from "lucide-react";

/**
 * Internal dependencies.
 */
import TwitterVerifiedBadge from "@/assets/icons/twitter-verified-badge.png";
import { UserProfile } from "@/components/custom/UserProfile";
import type { PostsConfig } from "@/types";
import { formatCount, timeAgo } from "@/utils";
import { TrimmedText } from "@/components/custom/TrimmedText";

export const TwitterPost = ({ data }: { data: PostsConfig }) => {
  const { author, content, metrics, appearance } = data;
  const isDark = appearance.theme === "dark";

  return (
    <div
      className={`max-w-md w-full border-y border rounded-xl overflow-hidden hover:bg-opacity-50 transition-colors shadow-sm cursor-pointer ${
        isDark
          ? "bg-black text-white hover:bg-white/5"
          : "bg-white border-gray-200 text-black hover:bg-gray-50"
      }`}
    >
      <div className="p-3 flex gap-3">
        {/* Avatar */}
        <div className="shrink-0">
          <UserProfile
            profilePicture={author.profilePicture}
            className="w-10 h-10 rounded-full"
          />
        </div>

        {/* Content Column */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 min-w-0">
              <span className="font-bold text-[15px] truncate hover:underline">
                {author.name}
              </span>
              {author.verificationStatus === "verified" && (
                <img src={TwitterVerifiedBadge} className="size-4" />
              )}
              <span
                className={`text-[15px] truncate ${isDark ? "text-gray-500" : "text-gray-500"}`}
              >
                @{author.username}
              </span>
              <span
                className={`text-[15px] ${isDark ? "text-gray-500" : "text-gray-500"}`}
              >
                ·
              </span>
              <span
                className={`text-[15px] hover:underline ${isDark ? "text-gray-500" : "text-gray-500"}`}
              >
                {timeAgo({
                  date: metrics.date ? new Date(metrics.date) : new Date(),
                  isShortHand: true,
                })}
              </span>
            </div>
            <button
              className={`-mr-2 p-2 rounded-full hover:bg-blue-500/10 hover:text-blue-500 transition-colors ${isDark ? "text-gray-500" : "text-gray-500"}`}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Tweet Text */}
          <TrimmedText
            text={content.caption}
            maxLength={280}
            className="text-[15px] leading-normal mb-2"
          />

          {/* Media */}
          {content.media && (
            <div className="mt-2 mb-2 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
              {content.media.startsWith("data:video") ||
              !content.media.startsWith("data:image") ? (
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
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center mt-3 text-gray-500 max-w-md">
            <ActionButton
              icon={MessageCircle}
              count={metrics.comments}
              color="blue"
              label="Reply"
            />
            <ActionButton
              icon={Repeat2}
              count={metrics.reposts}
              color="green"
              label="Repost"
            />
            <ActionButton
              icon={Heart}
              count={metrics.reactions}
              color="pink"
              label="Like"
            />
            <ActionButton
              icon={BarChart2}
              count={metrics.views || 0}
              color="blue"
              label="View"
            />
            <div className="group flex items-center">
              <div className="p-2 rounded-full group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-colors">
                <Bookmark className="w-4 h-4" />
              </div>
            </div>
            <div className="group flex items-center">
              <div className="p-2 rounded-full group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-colors">
                <Share className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({
  icon: Icon,
  count,
  color,
  label,
}: {
  icon: React.ElementType;
  count: number;
  color: "blue" | "green" | "pink";
  label: string;
}) => {
  const colorClasses = {
    blue: "hover:text-blue-500 group-hover:bg-blue-500/10",
    green: "hover:text-green-500 group-hover:bg-green-500/10",
    pink: "hover:text-pink-500 group-hover:bg-pink-500/10",
  };

  return (
    <div
      className="group flex items-center gap-1 cursor-pointer transition-colors"
      title={label}
    >
      <div
        className={`p-2 rounded-full transition-colors ${colorClasses[color]}`}
      >
        <Icon className="w-4 h-4" />
      </div>
      {count > 0 && (
        <span
          className={`text-[13px] transition-colors ${color === "pink" ? "group-hover:text-pink-500" : color === "green" ? "group-hover:text-green-500" : "group-hover:text-blue-500"}`}
        >
          {formatCount(count)}
        </span>
      )}
    </div>
  );
};
