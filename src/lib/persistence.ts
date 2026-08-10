/**
 * Internal dependencies.
 */
import type { AppConfig } from "@/types";

/**
 * Strips every attachment out of a config before it is written to storage.
 *
 * Uploaded media lives as a data URL, which a single photo can push past the
 * `localStorage` quota. It also cannot be *restored* meaningfully: keeping the
 * file name in place of the bytes would hand the previews an `<img src>` that
 * resolves to nothing, so the next visit shows a wall of broken images. The
 * only honest thing to persist is "there was no attachment".
 *
 * This is deliberately separate from `stripDataUrls`, which replaces a data URL
 * with its file name — the right behaviour for the raw JSON view, where the
 * name is informative and nothing tries to load it.
 */
export const toPersistableConfig = (config: AppConfig): AppConfig => ({
  ...config,

  posts: {
    ...config.posts,
    author: { ...config.posts.author, avatar: null },
    content: { ...config.posts.content, media: [] },
  },

  comments: {
    ...config.comments,
    users: {
      creator: { ...config.comments.users.creator, avatar: null },
      participants: config.comments.users.participants.map((person) => ({
        ...person,
        avatar: null,
      })),
    },
  },

  messages: {
    ...config.messages,
    users: {
      self: { ...config.messages.users.self, avatar: null },
      other: { ...config.messages.users.other, avatar: null },
    },
    conversation: {
      ...config.messages.conversation,
      messages: config.messages.conversation.messages.map((message) => ({
        ...message,
        media: null,
      })),
    },
  },
});
