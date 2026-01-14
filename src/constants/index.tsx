/**
 * External dependencies.
 */
import {
  StickyNote,
  MessageSquare,
  MessageCircleMore,
  BotMessageSquare,
} from "lucide-react";

export const CATEGORIES = [
  { label: "Posts", value: "posts", icon: StickyNote },
  { label: "Comments", value: "comments", icon: MessageSquare },
  { label: "Messages", value: "messages", icon: MessageCircleMore },
  { label: "AI Chats", value: "ai-chats", icon: BotMessageSquare },
];

export const APPS = {
  POSTS: [
    { label: "Facebook", value: "facebook", icon: "" },
    { label: "Instagram", value: "instagram", icon: "" },
    { label: "TikTok", value: "tiktok", icon: "" },
    { label: "LinkedIn", value: "linkedin", icon: "" },
    { label: "Reddit", value: "reddit", icon: "" },
    { label: "X", value: "x", icon: "" },
  ],
  COMMENTS: [
    { label: "Facebook", value: "facebook", icon: "" },
    { label: "Instagram", value: "instagram", icon: "" },
    { label: "TikTok", value: "tiktok", icon: "" },
    { label: "YouTube", value: "youtube", icon: "" },
    { label: "X", value: "x", icon: "" },
  ],
  MESSAGES: [
    { label: "Discord", value: "discord", icon: "" },
    { label: "iMessage", value: "imessage", icon: "" },
    { label: "Messenger", value: "messenger", icon: "" },
    { label: "Instagram", value: "instagram", icon: "" },
    { label: "TikTok", value: "tiktok", icon: "" },
    { label: "LinkedIn", value: "linkedin", icon: "" },
    { label: "Microsoft Teams", value: "microsoft-teams", icon: "" },
    { label: "Reddit", value: "reddit", icon: "" },
    { label: "Signal", value: "signal", icon: "" },
    { label: "Slack", value: "slack", icon: "" },
    { label: "WhatsApp", value: "whatsapp", icon: "" },
    { label: "Snapchat", value: "snapchat", icon: "" },
  ],
  "AI-CHATS": [
    { label: "ChatGPT", value: "chatgpt", icon: "" },
    { label: "Gemini", value: "gemini", icon: "" },
    { label: "Claude", value: "claude", icon: "" },
    { label: "Grok", value: "grok", icon: "" },
  ],
};
