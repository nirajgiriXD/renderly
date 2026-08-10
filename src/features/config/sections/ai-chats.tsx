/**
 * External dependencies.
 */
import { ArrowLeftRight, Bot, Copy, Trash2, User } from "lucide-react";

/**
 * Internal dependencies.
 */
import {
  SwitchField,
  TextAreaField,
  TextField,
} from "@/components/common/fields";
import { SortableList } from "@/components/common/SortableList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <div className="space-y-6">
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

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">Turns</h3>
            <Badge variant="secondary">{turns.items.length}</Badge>
          </div>
          <div className="flex gap-2">
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
          </div>
        </div>

        {turns.items.length === 0 ? (
          <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            No turns yet. Add a prompt and a reply to build the transcript.
          </p>
        ) : (
          <SortableList items={turns.items} onReorder={turns.move}>
            {(turn) => (
              <div className="space-y-4 p-4 pl-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge
                    variant={turn.role === "user" ? "default" : "secondary"}
                    className="gap-1"
                  >
                    {turn.role === "user" ? (
                      <User className="size-3" />
                    ) : (
                      <Bot className="size-3" />
                    )}
                    {turn.role === "user" ? "Prompt" : "Reply"}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        turns.update(turn.id, {
                          role: turn.role === "user" ? "assistant" : "user",
                        })
                      }
                    >
                      <ArrowLeftRight />
                      Switch role
                    </Button>
                    <Button
                      size="icon"
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
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Delete turn"
                      onClick={() => turns.remove(turn.id)}
                    >
                      <Trash2 className="text-destructive" />
                    </Button>
                  </div>
                </div>

                <TextAreaField
                  label="Message"
                  className="[&>label]:sr-only"
                  hint={
                    turn.role === "assistant"
                      ? "Markdown is rendered: headings, lists, **bold**, `code` and ``` fenced blocks."
                      : undefined
                  }
                  rows={turn.role === "assistant" ? 6 : 3}
                  value={turn.text}
                  placeholder={
                    turn.role === "user"
                      ? "Ask the assistant something…"
                      : "Write the assistant's reply…"
                  }
                  onChange={(text) => turns.update(turn.id, { text })}
                />

                {turn.role === "assistant" && (
                  <TextAreaField
                    label="Reasoning"
                    hint="Optional. Renders as the collapsed “thought for a few seconds” block."
                    rows={2}
                    value={turn.reasoning}
                    placeholder="What the model considered before answering…"
                    onChange={(reasoning) =>
                      turns.update(turn.id, { reasoning })
                    }
                  />
                )}
              </div>
            )}
          </SortableList>
        )}
      </section>
    </div>
  );
};
