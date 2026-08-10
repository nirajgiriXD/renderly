/**
 * Internal dependencies.
 */
import {
  Anthropic,
  Discord,
  Facebook,
  Gemini,
  Grok,
  Instagram,
  LinkedIn,
  Messenger,
  OpenAI,
  Reddit,
  Signal,
  Slack,
  Snapchat,
  Teams,
  Tiktok,
  Twitter,
  WhatsApp,
  YouTube,
} from "@/icons";
import {
  AI_CHAT_PLATFORMS,
  COMMENT_PLATFORMS,
  MESSAGE_PLATFORMS,
  POST_PLATFORMS,
} from "@/types";
import type {
  AiChatPlatform,
  AnyPlatform,
  CategoryId,
  CommentPlatform,
  MessagePlatform,
  PostPlatform,
} from "@/types";

export type PlatformMeta = {
  label: string;
  logo: string;
};

/**
 * One entry per platform the app knows about, shared by every category.
 *
 * Keeping this flat (rather than per category) means Instagram is described
 * once even though it appears under posts, comments and messages.
 */
export const PLATFORMS = {
  facebook: { label: "Facebook", logo: Facebook },
  instagram: { label: "Instagram", logo: Instagram },
  tiktok: { label: "TikTok", logo: Tiktok },
  linkedin: { label: "LinkedIn", logo: LinkedIn },
  reddit: { label: "Reddit", logo: Reddit },
  twitter: { label: "X", logo: Twitter },
  youtube: { label: "YouTube", logo: YouTube },
  whatsapp: { label: "WhatsApp", logo: WhatsApp },
  messenger: { label: "Messenger", logo: Messenger },
  snapchat: { label: "Snapchat", logo: Snapchat },
  signal: { label: "Signal", logo: Signal },
  slack: { label: "Slack", logo: Slack },
  discord: { label: "Discord", logo: Discord },
  "microsoft-teams": { label: "Teams", logo: Teams },
  chatgpt: { label: "ChatGPT", logo: OpenAI },
  claude: { label: "Claude", logo: Anthropic },
  gemini: { label: "Gemini", logo: Gemini },
  grok: { label: "Grok", logo: Grok },
} as const satisfies Record<AnyPlatform, PlatformMeta>;

export const platformMeta = (platform: AnyPlatform): PlatformMeta =>
  PLATFORMS[platform];

/** Platforms offered by each category, in the order they are listed. */
export const PLATFORMS_BY_CATEGORY = {
  posts: POST_PLATFORMS,
  comments: COMMENT_PLATFORMS,
  messages: MESSAGE_PLATFORMS,
  "ai-chats": AI_CHAT_PLATFORMS,
} as const satisfies Record<CategoryId, readonly AnyPlatform[]>;

export const isPostPlatform = (value: string): value is PostPlatform =>
  (POST_PLATFORMS as readonly string[]).includes(value);

export const isCommentPlatform = (value: string): value is CommentPlatform =>
  (COMMENT_PLATFORMS as readonly string[]).includes(value);

export const isMessagePlatform = (value: string): value is MessagePlatform =>
  (MESSAGE_PLATFORMS as readonly string[]).includes(value);

export const isAiChatPlatform = (value: string): value is AiChatPlatform =>
  (AI_CHAT_PLATFORMS as readonly string[]).includes(value);

/**
 * Models offered per assistant.
 *
 * Only used as preview text — the app never calls these APIs.
 */
export const AI_MODELS = {
  chatgpt: [
    { label: "GPT-5.2", value: "GPT-5.2" },
    { label: "GPT-5.2 Thinking", value: "GPT-5.2 Thinking" },
    { label: "GPT-4o", value: "GPT-4o" },
  ],
  claude: [
    { label: "Claude Opus 4.5", value: "Claude Opus 4.5" },
    { label: "Claude Sonnet 4.5", value: "Claude Sonnet 4.5" },
    { label: "Claude Haiku 4.5", value: "Claude Haiku 4.5" },
  ],
  gemini: [
    { label: "3 Pro", value: "3 Pro" },
    { label: "3 Flash", value: "3 Flash" },
    { label: "2.5 Pro", value: "2.5 Pro" },
  ],
  grok: [
    { label: "Grok 4", value: "Grok 4" },
    { label: "Grok 4 Heavy", value: "Grok 4 Heavy" },
    { label: "Grok 3", value: "Grok 3" },
  ],
} as const satisfies Record<
  AiChatPlatform,
  readonly { label: string; value: string }[]
>;

export const defaultModelFor = (platform: AiChatPlatform) =>
  AI_MODELS[platform][0].value;
