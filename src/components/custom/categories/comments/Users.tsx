/**
 * External dependencies.
 */
import { Plus, Trash2, User } from "lucide-react";

/**
 * Internal dependencies.
 */
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useStore } from "@/hooks";

export const Users = () => {
  const { form, handleFormChange } = useStore();

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="space-y-2 border rounded-md p-3">
        <Label className="text-base font-semibold">Creator / Author</Label>
        <div className="flex items-center gap-3">
          <Label
            htmlFor="creator-profile-image"
            className="cursor-pointer size-9 bg-muted rounded-full shrink-0 flex items-center justify-center"
          >
            <Avatar
              className={`text-muted-foreground ${form.comments.users.creator.profilePicture ? "size-9" : "size-5"}`}
            >
              <AvatarImage
                src={
                  form.comments.users.creator.profilePicture
                    ? URL.createObjectURL(
                        form.comments.users.creator
                          .profilePicture as unknown as File
                      )
                    : ""
                }
              />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
          </Label>
          <Input
            type="file"
            className="hidden"
            accept="image/*"
            id="creator-profile-image"
            placeholder="Select an image"
            onChange={(e) =>
              handleFormChange("creator", {
                ...form.comments.users.creator,
                profilePicture: e.target.files ? e.target.files[0] : null,
              })
            }
          />
          <Input
            type="text"
            id="creator-name"
            placeholder="Name"
            value={form.comments.users.creator.name}
            onChange={(e) =>
              handleFormChange("creator", {
                ...form.comments.users.creator,
                name: e.target.value,
              })
            }
          />
          <Input
            type="text"
            id="creator-username"
            placeholder="Username"
            value={form.comments.users.creator.username}
            onChange={(e) =>
              handleFormChange("creator", {
                ...form.comments.users.creator,
                username: e.target.value,
              })
            }
          />
        </div>
      </div>

      <div className="space-y-2 border rounded-md p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Label className="text-base font-semibold">Commenters</Label>
            <Badge variant="secondary">
              {form.comments.users.commentors.length}
            </Badge>
          </div>
          <Button
            size="sm"
            className="cursor-pointer"
            onClick={() => {
              const newCommentor = {
                id: Date.now(),
                name: "",
                username: "",
                profilePicture: null,
              };
              handleFormChange("commentors", [
                ...form.comments.users.commentors,
                newCommentor,
              ]);
            }}
          >
            <Plus />
            Add New
          </Button>
        </div>
        {form.comments.users.commentors.map((commentor, index) => (
          <div className="flex items-center gap-3" key={`commentors-${index}`}>
            <Label
              htmlFor="commenter-profile-image"
              className="cursor-pointer size-9 bg-muted rounded-full shrink-0 flex items-center justify-center"
            >
              <Avatar
                className={`text-muted-foreground ${commentor.profilePicture ? "size-9" : "size-5"}`}
              >
                <AvatarImage
                  src={
                    commentor.profilePicture
                      ? URL.createObjectURL(
                          commentor.profilePicture as unknown as File
                        )
                      : ""
                  }
                />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
            </Label>
            <Input
              type="file"
              className="hidden"
              accept="image/*"
              id="commenter-profile-image"
              placeholder="Select an image"
              onChange={(e) =>
                handleFormChange(
                  "commentors",
                  form.comments.users.commentors.map((item, idx) =>
                    idx === index
                      ? {
                          ...item,
                          profilePicture: e.target.files
                            ? e.target.files[0]
                            : null,
                        }
                      : item
                  )
                )
              }
            />
            <Input
              type="text"
              placeholder="Name"
              value={commentor.name}
              onChange={(e) =>
                handleFormChange(
                  "commentors",
                  form.comments.users.commentors.map((item, idx) =>
                    idx === index
                      ? {
                          ...item,
                          name: e.target.value,
                        }
                      : item
                  )
                )
              }
            />
            <Input
              type="text"
              placeholder="Username"
              value={commentor.username}
              onChange={(e) =>
                handleFormChange(
                  "commentors",
                  form.comments.users.commentors.map((item, idx) =>
                    idx === index
                      ? {
                          ...item,
                          username: e.target.value,
                        }
                      : item
                  )
                )
              }
            />
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => {
                handleFormChange(
                  "commentors",
                  form.comments.users.commentors.filter(
                    (item) => item.id !== commentor.id
                  )
                );
              }}
            >
              <Trash2 className="text-rose-600" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
