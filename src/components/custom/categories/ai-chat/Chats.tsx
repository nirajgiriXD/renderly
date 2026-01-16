/**
 * External dependencies.
 */
import { GripVertical, Plus, ArrowLeftRight, Trash2 } from "lucide-react";
import { useState } from "react";

/**
 * Internal dependencies.
 */
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableOverlay,
  SortableItemHandle,
} from "@/components/ui/sortable";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/utils";

export const Chats = () => {
  const [chats, setChats] = useState([
    {
      id: "1",
      avatar: "",
      comment: "John Doe",
      reactions: 4,
      username: "johndoe",
    },
    {
      id: "2",
      avatar: "",
      comment: "Jane Smith",
      reactions: 2,
      username: "janesmith",
    },
  ]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="message" className="w-fit">
            Messages
          </Label>
          <Button size="sm" className="cursor-pointer">
            <Plus />
            Add New
          </Button>
        </div>
        <Sortable
          value={chats}
          onValueChange={setChats}
          orientation="vertical"
          getItemValue={(item) => item.id}
        >
          <SortableContent className="space-y-4 md:space-y-6">
            {chats.map((comment) => (
              <SortableItem key={comment.id} value={comment.id} asChild>
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
                          <Avatar className="size-5 rounded-none">
                            <AvatarImage src="" />
                            <AvatarFallback>
                              {getInitials("John Doe")}
                            </AvatarFallback>
                          </Avatar>
                          <p>John Doe</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="cursor-pointer"
                        >
                          <ArrowLeftRight />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer"
                        >
                          <Trash2 className="text-red-600" />
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      id="comment"
                      placeholder="Comment"
                      value={comment.comment}
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
