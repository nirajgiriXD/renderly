/**
 * External dependencies.
 */
import {
  Globe,
  MessageCircle,
  MoreHorizontal,
  Share2,
  ThumbsUp,
  BadgeCheck,
} from "lucide-react";

/**
 * Internal dependencies.
 */
import { TrimmedText } from "@/components/custom/TrimmedText";
import { UserProfile } from "@/components/custom/UserProfile";
import { FacebookVideo } from "./FacebookVideo";
import { formatCount, timeAgo } from "@/utils";
import type { PostsConfig } from "@/types";


export const FacebookPost = ({ data }: { data: PostsConfig }) => {
  const { author, content, metrics, appearance } = data;
  const isDark = appearance.theme === "dark";

  return (
    <div
      className={`max-w-md w-full rounded-xl border shadow-sm ${
        isDark
          ? "bg-[#242526] border-[#3E4042] text-[#E4E6EB]"
          : "bg-white border-gray-200 text-[#050505]"
      }`}
    >
      {/* Header */}
      <div className="p-3 pt-3 flex gap-2 items-start">
        <UserProfile
          profilePicture={author.profilePicture}
          className="size-11"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-[15px] truncate">
              {author.name}
            </span>
            {author.verificationStatus === "verified" && (
              <BadgeCheck className="w-4 h-4 fill-blue-500 text-white" />
            )}
          </div>
          <div
            className={`flex items-center gap-1 text-[13px] ${
              isDark ? "text-[#B0B3B8]" : "text-[#65676B]"
            }`}
          >
            <span>
              {timeAgo({
                date: metrics.date ? new Date(metrics.date) : new Date(),
              })}
            </span>
            <span>·</span>
            <Globe className="w-3 h-3" />
          </div>
        </div>
        <button
          className={`p-2 rounded-full hover:bg-black/5 ${
            isDark ? "hover:bg-white/10" : "hover:bg-black/5"
          }`}
        >
          <MoreHorizontal
            className={`w-5 h-5 ${
              isDark ? "text-[#B0B3B8]" : "text-[#65676B]"
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div className="px-3">
          {content.caption && (
            <p
              className={`whitespace-pre-wrap text-[15px] ${
                isDark ? "text-[#E4E6EB]" : "text-[#050505]"
              }`}
            >
              <TrimmedText text={content.caption} />
            </p>
          )}
        </div>
        {content.media && (
          <div className="w-full bg-black/5">
            {content.media.startsWith("data:image") ? (
              <img
                src={content.media}
                alt="Post content"
                className="w-full h-auto object-cover max-h-125"
              />
            ) : (
              <FacebookVideo src={content.media} />
            )}
          </div>
        )}
      </div>

      {/* Footer / Metrics */}
      <div className="px-3">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-1.5">
            <div className="bg-blue-500 p-1 rounded-full">
              <ThumbsUp className="w-3 h-3 text-white fill-white" />
            </div>
            <span
              className={`text-[15px] ${
                isDark ? "text-[#B0B3B8]" : "text-[#65676B]"
              }`}
            >
              {metrics.reactions}
            </span>
          </div>
          <div
            className={`flex gap-3 text-[15px] ${
              isDark ? "text-[#B0B3B8]" : "text-[#65676B]"
            }`}
          >
            <span>
              {formatCount(metrics.comments)} comment
              {metrics.comments > 1 ? "s" : ""}
            </span>
            <span>
              {formatCount(metrics.reposts)} share
              {metrics.reposts > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div
          className={`h-px w-full my-1 ${
            isDark ? "bg-[#3E4042]" : "bg-[#CED0D4]"
          }`}
        />

        <div className="flex items-center justify-between px-2">
          <ActionButton
            icon={ThumbsUp}
            label="Like"
            isDark={isDark}
            active={false}
          />
          <ActionButton
            icon={MessageCircle}
            label="Comment"
            isDark={isDark}
            active={false}
          />
          <ActionButton
            icon={Share2}
            label="Share"
            isDark={isDark}
            active={false}
          />
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({
  icon: Icon,
  label,
  isDark,
  active,
}: {
  icon: React.ElementType;
  label: string;
  isDark: boolean;
  active: boolean;
}) => (
  <button
    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-colors font-medium text-[15px] ${
      active
        ? "text-blue-500"
        : isDark
          ? "text-[#B0B3B8] hover:bg-[#3A3B3C]"
          : "text-[#65676B] hover:bg-[#F0F2F5]"
    }`}
  >
    <Icon className={`w-5 h-5 ${active ? "fill-blue-500" : ""}`} />
    <span>{label}</span>
  </button>
);
