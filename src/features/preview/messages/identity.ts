/**
 * Internal dependencies.
 */
import { groupTitle } from "../fallbacks";
import type { MessagesConfig } from "@/types";

/**
 * Conversation title and subtitle, resolved from the group/direct setting.
 *
 * Direct chats are titled after the other person; group chats use the group
 * name and report a member count.
 */
export const useConversationIdentity = (data: MessagesConfig) => {
  const { conversation, users } = data;
  const group = conversation.kind === "group";

  return {
    group,
    title: group
      ? groupTitle(conversation.title, users.other.name)
      : users.other.name.trim() || "New conversation",
    subtitle: group
      ? `${Math.max(conversation.memberCount, 2)} members`
      : conversation.typing
        ? "typing…"
        : conversation.online
          ? "online"
          : "last seen recently",
    avatar: users.other.avatar,
  };
};
