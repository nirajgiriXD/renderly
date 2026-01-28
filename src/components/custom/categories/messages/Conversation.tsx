/**
 * External dependencies.
 */
import {
  GripVertical,
  Plus,
  ImagePlay,
  ArrowLeftRight,
  Trash2,
  CalendarDays,
} from "lucide-react";

/**
 * Internal dependencies.
 */
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableOverlay,
  SortableItemHandle,
} from "@/components/ui/sortable";
import { getInitials, convertBase64ToFiles } from "@/utils";
import { useStore } from "@/hooks";

export const Conversation = () => {
  const { form, handleFormChange } = useStore();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Message Type */}
      <div className="space-y-2">
        <Label htmlFor="type" className="w-fit">
          Type
        </Label>
        <Select
          value={form.messages.conversation.type}
          onValueChange={(value) => handleFormChange("type", value)}
        >
          <SelectTrigger className="w-full" id="type">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single</SelectItem>
            <SelectItem value="group">Group</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        {/* Heading */}
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="message" className="w-fit">
            Messages
          </Label>
          <Button
            size="sm"
            className="cursor-pointer"
            onClick={() =>
              handleFormChange("messages", [
                ...form.messages.conversation.messages,
                {
                  id: Date.now(),
                  text: "",
                  sender: "self",
                  media: null,
                  date: null,
                },
              ])
            }
          >
            <Plus />
            Add New
          </Button>
        </div>

        {/* Messages */}
        <Sortable
          value={form.messages.conversation.messages}
          onValueChange={(messages) => handleFormChange("messages", messages)}
          orientation="vertical"
          getItemValue={(item) => item.id}
        >
          <SortableContent className="space-y-4 md:space-y-6">
            {form.messages.conversation.messages.map((comment) => {
              const user =
                comment.sender === "self"
                  ? form.messages.users.sender
                  : form.messages.users.receiver;
              return (
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
                              <AvatarImage
                                src={
                                  user.profilePicture
                                    ? URL.createObjectURL(
                                        convertBase64ToFiles(
                                          user.profilePicture
                                        ) as unknown as File
                                      )
                                    : ""
                                }
                              />
                              <AvatarFallback>
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <p>{user.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() =>
                              handleFormChange(
                                "messages",
                                form.messages.conversation.messages.map(
                                  (msg) =>
                                    msg.id === comment.id
                                      ? {
                                          ...msg,
                                          sender:
                                            msg.sender === "self"
                                              ? "other"
                                              : "self",
                                        }
                                      : msg
                                )
                              )
                            }
                          >
                            <ArrowLeftRight />
                            Toggle User
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="cursor-pointer text-rose-600"
                            onClick={() =>
                              handleFormChange(
                                "messages",
                                form.messages.conversation.messages.filter(
                                  (item) => item.id !== comment.id
                                )
                              )
                            }
                          >
                            <Trash2 />
                            Delete Message
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        placeholder="Comment"
                        value={comment.text}
                        onChange={(e) =>
                          handleFormChange(
                            "messages",
                            form.messages.conversation.messages.map((msg) =>
                              msg.id === comment.id
                                ? { ...msg, text: e.target.value }
                                : msg
                            )
                          )
                        }
                      />
                      <div className="flex items-center gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-fit justify-between"
                            >
                              <CalendarDays />
                              {comment.date ? comment.date : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="start"
                            className="w-auto overflow-hidden p-0"
                          >
                            <Calendar
                              mode="single"
                              selected={
                                new Date(
                                  comment.date || new Date().toDateString()
                                )
                              }
                              captionLayout="dropdown"
                              onSelect={(date) =>
                                handleFormChange(
                                  "messages",
                                  form.messages.conversation.messages.map(
                                    (msg) =>
                                      msg.id === comment.id
                                        ? {
                                            ...msg,
                                            date: date?.toDateString() || null,
                                          }
                                        : msg
                                  )
                                )
                              }
                            />
                          </PopoverContent>
                        </Popover>
                        <Button variant="outline" size="sm" asChild>
                          <Label
                            htmlFor={`media-upload-${comment.id}`}
                            className="cursor-pointer"
                          >
                            <ImagePlay />
                            <span>Attach Media</span>
                          </Label>
                        </Button>
                        <Input
                          type="file"
                          className="hidden"
                          id={`media-upload-${comment.id}`}
                          accept="image/*, video/*"
                          placeholder="Select media file"
                          onChange={(e) =>
                            handleFormChange(
                              "messages",
                              form.messages.conversation.messages.map((msg) =>
                                msg.id === comment.id
                                  ? {
                                      ...msg,
                                      media: e.target.files
                                        ? e.target.files[0]
                                        : null,
                                    }
                                  : msg
                              )
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </SortableItem>
              );
            })}
          </SortableContent>
          <SortableOverlay>
            <div className="size-full rounded-md bg-primary/10" />
          </SortableOverlay>
        </Sortable>
      </div>
    </div>
  );
};
