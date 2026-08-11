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
  /** One line on what the section is for, shown under the inspector title. */
  summary: string;
  icon: LucideIcon;
};

export type CategoryDescriptor<C extends CategoryId = CategoryId> = {
  id: C;
  label: string;
  /** Shown under the title in the inspector header. */
  description: string;
  icon: LucideIcon;
  sections: readonly SectionDescriptor<C>[];
};

/*
 * `appearance` is deliberately absent from every section list.
 *
 * Theme, device and frame describe how the *canvas* renders what you have
 * written, not the content itself, so they live on the canvas toolbar beside
 * the thing they change. The config still stores them exactly as before —
 * only the place you reach them moved.
 */

const POSTS: CategoryDescriptor<"posts"> = {
  id: "posts",
  label: "Posts",
  description: "Feed posts with captions, media and engagement counts.",
  icon: StickyNote,
  sections: [
    {
      id: "apps",
      label: "Platforms",
      summary: "Choose which feeds to render this post in.",
      icon: Globe,
    },
    {
      id: "author",
      label: "Author",
      summary: "The account the post is published from.",
      icon: User,
    },
    {
      id: "content",
      label: "Content",
      summary: "Caption, media and the platform-specific extras.",
      icon: TextSelect,
    },
    {
      id: "metrics",
      label: "Metrics",
      summary: "Engagement counts and the publish time.",
      icon: Gauge,
    },
  ],
};

const COMMENTS: CategoryDescriptor<"comments"> = {
  id: "comments",
  label: "Comments",
  description: "Comment threads with replies, likes and creator badges.",
  icon: MessageSquare,
  sections: [
    {
      id: "apps",
      label: "Platforms",
      summary: "Choose which comment sections to render.",
      icon: Globe,
    },
    {
      id: "users",
      label: "People",
      summary: "The creator and everyone who comments.",
      icon: Users,
    },
    {
      id: "thread",
      label: "Thread",
      summary: "The comments themselves, in order.",
      icon: MessageSquareQuote,
    },
  ],
};

const MESSAGES: CategoryDescriptor<"messages"> = {
  id: "messages",
  label: "Messages",
  description: "Direct and group chats with attachments and read receipts.",
  icon: MessageCircleMore,
  sections: [
    {
      id: "apps",
      label: "Platforms",
      summary: "Choose which messaging apps to render.",
      icon: Globe,
    },
    {
      id: "users",
      label: "People",
      summary: "Both sides of the conversation.",
      icon: Users,
    },
    {
      id: "conversation",
      label: "Conversation",
      summary: "The thread, its header and every message in it.",
      icon: MessageSquare,
    },
  ],
};

const AI_CHATS: CategoryDescriptor<"ai-chats"> = {
  id: "ai-chats",
  label: "AI Chat",
  description: "Assistant transcripts with markdown, code and reasoning.",
  icon: BotMessageSquare,
  sections: [
    {
      id: "apps",
      label: "Assistants",
      summary: "Choose which assistants to render, and their models.",
      icon: Globe,
    },
    {
      id: "conversation",
      label: "Transcript",
      summary: "Prompts, replies and optional reasoning.",
      icon: MessageSquare,
    },
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
