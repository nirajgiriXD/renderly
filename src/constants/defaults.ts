/**
 * Internal dependencies.
 */
import { defaultModelFor } from "./platforms";
import { AI_CHAT_PLATFORMS } from "@/types";
import type {
  AiChatPlatform,
  AiChatsConfig,
  AppConfig,
  AppearanceConfig,
  CommentsConfig,
  MessagesConfig,
  PostsConfig,
  Settings,
} from "@/types";

const minutesAgo = (minutes: number) =>
  new Date(Date.now() - minutes * 60_000).toISOString();

const APPEARANCE: AppearanceConfig = {
  theme: "light",
  device: "ios",
  showDeviceFrame: true,
};

/**
 * Seed content.
 *
 * The editor ships with a filled-in example so the preview is meaningful on
 * first load; `Reset` restores it and `Clear` empties every field.
 */
const POSTS: PostsConfig = {
  apps: { multiSelect: false, selected: ["twitter"] },
  author: {
    id: "author",
    name: "Ada Lovelace",
    username: "adalovelace",
    avatar: null,
    verified: true,
    jobTitle: "Mathematician · Writing about analytical engines",
    followers: 128_400,
  },
  content: {
    title: "The analytical engine weaves algebraic patterns",
    caption:
      "Spent the weekend rewriting the note-taking layer.\n\nThe analytical engine weaves algebraical patterns just as the Jacquard loom weaves flowers and leaves. Still the clearest way I know to describe what we are building.",
    media: [],
    subreddit: "programming",
    soundName: "original sound - adalovelace",
  },
  metrics: {
    reactions: 12_400,
    comments: 318,
    reposts: 1_240,
    views: 486_000,
    bookmarks: 940,
    date: minutesAgo(190),
  },
  appearance: { ...APPEARANCE },
};

const COMMENTS: CommentsConfig = {
  apps: { multiSelect: false, selected: ["instagram"] },
  users: {
    creator: {
      id: "creator",
      name: "Ada Lovelace",
      username: "adalovelace",
      avatar: null,
      verified: true,
    },
    participants: [
      {
        id: "person-1",
        name: "Grace Hopper",
        username: "amazinggrace",
        avatar: null,
        verified: false,
      },
      {
        id: "person-2",
        name: "Alan Turing",
        username: "alanturing",
        avatar: null,
        verified: false,
      },
    ],
  },
  thread: {
    totalCount: 318,
    sort: "top",
    comments: [
      {
        id: "comment-1",
        authorId: "person-1",
        text: "This is the clearest explanation of the idea I have read all year. Saving it for the next time someone asks me what we actually do.",
        likes: 1_820,
        date: minutesAgo(120),
        pinned: true,
        hearted: true,
        replies: [
          {
            id: "reply-1",
            authorId: "creator",
            text: "Thank you! There is a longer write-up coming next week.",
            likes: 246,
            date: minutesAgo(96),
          },
        ],
      },
      {
        id: "comment-2",
        authorId: "person-2",
        text: "Curious how this holds up once the machine has to decide whether it is thinking.",
        likes: 512,
        date: minutesAgo(64),
        pinned: false,
        hearted: false,
        replies: [],
      },
    ],
  },
  appearance: { ...APPEARANCE },
};

const MESSAGES: MessagesConfig = {
  apps: { multiSelect: false, selected: ["whatsapp"] },
  users: {
    self: {
      id: "self",
      name: "Ada",
      username: "adalovelace",
      avatar: null,
      verified: false,
    },
    other: {
      id: "other",
      name: "Grace Hopper",
      username: "amazinggrace",
      avatar: null,
      verified: false,
    },
  },
  conversation: {
    kind: "direct",
    title: "",
    memberCount: 4,
    typing: false,
    online: true,
    messages: [
      {
        id: "message-1",
        text: "Did the compiler notes ever make it into the repo?",
        author: "other",
        media: null,
        date: minutesAgo(46),
        status: "read",
        reaction: "",
      },
      {
        id: "message-2",
        text: "Pushed them this morning — the diff is smaller than I expected.",
        author: "self",
        media: null,
        date: minutesAgo(44),
        status: "read",
        reaction: "",
      },
      {
        id: "message-3",
        text: "Perfect. I will review after lunch 🙌",
        author: "other",
        media: null,
        date: minutesAgo(12),
        status: "read",
        reaction: "❤️",
      },
    ],
  },
  appearance: { ...APPEARANCE },
};

const AI_CHATS: AiChatsConfig = {
  apps: {
    multiSelect: false,
    selected: ["chatgpt"],
    models: Object.fromEntries(
      AI_CHAT_PLATFORMS.map((platform) => [platform, defaultModelFor(platform)])
    ) as Record<AiChatPlatform, string>,
  },
  conversation: {
    title: "Debouncing a search input",
    streaming: false,
    turns: [
      {
        id: "turn-1",
        role: "user",
        text: "How do I debounce a search input in React without pulling in a library?",
        reasoning: "",
      },
      {
        id: "turn-2",
        role: "assistant",
        text: "You only need a timer and an effect. Keep the input **controlled**, then publish a debounced copy of the value:\n\n```tsx\nfunction useDebounced<T>(value: T, delay = 300) {\n  const [debounced, setDebounced] = useState(value);\n\n  useEffect(() => {\n    const timer = setTimeout(() => setDebounced(value), delay);\n    return () => clearTimeout(timer);\n  }, [value, delay]);\n\n  return debounced;\n}\n```\n\nA few things worth knowing:\n\n- The cleanup is what makes it work — every keystroke cancels the pending timer.\n- Use `useDeferredValue` instead when you are debouncing *rendering* rather than a network call.\n- Cancel in-flight requests with an `AbortController` so a slow response cannot overwrite a newer one.",
        reasoning:
          "The user wants a dependency-free approach. A small hook built on setTimeout with effect cleanup covers it, and it is worth contrasting with useDeferredValue.",
      },
    ],
  },
  appearance: { ...APPEARANCE, device: "web" },
};

export const DEFAULT_CONFIG: AppConfig = {
  posts: POSTS,
  comments: COMMENTS,
  messages: MESSAGES,
  "ai-chats": AI_CHATS,
};

/** An entirely empty config, used by the "Clear everything" action. */
export const EMPTY_CONFIG: AppConfig = {
  posts: {
    ...POSTS,
    author: {
      ...POSTS.author,
      name: "",
      username: "",
      jobTitle: "",
      verified: false,
      followers: 0,
    },
    content: {
      title: "",
      caption: "",
      media: [],
      subreddit: "",
      soundName: "",
    },
    metrics: {
      reactions: 0,
      comments: 0,
      reposts: 0,
      views: 0,
      bookmarks: 0,
      date: "",
    },
  },
  comments: {
    ...COMMENTS,
    users: {
      creator: { ...COMMENTS.users.creator, name: "", username: "", verified: false },
      participants: [],
    },
    thread: { totalCount: 0, sort: "top", comments: [] },
  },
  messages: {
    ...MESSAGES,
    users: {
      self: { ...MESSAGES.users.self, name: "", username: "" },
      other: { ...MESSAGES.users.other, name: "", username: "" },
    },
    conversation: {
      kind: "direct",
      title: "",
      memberCount: 0,
      typing: false,
      online: false,
      messages: [],
    },
  },
  "ai-chats": {
    ...AI_CHATS,
    conversation: { title: "", streaming: false, turns: [] },
  },
};

export const DEFAULT_SETTINGS: Settings = {
  persistLocally: true,
  colorScheme: "system",
};

export const STORAGE_KEYS = {
  config: "post-preview:config:v2",
  settings: "post-preview:settings:v2",
} as const;

/**
 * Router basename, derived from Vite's `base` rather than written out again.
 *
 * The deploy path is configured once, in `vite.config.ts`. Repeating it here
 * as a literal is what lets the two drift apart and produce a doubled prefix
 * like `/post-preview/post-preview`.
 */
export const APP_BASENAME = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";
