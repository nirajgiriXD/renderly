/**
 * External dependencies.
 */
import { GripVertical, Plus, Reply, Trash2 } from "lucide-react";
import { useState } from "react";

/**
 * Internal dependencies.
 */
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableOverlay,
  SortableItemHandle,
} from "@/components/ui/sortable";
import { getInitials } from "@/utils";

export const Comments = () => {
  const [comments, setComments] = useState([
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
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Label className="text-base font-semibold">Comments</Label>
          <Badge variant="secondary">12</Badge>
        </div>
        <Button size="sm" className="cursor-pointer">
          <Plus />
          Add New
        </Button>
      </div>
      <Sortable
        value={comments}
        onValueChange={setComments}
        orientation="vertical"
        getItemValue={(item) => item.id}
      >
        <SortableContent className="space-y-4 md:space-y-6">
          {comments.map((comment) => (
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
                          <GripVertical className="h-5 w-5 cursor-grab active:cursor-grabbing" />
                        </button>
                      </SortableItemHandle>
                      <Select defaultValue="johndoe">
                        <SelectTrigger id="users">
                          <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="johndoe">
                            <Avatar className="size-5 rounded-none">
                              <AvatarImage src="" />
                              <AvatarFallback>
                                {getInitials("John Doe")}
                              </AvatarFallback>
                            </Avatar>
                            John Doe
                          </SelectItem>
                          <SelectItem value="janesmith">
                            <Avatar className="size-5 rounded-none">
                              <AvatarImage src="" />
                              <AvatarFallback>
                                {getInitials("Jane Smith")}
                              </AvatarFallback>
                            </Avatar>
                            Jane Smith
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer"
                      >
                        <Reply />
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
                <div className="space-y-2 border-gray-400">
                  <div className="flex items-center justify-between gap-2">
                    <p className="border-l-2 pl-2 text-muted-foreground">
                      Add a reply to @johndoe
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <Select defaultValue="johndoe">
                        <SelectTrigger id="users">
                          <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="johndoe">
                            <Avatar className="size-5 rounded-none">
                              <AvatarImage src="" />
                              <AvatarFallback>
                                {getInitials("John Doe")}
                              </AvatarFallback>
                            </Avatar>
                            John Doe
                          </SelectItem>
                          <SelectItem value="janesmith">
                            <Avatar className="size-5 rounded-none">
                              <AvatarImage src="" />
                              <AvatarFallback>
                                {getInitials("Jane Smith")}
                              </AvatarFallback>
                            </Avatar>
                            Jane Smith
                          </SelectItem>
                        </SelectContent>
                      </Select>
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
                    id="reply-comment"
                    placeholder="Reply Comment"
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
  );
};
