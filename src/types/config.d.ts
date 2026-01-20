/**
 * Internal dependencies.
 */
import { type CommentsConfig } from "./comments";
import { type MessagesConfig } from "./messages";
import { type AiChatsConfig } from "./ai-chats";
import { type PostsConfig } from "./posts";

export type DefaultConfig = {
  posts: PostsConfig;
  comments: CommentsConfig;
  messages: MessagesConfig;
  "ai-chats": AiChatsConfig;
};
