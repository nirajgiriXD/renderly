/**
 * Every content category the app can preview, and the platforms supported
 * inside each one.
 *
 * These `as const` tuples are the single source of truth: platform unions,
 * default configs, the app registry and the preview registry are all derived
 * from them, so adding a platform is a matter of adding one entry here and one
 * preview component.
 */
export const CATEGORY_IDS = [
  "posts",
  "comments",
  "messages",
  "ai-chats",
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export const POST_PLATFORMS = [
  "facebook",
  "instagram",
  "tiktok",
  "linkedin",
  "reddit",
  "twitter",
] as const;

export const COMMENT_PLATFORMS = [
  "facebook",
  "instagram",
  "tiktok",
  "youtube",
  "reddit",
  "twitter",
] as const;

export const MESSAGE_PLATFORMS = [
  "whatsapp",
  "messenger",
  "instagram",
  "snapchat",
  "signal",
  "tiktok",
  "linkedin",
  "reddit",
  "slack",
  "discord",
  "microsoft-teams",
] as const;

export const AI_CHAT_PLATFORMS = ["chatgpt", "claude", "gemini", "grok"] as const;

export type PostPlatform = (typeof POST_PLATFORMS)[number];
export type CommentPlatform = (typeof COMMENT_PLATFORMS)[number];
export type MessagePlatform = (typeof MESSAGE_PLATFORMS)[number];
export type AiChatPlatform = (typeof AI_CHAT_PLATFORMS)[number];

/** Maps a category to the platform union that category accepts. */
export type PlatformOf<C extends CategoryId> = C extends "posts"
  ? PostPlatform
  : C extends "comments"
    ? CommentPlatform
    : C extends "messages"
      ? MessagePlatform
      : AiChatPlatform;

export type AnyPlatform =
  | PostPlatform
  | CommentPlatform
  | MessagePlatform
  | AiChatPlatform;
