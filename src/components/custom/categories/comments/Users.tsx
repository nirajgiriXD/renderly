/**
 * External dependencies.
 */
import { Plus, Trash2 } from "lucide-react";

/**
 * Internal dependencies.
 */
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/components/custom/UserProfile";
import { convertFilesToBase64, checkFileSize } from "@/utils";
import { MAX_FILE_SIZE_KB } from "@/constants";
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
            <UserProfile
              profilePicture={form.comments.users.creator.profilePicture}
            />
          </Label>
          <Input
            type="file"
            className="hidden"
            accept="image/*"
            id="creator-profile-image"
            placeholder="Select an image"
            onChange={async (e) => {
              const file = e.target.files ? e.target.files[0] : null;
              if (file && !checkFileSize(file)) {
                alert(`File size exceeds the limit of ${MAX_FILE_SIZE_KB} KB.`);
                e.target.value = "";
                return;
              }
              const base64 = file ? await convertFilesToBase64(file) : null;
              handleFormChange("creator", {
                ...form.comments.users.creator,
                profilePicture: base64,
              });
            }}
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
              htmlFor={`commenter-profile-image-${index}`}
              className="cursor-pointer size-9 bg-muted rounded-full shrink-0 flex items-center justify-center"
            >
              <UserProfile profilePicture={commentor.profilePicture} />
            </Label>
            <Input
              type="file"
              className="hidden"
              accept="image/*"
              id={`commenter-profile-image-${index}`}
              placeholder="Select an image"
              onChange={async (e) => {
                const file = e.target.files ? e.target.files[0] : null;
                if (file && !checkFileSize(file)) {
                  alert(
                    `File size exceeds the limit of ${MAX_FILE_SIZE_KB} KB.`
                  );
                  e.target.value = "";
                  return;
                }
                const base64 = file ? await convertFilesToBase64(file) : null;
                handleFormChange(
                  "commentors",
                  form.comments.users.commentors.map((item, idx) =>
                    idx === index
                      ? {
                          ...item,
                          profilePicture: base64,
                        }
                      : item
                  )
                );
              }}
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
