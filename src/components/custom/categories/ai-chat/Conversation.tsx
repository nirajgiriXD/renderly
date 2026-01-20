/**
 * External dependencies.
 */
import {
  GripVertical,
  Plus,
  ArrowLeftRight,
  Trash2,
  User,
  Bot,
} from "lucide-react";

/**
 * Internal dependencies.
 */
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableOverlay,
  SortableItemHandle,
} from "@/components/ui/sortable";
import { useStore } from "@/hooks";

export const Conversation = () => {
  const { form, handleFormChange } = useStore();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="conversation" className="w-fit">
            Conversation
          </Label>
          <Button
            size="sm"
            className="cursor-pointer"
            onClick={() =>
              handleFormChange("data", [
                ...form["ai-chats"].conversation.data,
                {
                  id: Date.now(),
                  text: "",
                  sender: "user",
                },
              ])
            }
          >
            <Plus />
            Add New
          </Button>
        </div>
        <Sortable
          value={form["ai-chats"].conversation.data}
          onValueChange={(value) => handleFormChange("data", value)}
          orientation="vertical"
          getItemValue={(item) => item.id}
        >
          <SortableContent className="space-y-4 md:space-y-6">
            {form["ai-chats"].conversation.data.map((message) => (
              <SortableItem key={message.id} value={message.id} asChild>
                <div className="space-y-4 border p-3 rounded-md relative">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <SortableItemHandle asChild>
                          <button
                            type="button"
                            aria-label="Reorder comment"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <GripVertical className="h-4 w-4 cursor-grab active:cursor-grabbing" />
                          </button>
                        </SortableItemHandle>
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-muted p-1">
                            {message.sender === "user" ? (
                              <User size={16} />
                            ) : (
                              <Bot size={16} />
                            )}
                          </div>
                          <p>{message.sender === "user" ? "User" : "Bot"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="cursor-pointer"
                          onClick={() =>
                            handleFormChange(
                              "data",
                              form["ai-chats"].conversation.data.map((chat) =>
                                chat.id === message.id
                                  ? {
                                      ...chat,
                                      sender:
                                        chat.sender === "user" ? "bot" : "user",
                                    }
                                  : chat
                              )
                            )
                          }
                        >
                          <ArrowLeftRight />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="cursor-pointer"
                          onClick={() =>
                            handleFormChange(
                              "data",
                              form["ai-chats"].conversation.data.filter(
                                (chat) => chat.id !== message.id
                              )
                            )
                          }
                        >
                          <Trash2 className="text-red-600" />
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      placeholder="Comment"
                      value={message.text}
                      onChange={(e) =>
                        handleFormChange(
                          "data",
                          form["ai-chats"].conversation.data.map((chat) =>
                            chat.id === message.id
                              ? { ...chat, text: e.target.value }
                              : chat
                          )
                        )
                      }
                    />
                  </div>
                </div>
              </SortableItem>
            ))}
          </SortableContent>
          <SortableOverlay>
            <div className="size-full rounded-md bg-primary/10" />
          </SortableOverlay>
        </Sortable>
      </div>
    </div>
  );
};
