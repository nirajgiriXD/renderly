/**
 * External dependencies.
 */
import { ArrowLeftRight, Bot, Copy, MessagesSquare, Trash2, User } from "lucide-react";

/**
 * Internal dependencies.
 */
import { Disclosure, DisclosureDot } from "@/components/common/Disclosure";
import { EmptyState } from "@/components/common/EmptyState";
import {
  SwitchField,
  TextAreaField,
  TextField,
} from "@/components/common/fields";
import { GroupHeader, Panel } from "@/components/common/Panel";
import {
  RowBody,
  RowHeader,
  SortableList,
} from "@/components/common/SortableList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/ui/tooltip";
import { useListEditor } from "@/hooks";
import { createId } from "@/lib/id";
import { useSection } from "@/store";
import type { AiTurn } from "@/types";

const newTurn = (role: AiTurn["role"]): AiTurn => ({
  id: createId("turn"),
  role,
  text: "",
  reasoning: "",
});

export const AiConversationSection = () => {
  const [conversation, setConversation] = useSection(
    "ai-chats",
    "conversation"
  );

  const turns = useListEditor(conversation.turns, (next) =>
    setConversation({ turns: next })
  );

  return (
    <div className="space-y-5">
      <Panel title="Transcript settings">
        <TextField
          label="Conversation title"
          hint="Shown in the assistant's header where the product supports it."
          value={conversation.title}
          placeholder="Debouncing a search input"
          onChange={(title) => setConversation({ title })}
        />

        <SwitchField
          label="Streaming"
          hint="Adds the typing caret to the last assistant reply."
          checked={conversation.streaming}
          onChange={(streaming) => setConversation({ streaming })}
        />
      </Panel>

      <section className="space-y-3">
        <GroupHeader
          title="Turns"
          count={turns.items.length}
          description="Prompts and replies, in the order they are rendered."
          actions={
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => turns.add(newTurn("user"))}
              >
                <User />
                Prompt
              </Button>
              <Button size="sm" onClick={() => turns.add(newTurn("assistant"))}>
                <Bot />
                Reply
              </Button>
            </>
          }
        />

        {turns.items.length === 0 ? (
          <EmptyState
            size="sm"
            icon={MessagesSquare}
            title="No turns yet"
            description="Add a prompt and a reply to build the transcript."
            action={
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => turns.add(newTurn("user"))}
                >
                  <User />
                  Prompt
                </Button>
                <Button
                  size="sm"
                  onClick={() => turns.add(newTurn("assistant"))}
                >
                  <Bot />
                  Reply
                </Button>
              </div>
            }
          />
        ) : (
          <SortableList items={turns.items} onReorder={turns.move}>
            {(turn) => {
              const isPrompt = turn.role === "user";

              return (
                <>
                  <RowHeader
                    lead={
                      <Badge variant={isPrompt ? "soft" : "secondary"}>
                        {isPrompt ? (
                          <User className="size-3" />
                        ) : (
                          <Bot className="size-3" />
                        )}
                        {isPrompt ? "Prompt" : "Reply"}
                      </Badge>
                    }
                    actions={
                      <>
                        <Hint
                          label={isPrompt ? "Make a reply" : "Make a prompt"}
                        >
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            aria-label="Switch role"
                            onClick={() =>
                              turns.update(turn.id, {
                                role: isPrompt ? "assistant" : "user",
                              })
                            }
                          >
                            <ArrowLeftRight />
                          </Button>
                        </Hint>
                        <Hint label="Duplicate turn">
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            aria-label="Duplicate turn"
                            onClick={() =>
                              turns.duplicate(turn.id, (item) => ({
                                ...item,
                                id: createId("turn"),
                              }))
                            }
                          >
                            <Copy />
                          </Button>
                        </Hint>
                        <Hint label="Delete turn">
                          <Button
                            size="icon-sm"
                            variant="destructive-ghost"
                            aria-label="Delete turn"
                            onClick={() => turns.remove(turn.id)}
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
                      hint={
                        isPrompt
                          ? undefined
                          : "Markdown is rendered: headings, lists, **bold**, `code` and ``` fenced blocks."
                      }
                      rows={isPrompt ? 3 : 6}
                      value={turn.text}
                      placeholder={
                        isPrompt
                          ? "Ask the assistant something…"
                          : "Write the assistant's reply…"
                      }
                      onChange={(text) => turns.update(turn.id, { text })}
                    />

                    {!isPrompt && (
                      <Disclosure
                        label="Reasoning"
                        badge={
                          turn.reasoning.trim() ? (
                            <DisclosureDot title="This reply shows a reasoning block" />
                          ) : undefined
                        }
                      >
                        <TextAreaField
                          label="Reasoning"
                          className="[&>label]:sr-only"
                          hint="Optional. Renders as the collapsed “thought for a few seconds” block."
                          rows={2}
                          value={turn.reasoning}
                          placeholder="What the model considered before answering…"
                          onChange={(reasoning) =>
                            turns.update(turn.id, { reasoning })
                          }
                        />
                      </Disclosure>
                    )}
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
