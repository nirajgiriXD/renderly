/**
 * External dependencies.
 */
import {
  StickyNote,
  MessageSquare,
  MessageCircleMore,
  BotMessageSquare,
} from "lucide-react";

/**
 * Internal dependencies.
 */
import {
  Facebook,
  Instagram,
  Tiktok,
  LinkedIn,
  Reddit,
  Twitter,
  YouTube,
  Messenger,
  WhatsApp,
  Snapchat,
  Slack,
  Teams,
  Signal,
  Discord,
  OpenAI,
  Anthropic,
  Gemini,
  Grok,
} from "@/icons";

export const APP_BASENAME = "/post-preview";

export const CATEGORIES = [
  { label: "Posts", value: "posts", icon: StickyNote },
  { label: "Comments", value: "comments", icon: MessageSquare },
  { label: "Messages", value: "messages", icon: MessageCircleMore },
  { label: "AI Chat", value: "ai-chats", icon: BotMessageSquare },
];

export const APPS = {
  posts: [
    { label: "Facebook", value: "facebook", logo: Facebook },
    { label: "Instagram", value: "instagram", logo: Instagram },
    { label: "TikTok", value: "tiktok", logo: Tiktok },
    { label: "LinkedIn", value: "linkedin", logo: LinkedIn },
    { label: "Reddit", value: "reddit", logo: Reddit },
    { label: "Twitter", value: "twitter", logo: Twitter },
  ],
  comments: [
    { label: "Facebook", value: "facebook", logo: Facebook },
    { label: "Instagram", value: "instagram", logo: Instagram },
    { label: "TikTok", value: "tiktok", logo: Tiktok },
    { label: "YouTube", value: "youtube", logo: YouTube },
    { label: "Reddit", value: "reddit", logo: Reddit },
    { label: "Twitter", value: "twitter", logo: Twitter },
  ],
  messages: [
    { label: "Discord", value: "discord", logo: Discord },
    { label: "Messenger", value: "messenger", logo: Messenger },
    { label: "Instagram", value: "instagram", logo: Instagram },
    { label: "TikTok", value: "tiktok", logo: Tiktok },
    { label: "LinkedIn", value: "linkedin", logo: LinkedIn },
    { label: "Microsoft Teams", value: "microsoft-teams", logo: Teams },
    { label: "Reddit", value: "reddit", logo: Reddit },
    { label: "Signal", value: "signal", logo: Signal },
    { label: "Slack", value: "slack", logo: Slack },
    { label: "WhatsApp", value: "whatsapp", logo: WhatsApp },
    { label: "Snapchat", value: "snapchat", logo: Snapchat },
  ],
  "ai-chats": [
    { label: "ChatGPT", value: "chatgpt", logo: OpenAI },
    { label: "Gemini", value: "gemini", logo: Gemini },
    { label: "Claude", value: "claude", logo: Anthropic },
    { label: "Grok", value: "grok", logo: Grok },
  ],
};

const POST_TABS = ["apps", "author", "content", "metrics", "appearance"];
const COMMENT_TABS = ["apps", "users", "comments", "appearance"];
const MESSAGE_TABS = ["apps", "users", "conversations", "appearance"];
const AI_CHAT_TABS = ["apps", "conversations", "appearance"];

export const TABS = {
  posts: POST_TABS,
  comments: COMMENT_TABS,
  messages: MESSAGE_TABS,
  "ai-chats": AI_CHAT_TABS,
};
