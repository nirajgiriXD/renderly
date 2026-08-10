/**
 * External dependencies.
 */
import { ArrowLeftRight, Copy, Plus, Trash2 } from "lucide-react";

/**
 * Internal dependencies.
 */
import { DateTimeField } from "@/components/common/DateTimeField";
import {
  FieldGrid,
  SelectField,
  SwitchField,
  TextAreaField,
  TextField,
} from "@/components/common/fields";
import { MediaField } from "@/components/common/MediaField";
import { PersonFields } from "@/components/common/PersonFields";
import { SortableList } from "@/components/common/SortableList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NumberField } from "@/components/common/fields";
import { useListEditor } from "@/hooks";
import { createId } from "@/lib/id";
import { useSection } from "@/store";
import type { ChatMessage } from "@/types";

const REACTIONS = ["", "❤️", "😂", "👍", "😮", "😢", "🔥"];

const newMessage = (author: ChatMessage["author"]): ChatMessage => ({
  id: createId("message"),
  text: "",
  author,
  media: null,
  date: new Date().toISOString(),
  status: "read",
  reaction: "",
});

export const MessagePeopleSection = () => {
  const [users, setUsers] = useSection("messages", "users");

  return (
    <div className="space-y-6">
      <section className="space-y-3 rounded-xl border p-4">
        <h3 className="text-sm font-semibold">You</h3>
        <p className="-mt-2 text-xs text-muted-foreground">
          Outgoing messages, shown on the right of the thread.
        </p>
        <PersonFields
          person={users.self}
          showVerified={false}
          namePlaceholder="Ada"
          onChange={(patch) => setUsers({ self: { ...users.self, ...patch } })}
        />
      </section>

      <section className="space-y-3 rounded-xl border p-4">
        <h3 className="text-sm font-semibold">Them</h3>
        <p className="-mt-2 text-xs text-muted-foreground">
          Incoming messages, and the name shown in the conversation header.
        </p>
        <PersonFields
          person={users.other}
          showVerified={false}
          namePlaceholder="Grace Hopper"
          onChange={(patch) => setUsers({ other: { ...users.other, ...patch } })}
        />
      </section>
    </div>
  );
};

export const MessageConversationSection = () => {
  const [conversation, setConversation] = useSection("messages", "conversation");

  const messages = useListEditor(conversation.messages, (next) =>
    setConversation({ messages: next })
  );

  const isGroup = conversation.kind === "group";

  return (
    <div className="space-y-6">
      <FieldGrid>
        <SelectField
          label="Conversation type"
          value={conversation.kind}
          onChange={(kind) => setConversation({ kind })}
          options={[
            { label: "Direct message", value: "direct" },
            { label: "Group chat", value: "group" },
          ]}
        />
        {isGroup && (
          <>
            <TextField
              label="Group name"
              value={conversation.title}
              placeholder="Weekend plans"
              onChange={(title) => setConversation({ title })}
            />
            <NumberField
              label="Members"
              value={conversation.memberCount}
              onChange={(memberCount) => setConversation({ memberCount })}
            />
          </>
        )}
      </FieldGrid>

      <div className="grid gap-3 @md:grid-cols-2">
        <SwitchField
          label="Online"
          hint="Shows presence in the header."
          checked={conversation.online}
          onChange={(online) => setConversation({ online })}
        />
        <SwitchField
          label="Typing indicator"
          hint="Adds the animated bubble at the end."
          checked={conversation.typing}
          onChange={(typing) => setConversation({ typing })}
        />
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">Messages</h3>
            <Badge variant="secondary">{messages.items.length}</Badge>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => messages.add(newMessage("other"))}
            >
              <Plus />
              Incoming
            </Button>
            <Button size="sm" onClick={() => messages.add(newMessage("self"))}>
              <Plus />
              Outgoing
            </Button>
          </div>
        </div>

        {messages.items.length === 0 ? (
          <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            No messages yet. Add one from either side to start the thread.
          </p>
        ) : (
          <SortableList items={messages.items} onReorder={messages.move}>
            {(message) => (
              <div className="space-y-4 p-4 pl-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge
                    variant={message.author === "self" ? "default" : "secondary"}
                  >
                    {message.author === "self" ? "You" : "Them"}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        messages.update(message.id, {
                          author: message.author === "self" ? "other" : "self",
                        })
                      }
                    >
                      <ArrowLeftRight />
                      Switch side
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Duplicate message"
                      onClick={() =>
                        messages.duplicate(message.id, (item) => ({
                          ...item,
                          id: createId("message"),
                        }))
                      }
                    >
                      <Copy />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Delete message"
                      onClick={() => messages.remove(message.id)}
                    >
                      <Trash2 className="text-destructive" />
                    </Button>
                  </div>
                </div>

                <TextAreaField
                  label="Message"
                  className="[&>label]:sr-only"
                  rows={2}
                  value={message.text}
                  placeholder="Write a message…"
                  onChange={(text) => messages.update(message.id, { text })}
                />

                <FieldGrid>
                  <DateTimeField
                    label="Sent"
                    value={message.date}
                    onChange={(date) => messages.update(message.id, { date })}
                  />
                  <SelectField
                    label="Delivery status"
                    hint="Drives the ticks on outgoing messages."
                    value={message.status}
                    onChange={(status) =>
                      messages.update(message.id, { status })
                    }
                    options={[
                      { label: "Sending", value: "sending" },
                      { label: "Sent", value: "sent" },
                      { label: "Delivered", value: "delivered" },
                      { label: "Read", value: "read" },
                    ]}
                  />
                </FieldGrid>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Reaction</p>
                  <div className="flex flex-wrap gap-1.5">
                    {REACTIONS.map((emoji) => (
                      <Button
                        key={emoji || "none"}
                        size="sm"
                        variant={
                          message.reaction === emoji ? "secondary" : "ghost"
                        }
                        aria-pressed={message.reaction === emoji}
                        onClick={() =>
                          messages.update(message.id, { reaction: emoji })
                        }
                      >
                        {emoji || "None"}
                      </Button>
                    ))}
                  </div>
                </div>

                <MediaField
                  label="Attachment"
                  max={1}
                  value={message.media ? [message.media] : []}
                  onChange={(items) =>
                    messages.update(message.id, { media: items[0] ?? null })
                  }
                />
              </div>
            )}
          </SortableList>
        )}
      </section>
    </div>
  );
};
