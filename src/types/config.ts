/**
 * Internal dependencies.
 */
import type { MediaItem } from "./media";
import type {
  AiChatPlatform,
  CategoryId,
  CommentPlatform,
  MessagePlatform,
  PostPlatform,
} from "./platform";

/* -------------------------------------------------------------------------- */
/*                                   Shared                                    */
/* -------------------------------------------------------------------------- */

export type PreviewTheme = "light" | "dark";
export type PreviewDevice = "android" | "ios" | "web";

export type AppearanceConfig = {
  theme: PreviewTheme;
  device: PreviewDevice;
  /** Draw the phone / browser chrome around the preview. */
  showDeviceFrame: boolean;
};

/**
 * Which platforms are currently previewed.
 *
 * `selected` is an ordered list rather than a `Record<string, boolean>` so the
 * preview order is stable and meaningful, and so "which platforms are on" is a
 * single value instead of a map that has to be reduced everywhere.
 */
export type AppsConfig<P extends string> = {
  multiSelect: boolean;
  selected: P[];
};

export type Person = {
  id: string;
  name: string;
  username: string;
  avatar: string | null;
  verified: boolean;
};

/* -------------------------------------------------------------------------- */
/*                                    Posts                                    */
/* -------------------------------------------------------------------------- */

export type PostAuthor = Person & {
  /** LinkedIn headline / Facebook page category. */
  jobTitle: string;
  /** Followers or connections, shown by LinkedIn and TikTok. */
  followers: number;
};

export type PostsConfig = {
  apps: AppsConfig<PostPlatform>;
  author: PostAuthor;
  content: {
    /** Reddit-style title. Optional for every other platform. */
    title: string;
    caption: string;
    media: MediaItem[];
    /** Subreddit shown by the Reddit preview, without the `r/` prefix. */
    subreddit: string;
    /** Sound attribution shown by the TikTok preview. */
    soundName: string;
  };
  metrics: {
    reactions: number;
    comments: number;
    reposts: number;
    views: number;
    bookmarks: number;
    /** ISO timestamp. Empty string means "now". */
    date: string;
  };
  appearance: AppearanceConfig;
};

/* -------------------------------------------------------------------------- */
/*                                  Comments                                   */
/* -------------------------------------------------------------------------- */

export type CommentReply = {
  id: string;
  authorId: string;
  text: string;
  likes: number;
  /** ISO timestamp. Empty string means "now". */
  date: string;
};

export type CommentNode = CommentReply & {
  /** Pinned by the creator (YouTube, TikTok, Facebook). */
  pinned: boolean;
  /** Hearted by the creator (YouTube, Instagram). */
  hearted: boolean;
  replies: CommentReply[];
};

export type CommentsConfig = {
  apps: AppsConfig<CommentPlatform>;
  users: {
    /** The owner of the post being commented on. */
    creator: Person;
    participants: Person[];
  };
  thread: {
    /** Total shown in the thread header, independent of how many are listed. */
    totalCount: number;
    sort: "top" | "newest";
    comments: CommentNode[];
  };
  appearance: AppearanceConfig;
};

/* -------------------------------------------------------------------------- */
/*                                  Messages                                   */
/* -------------------------------------------------------------------------- */

export type MessageStatus = "sending" | "sent" | "delivered" | "read";

export type ChatMessage = {
  id: string;
  text: string;
  /** `self` is the outgoing side (right hand bubbles). */
  author: "self" | "other";
  media: MediaItem | null;
  /** ISO timestamp. Empty string means "now". */
  date: string;
  status: MessageStatus;
  /** Emoji reaction rendered on the bubble, e.g. "❤️". */
  reaction: string;
};

export type MessagesConfig = {
  apps: AppsConfig<MessagePlatform>;
  users: {
    self: Person;
    other: Person;
  };
  conversation: {
    kind: "direct" | "group";
    /** Group or channel name. Falls back to the other person's name. */
    title: string;
    memberCount: number;
    /** Show the "typing…" indicator at the end of the thread. */
    typing: boolean;
    online: boolean;
    messages: ChatMessage[];
  };
  appearance: AppearanceConfig;
};

/* -------------------------------------------------------------------------- */
/*                                  AI chats                                   */
/* -------------------------------------------------------------------------- */

export type AiTurn = {
  id: string;
  /** `assistant` replies render as full width prose, `user` as a bubble. */
  role: "user" | "assistant";
  text: string;
  /** Render the collapsed "thought for Ns" block above an assistant reply. */
  reasoning: string;
};

export type AiChatsConfig = {
  apps: AppsConfig<AiChatPlatform> & {
    /** Model id per platform, so switching platforms keeps each selection. */
    models: Record<AiChatPlatform, string>;
  };
  conversation: {
    title: string;
    /** Show the streaming caret on the last assistant turn. */
    streaming: boolean;
    turns: AiTurn[];
  };
  appearance: AppearanceConfig;
};

/* -------------------------------------------------------------------------- */
/*                                  Aggregate                                  */
/* -------------------------------------------------------------------------- */

export type AppConfig = {
  posts: PostsConfig;
  comments: CommentsConfig;
  messages: MessagesConfig;
  "ai-chats": AiChatsConfig;
};

/** The editor sections available inside a category, e.g. `"author"`. */
export type SectionOf<C extends CategoryId> = Extract<keyof AppConfig[C], string>;

export type Settings = {
  /** Persist text content to `localStorage` between visits. */
  persistLocally: boolean;
  /** Chrome theme of the tool itself, independent of the preview theme. */
  colorScheme: "light" | "dark" | "system";
};
