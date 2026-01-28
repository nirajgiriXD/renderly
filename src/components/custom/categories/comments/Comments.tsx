/**
 * External dependencies.
 */
import { GripVertical, Plus, Reply, Trash2 } from "lucide-react";

/**
 * Internal dependencies.
 */
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { UserProfile } from "@/components/custom/UserProfile";
import { useStore } from "@/hooks";

export const Comments = () => {
  const { form, handleFormChange } = useStore();

  return (
    <div className="space-y-4 overflow-y-auto">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Label className="text-base font-semibold">Comments</Label>
          <Badge variant="secondary">
            {form.comments.comments.data.length}
          </Badge>
        </div>
        <Button
          size="sm"
          className="cursor-pointer"
          onClick={() =>
            handleFormChange("data", [
              ...form.comments.comments.data,
              {
                id: Date.now(),
                text: "",
                userId: form.comments.users.creator.id,
                replies: [],
              },
            ])
          }
        >
          <Plus />
          Add New
        </Button>
      </div>
      <Sortable
        orientation="vertical"
        getItemValue={(item) => item.id}
        value={form.comments.comments.data}
        onValueChange={(comments) => handleFormChange("data", comments)}
      >
        <SortableContent className="space-y-4 md:space-y-6">
          {form.comments.comments.data.map((comment) => (
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
                      <Select
                        value={String(comment.userId)}
                        onValueChange={(value) => {
                          const updatedComments =
                            form.comments.comments.data.map((item) =>
                              item.id === comment.id
                                ? { ...item, userId: Number(value) }
                                : item
                            );
                          handleFormChange("data", updatedComments);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value={form.comments.users.creator.id.toString()}
                          >
                            <UserProfile
                              profilePicture={
                                form.comments.users.creator.profilePicture
                              }
                            />
                            {form.comments.users.creator.name}
                          </SelectItem>
                          {form.comments.users.commentors.map((user) => (
                            <SelectItem
                              key={user.id}
                              value={user.id.toString()}
                            >
                              <UserProfile
                                profilePicture={user.profilePicture}
                              />
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() =>
                          handleFormChange(
                            "data",
                            form.comments.comments.data.map((item) =>
                              item.id === comment.id
                                ? {
                                    ...item,
                                    replies: [
                                      ...(item.replies || []),
                                      {
                                        text: "",
                                        id: Date.now(),
                                        userId: form.comments.users.creator.id,
                                      },
                                    ],
                                  }
                                : item
                            )
                          )
                        }
                      >
                        <Reply />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() =>
                          handleFormChange(
                            "data",
                            form.comments.comments.data.filter(
                              (item) => item.id !== comment.id
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
                    value={comment.text}
                    onChange={(e) =>
                      handleFormChange(
                        "data",
                        form.comments.comments.data.map((item) =>
                          item.id === comment.id
                            ? { ...item, text: e.target.value }
                            : item
                        )
                      )
                    }
                  />
                </div>
                {comment.replies.map((reply) => (
                  <div className="space-y-2 border-gray-400">
                    <div className="flex items-center justify-between gap-2">
                      <p className="border-l-2 pl-2 text-muted-foreground">
                        Reply in the comment
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <Select
                          value={String(reply.userId)}
                          onValueChange={(value) =>
                            handleFormChange(
                              "data",
                              form.comments.comments.data.map((item) =>
                                item.id === comment.id
                                  ? {
                                      ...item,
                                      replies: item.replies.map((r) =>
                                        r.id === reply.id
                                          ? { ...r, userId: Number(value) }
                                          : r
                                      ),
                                    }
                                  : item
                              )
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select user" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              value={form.comments.users.creator.id.toString()}
                            >
                              <UserProfile
                                profilePicture={
                                  form.comments.users.creator.profilePicture
                                }
                              />
                              {form.comments.users.creator.name}
                            </SelectItem>
                            {form.comments.users.commentors.map((user) => (
                              <SelectItem
                                key={user.id}
                                value={user.id.toString()}
                              >
                                <UserProfile
                                  profilePicture={user.profilePicture}
                                />
                                {user.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          variant="outline"
                          className="cursor-pointer"
                          onClick={() =>
                            handleFormChange(
                              "data",
                              form.comments.comments.data.map((item) =>
                                item.id === comment.id
                                  ? {
                                      ...item,
                                      replies: item.replies.filter(
                                        (r) => r.id !== reply.id
                                      ),
                                    }
                                  : item
                              )
                            )
                          }
                        >
                          <Trash2 className="text-red-600" />
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      placeholder="Reply Comment"
                      value={reply.text}
                      onChange={(e) =>
                        handleFormChange(
                          "data",
                          form.comments.comments.data.map((item) =>
                            item.id === comment.id
                              ? {
                                  ...item,
                                  replies: item.replies.map((r) =>
                                    r.id === reply.id
                                      ? { ...r, text: e.target.value }
                                      : r
                                  ),
                                }
                              : item
                          )
                        )
                      }
                    />
                  </div>
                ))}
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
