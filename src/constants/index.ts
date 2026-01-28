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
const MESSAGE_TABS = ["apps", "users", "conversation", "appearance"];
const AI_CHAT_TABS = ["apps", "conversation", "appearance"];

export const TABS = {
  posts: POST_TABS,
  comments: COMMENT_TABS,
  messages: MESSAGE_TABS,
  "ai-chats": AI_CHAT_TABS,
};

export const POSTS_CONFIG = {
  apps: {
    enableMultipleSelection: "disable",
    selectedApps: APPS.posts.reduce(
      (acc, app) => {
        {
          acc[app.value] = false;
          return acc;
        }
      },
      {} as Record<string, boolean>
    ),
  },
  author: {
    name: "",
    username: "",
    jobTitle: "",
    verificationStatus: "unverified" as "verified" | "unverified",
    profilePicture: null,
  },
  content: {
    caption: "",
    media: null,
  },
  metrics: {
    reactions: 0,
    comments: 0,
    reposts: 0,
    views: 0,
    date: "",
  },
  appearance: {
    theme: "light",
    device: "android",
  },
};

export const COMMENTS_CONFIG = {
  apps: {
    enableMultipleSelection: "disable",
    selectedApps: APPS.comments.reduce(
      (acc, app) => {
        {
          acc[app.value] = false;
          return acc;
        }
      },
      {} as Record<string, boolean>
    ),
  },
  users: {
    creator: { id: 0, name: "", username: "", profilePicture: null },
    commentors: [] as Array<{
      id: number;
      name: string;
      username: string;
      profilePicture: string | null;
    }>,
  },
  comments: {
    data: [] as Array<{
      id: number;
      text: string;
      userId: number;
      replies: Array<{ id: number; text: string; userId: number }>;
    }>,
  },
  appearance: {
    theme: "light",
    device: "android",
  },
};

export const MESSAGES_CONFIG = {
  apps: {
    enableMultipleSelection: "disable",
    selectedApps: APPS.messages.reduce(
      (acc, app) => {
        {
          acc[app.value] = false;
          return acc;
        }
      },
      {} as Record<string, boolean>
    ),
  },
  users: {
    sender: { name: "", username: "", profilePicture: null },
    receiver: { name: "", username: "", profilePicture: null },
  },
  conversation: {
    type: "single" as "single" | "group",
    messages: [] as Array<{
      id: number;
      text: string;
      sender: "self" | "other";
      media: string | null;
      date: string | null;
    }>,
  },
  appearance: {
    theme: "light",
    device: "android",
  },
};

export const AI_CHATS_CONFIG = {
  apps: {
    enableMultipleSelection: "disable",
    selectedApps: APPS["ai-chats"].reduce(
      (acc, app) => {
        {
          acc[app.value] = app.value === "chatgpt";
          return acc;
        }
      },
      {} as Record<string, boolean>
    ),
    model: "gpt-4",
  },
  conversation: {
    data: [] as Array<{
      id: number;
      text: string;
      sender: "user" | "bot";
    }>,
  },
  appearance: {
    theme: "light",
    device: "android",
  },
};

export const AI_MODELS = {
  chatgpt: [
    { label: "GPT-3.5", value: "gpt-3.5" },
    { label: "GPT-4", value: "gpt-4" },
    { label: "GPT-4 Turbo", value: "gpt-4-turbo" },
  ],
  gemini: [
    { label: "Gemini 3", value: "gemini-3" },
    { label: "Gemini Pro", value: "gemini-pro" },
  ],
  claude: [
    { label: "Claude Opus", value: "claude-opus" },
    { label: "Claude Sonet", value: "claude-sonet" },
  ],
  grok: [
    { label: "Grok Alpha", value: "grok-alpha" },
    { label: "Grok Beta", value: "grok-beta" },
  ],
};

export const DEFAULT_CONFIG = {
  posts: POSTS_CONFIG,
  comments: COMMENTS_CONFIG,
  messages: MESSAGES_CONFIG,
  "ai-chats": AI_CHATS_CONFIG,
};

export const SETTINGS = {
  saveOnLocalStorage: true,
};

export const MAX_FILE_SIZE_KB = 300;
