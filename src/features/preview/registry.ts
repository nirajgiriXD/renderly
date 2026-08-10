/**
 * External dependencies.
 */
import type { ComponentType } from "react";

/**
 * Internal dependencies.
 */
import * as ai from "./ai-chats";
import * as comments from "./comments";
import * as messages from "./messages";
import * as posts from "./posts";
import type {
  AiChatPlatform,
  CommentPlatform,
  MessagePlatform,
  PostPlatform,
} from "@/types";

/*
 * Platform → component lookup.
 *
 * `Record<Platform, …>` makes the compiler the checklist: adding a platform to
 * the union in `types/platform.ts` fails the build until a preview exists for
 * it, so a half-wired platform can never reach the UI.
 */

export const POST_PREVIEWS: Record<
  PostPlatform,
  ComponentType<posts.PostPreviewProps>
> = {
  facebook: posts.FacebookPost,
  instagram: posts.InstagramPost,
  tiktok: posts.TiktokPost,
  linkedin: posts.LinkedInPost,
  reddit: posts.RedditPost,
  twitter: posts.TwitterPost,
};

export const COMMENT_PREVIEWS: Record<
  CommentPlatform,
  ComponentType<comments.CommentPreviewProps>
> = {
  facebook: comments.FacebookComments,
  instagram: comments.InstagramComments,
  tiktok: comments.TiktokComments,
  youtube: comments.YoutubeComments,
  reddit: comments.RedditComments,
  twitter: comments.TwitterComments,
};

export const MESSAGE_PREVIEWS: Record<
  MessagePlatform,
  ComponentType<messages.MessagePreviewProps>
> = {
  whatsapp: messages.WhatsappMessages,
  messenger: messages.MessengerMessages,
  instagram: messages.InstagramMessages,
  snapchat: messages.SnapchatMessages,
  signal: messages.SignalMessages,
  tiktok: messages.TiktokMessages,
  linkedin: messages.LinkedInMessages,
  reddit: messages.RedditMessages,
  slack: messages.SlackMessages,
  discord: messages.DiscordMessages,
  "microsoft-teams": messages.TeamsMessages,
};

export const AI_CHAT_PREVIEWS: Record<
  AiChatPlatform,
  ComponentType<ai.AiChatPreviewProps>
> = {
  chatgpt: ai.ChatGptPreview,
  claude: ai.ClaudePreview,
  gemini: ai.GeminiPreview,
  grok: ai.GrokPreview,
};
