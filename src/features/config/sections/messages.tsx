/**
 * External dependencies.
 */
import {
  ArrowLeftRight,
  Copy,
  MessageSquarePlus,
  MessagesSquare,
  Trash2,
  User,
  Users,
} from "lucide-react";

/**
 * Internal dependencies.
 */
import { DateTimeField } from "@/components/common/DateTimeField";
import { Disclosure, DisclosureDot } from "@/components/common/Disclosure";
import { EmptyState } from "@/components/common/EmptyState";
import {
  FieldGrid,
  NumberField,
  SegmentedField,
  SelectField,
  SwitchField,
  TextAreaField,
  TextField,
} from "@/components/common/fields";
import { MediaField } from "@/components/common/MediaField";
import { GroupHeader, Panel } from "@/components/common/Panel";
import { PersonFields } from "@/components/common/PersonFields";
import {
  RowBody,
  RowHeader,
  SortableList,
} from "@/components/common/SortableList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
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
    <div className="space-y-4">
      <Panel
        title="You"
        description="Outgoing messages, shown on the right of the thread."
      >
        <PersonFields
          person={users.self}
          showVerified={false}
          namePlaceholder="Ada"
          onChange={(patch) => setUsers({ self: { ...users.self, ...patch } })}
        />
      </Panel>

      <Panel
        title="Them"
        description="Incoming messages, and the name shown in the conversation header."
      >
        <PersonFields
          person={users.other}
          showVerified={false}
          namePlaceholder="Grace Hopper"
          onChange={(patch) => setUsers({ other: { ...users.other, ...patch } })}
        />
      </Panel>
    </div>
  );
};

/** Emoji picker rendered as a row of chips rather than a dropdown. */
const ReactionPicker = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (reaction: string) => void;
}) => (
  <div role="radiogroup" aria-label="Reaction" className="flex flex-wrap gap-1">
    {REACTIONS.map((emoji) => {
      const active = value === emoji;

      return (
        <button
          key={emoji || "none"}
          type="button"
          role="radio"
          aria-checked={active}
          aria-label={emoji || "No reaction"}
          onClick={() => onChange(emoji)}
          className={cn(
            "flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-lg border px-2 text-sm",
            "transition-[background-color,border-color] duration-150",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            active
              ? "border-brand-line bg-brand-soft"
              : "border-border bg-surface hover:border-border-strong hover:bg-accent"
          )}
        >
          {emoji || (
            <span
              className={cn(
                "text-xs font-medium",
                active ? "text-brand-text" : "text-muted-foreground"
              )}
            >
              None
            </span>
          )}
        </button>
      );
    })}
  </div>
);

export const MessageConversationSection = () => {
  const [conversation, setConversation] = useSection("messages", "conversation");

  const messages = useListEditor(conversation.messages, (next) =>
    setConversation({ messages: next })
  );

  const isGroup = conversation.kind === "group";

  return (
    <div className="space-y-5">
      <Panel title="Conversation">
        <SegmentedField
          label="Conversation type"
          value={conversation.kind}
          onChange={(kind) => setConversation({ kind })}
          options={[
            { value: "direct", label: "Direct", icon: User },
            { value: "group", label: "Group", icon: Users },
          ]}
        />

        {isGroup && (
          <FieldGrid>
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
          </FieldGrid>
        )}

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
      </Panel>

      <section className="space-y-3">
        <GroupHeader
          title="Messages"
          count={messages.items.length}
          description="Drag to reorder. Consecutive messages from one side are grouped automatically."
          actions={
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => messages.add(newMessage("other"))}
              >
                <MessageSquarePlus />
                Incoming
              </Button>
              <Button
                size="sm"
                onClick={() => messages.add(newMessage("self"))}
              >
                <MessageSquarePlus />
                Outgoing
              </Button>
            </>
          }
        />

        {messages.items.length === 0 ? (
          <EmptyState
            size="sm"
            icon={MessagesSquare}
            title="No messages yet"
            description="Add one from either side to start the thread."
            action={
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => messages.add(newMessage("other"))}
                >
                  Incoming
                </Button>
                <Button
                  size="sm"
                  onClick={() => messages.add(newMessage("self"))}
                >
                  Outgoing
                </Button>
              </div>
            }
          />
        ) : (
          <SortableList items={messages.items} onReorder={messages.move}>
            {(message) => {
              const isSelf = message.author === "self";
              const hasExtras =
                Boolean(message.reaction) || Boolean(message.media);

              return (
                <>
                  <RowHeader
                    lead={
                      <Badge variant={isSelf ? "soft" : "secondary"}>
                        {isSelf ? "You" : "Them"}
                      </Badge>
                    }
                    actions={
                      <>
                        <Hint
                          label={isSelf ? "Make incoming" : "Make outgoing"}
                        >
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            aria-label="Switch side"
                            onClick={() =>
                              messages.update(message.id, {
                                author: isSelf ? "other" : "self",
                              })
                            }
                          >
                            <ArrowLeftRight />
                          </Button>
                        </Hint>
                        <Hint label="Duplicate message">
                          <Button
                            size="icon-sm"
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
                        </Hint>
                        <Hint label="Delete message">
                          <Button
                            size="icon-sm"
                            variant="destructive-ghost"
                            aria-label="Delete message"
                            onClick={() => messages.remove(message.id)}
                          >
                            <Trash2 />
                          </Button>
                        </Hint>
                      </>
                    }
                  />

                  <RowBody>
                    <TextAreaField
                      label="Message"
                      className="[&>label]:sr-only"
                      rows={2}
                      value={message.text}
                      placeholder="Write a message…"
                      onChange={(text) =>
                        messages.update(message.id, { text })
                      }
                    />

                    <Disclosure
                      label="Timing, status and attachment"
                      badge={
                        hasExtras ? (
                          <DisclosureDot title="This message has a reaction or an attachment" />
                        ) : undefined
                      }
                    >
                      <FieldGrid>
                        <DateTimeField
                          label="Sent"
                          value={message.date}
                          onChange={(date) =>
                            messages.update(message.id, { date })
                          }
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

                      <div className="space-y-1.5">
                        <p className="text-[0.8125rem] font-medium">Reaction</p>
                        <ReactionPicker
                          value={message.reaction}
                          onChange={(reaction) =>
                            messages.update(message.id, { reaction })
                          }
                        />
                      </div>

                      <MediaField
                        label="Attachment"
                        max={1}
                        value={message.media ? [message.media] : []}
                        onChange={(items) =>
                          messages.update(message.id, {
                            media: items[0] ?? null,
                          })
                        }
                      />
                    </Disclosure>
                  </RowBody>
                </>
              );
            }}
          </SortableList>
        )}
      </section>
    </div>
  );
};
