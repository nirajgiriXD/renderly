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
} from "@/icons";

export const CATEGORIES = [
  { label: "Posts", value: "posts", icon: StickyNote },
  { label: "Comments", value: "comments", icon: MessageSquare },
  { label: "Messages", value: "messages", icon: MessageCircleMore },
  { label: "AI Chats", value: "ai-chats", icon: BotMessageSquare },
];

export const APPS = {
  POSTS: [
    { label: "Facebook", value: "facebook", logo: Facebook },
    { label: "Instagram", value: "instagram", logo: Instagram },
    { label: "TikTok", value: "tiktok", logo: Tiktok },
    { label: "LinkedIn", value: "linkedin", logo: LinkedIn },
    { label: "Reddit", value: "reddit", logo: Reddit },
    { label: "Twitter", value: "twitter", logo: Twitter },
  ],
  COMMENTS: [
    { label: "Facebook", value: "facebook", logo: Facebook },
    { label: "Instagram", value: "instagram", logo: Instagram },
    { label: "TikTok", value: "tiktok", logo: Tiktok },
    { label: "YouTube", value: "youtube", logo: YouTube },
    { label: "Reddit", value: "reddit", logo: Reddit },
    { label: "Twitter", value: "twitter", logo: Twitter },
  ],
  MESSAGES: [
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
  "AI-CHATS": [
    { label: "ChatGPT", value: "chatgpt", logo: "" },
    { label: "Gemini", value: "gemini", logo: "" },
    { label: "Claude", value: "claude", logo: "" },
    { label: "Grok", value: "grok", logo: "" },
  ],
};
