/**
 * External dependencies.
 */
import {
  BotMessageSquare,
  Gauge,
  Globe,
  MessageCircleMore,
  MessageSquare,
  MessageSquareQuote,
  Palette,
  StickyNote,
  TextSelect,
  User,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Internal dependencies.
 */
import type { AppConfig, CategoryId } from "@/types";

export type SectionDescriptor<C extends CategoryId> = {
  id: Extract<keyof AppConfig[C], string>;
  label: string;
  icon: LucideIcon;
};

export type CategoryDescriptor<C extends CategoryId = CategoryId> = {
  id: C;
  label: string;
  /** Shown under the title in the editor header. */
  description: string;
  icon: LucideIcon;
  sections: readonly SectionDescriptor<C>[];
};

const POSTS: CategoryDescriptor<"posts"> = {
  id: "posts",
  label: "Posts",
  description: "Feed posts with captions, media and engagement counts.",
  icon: StickyNote,
  sections: [
    { id: "apps", label: "Platforms", icon: Globe },
    { id: "author", label: "Author", icon: User },
    { id: "content", label: "Content", icon: TextSelect },
    { id: "metrics", label: "Metrics", icon: Gauge },
    { id: "appearance", label: "Appearance", icon: Palette },
  ],
};

const COMMENTS: CategoryDescriptor<"comments"> = {
  id: "comments",
  label: "Comments",
  description: "Comment threads with replies, likes and creator badges.",
  icon: MessageSquare,
  sections: [
    { id: "apps", label: "Platforms", icon: Globe },
    { id: "users", label: "People", icon: Users },
    { id: "thread", label: "Thread", icon: MessageSquareQuote },
    { id: "appearance", label: "Appearance", icon: Palette },
  ],
};

const MESSAGES: CategoryDescriptor<"messages"> = {
  id: "messages",
  label: "Messages",
  description: "Direct and group chats with attachments and read receipts.",
  icon: MessageCircleMore,
  sections: [
    { id: "apps", label: "Platforms", icon: Globe },
    { id: "users", label: "People", icon: Users },
    { id: "conversation", label: "Conversation", icon: MessageSquare },
    { id: "appearance", label: "Appearance", icon: Palette },
  ],
};

const AI_CHATS: CategoryDescriptor<"ai-chats"> = {
  id: "ai-chats",
  label: "AI Chat",
  description: "Assistant transcripts with markdown, code and reasoning.",
  icon: BotMessageSquare,
  sections: [
    { id: "apps", label: "Assistants", icon: Globe },
    { id: "conversation", label: "Conversation", icon: MessageSquare },
    { id: "appearance", label: "Appearance", icon: Palette },
  ],
};

export const CATEGORIES = [POSTS, COMMENTS, MESSAGES, AI_CHATS] as const;

export const CATEGORY_MAP = {
  posts: POSTS,
  comments: COMMENTS,
  messages: MESSAGES,
  "ai-chats": AI_CHATS,
} as const;

export const sectionsFor = <C extends CategoryId>(category: C) =>
  CATEGORY_MAP[category].sections as readonly SectionDescriptor<C>[];

export const isSectionOf = <C extends CategoryId>(
  category: C,
  value: string
): value is Extract<keyof AppConfig[C], string> =>
  sectionsFor(category).some((section) => section.id === value);
