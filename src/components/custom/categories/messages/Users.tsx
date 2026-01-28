/**
 * External dependencies.
 */
import { User } from "lucide-react";

/**
 * Internal dependencies.
 */
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  convertFilesToBase64,
  convertBase64ToFiles,
  checkFileSize,
} from "@/utils";
import { MAX_FILE_SIZE_KB } from "@/constants";
import { useStore } from "@/hooks";

export const Users = () => {
  const { form, handleFormChange } = useStore();

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="space-y-1">
        <Label className="text-base font-semibold">Sender</Label>
        <div className="flex items-center gap-3 border rounded-md p-3">
          <Label
            htmlFor="sender-profile-image"
            className="cursor-pointer size-9 bg-muted rounded-full shrink-0 flex items-center justify-center"
          >
            <Avatar
              className={`text-muted-foreground ${form.messages.users.sender.profilePicture ? "size-9" : "size-5"}`}
            >
              <AvatarImage
                src={
                  form.messages.users.sender.profilePicture
                    ? URL.createObjectURL(
                        convertBase64ToFiles(
                          form.messages.users.sender.profilePicture
                        ) as unknown as File
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
            id="sender-profile-image"
            placeholder="Select an image"
            onChange={async (e) => {
              const file = e.target.files ? e.target.files[0] : null;
              if (file && !checkFileSize(file)) {
                alert(`File size exceeds the limit of ${MAX_FILE_SIZE_KB} KB.`);
                e.target.value = "";
                return;
              }
              const base64 = file ? await convertFilesToBase64(file) : null;
              handleFormChange("sender", {
                ...form.messages.users.sender,
                profilePicture: base64,
              });
            }}
          />
          <Input
            type="text"
            id="sender-name"
            placeholder="Name"
            value={form.messages.users.sender.name}
            onChange={(e) =>
              handleFormChange("sender", {
                ...form.messages.users.sender,
                name: e.target.value,
              })
            }
          />
          <Input
            type="text"
            id="sender-username"
            placeholder="Username"
            value={form.messages.users.sender.username}
            onChange={(e) =>
              handleFormChange("sender", {
                ...form.messages.users.sender,
                username: e.target.value,
              })
            }
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-base font-semibold">Receiver</Label>
        <div className="flex items-center gap-3 border rounded-md p-3">
          <Label
            htmlFor="receiver-profile-image"
            className="cursor-pointer size-9 bg-muted rounded-full shrink-0 flex items-center justify-center"
          >
            <Avatar
              className={`text-muted-foreground ${form.messages.users.receiver.profilePicture ? "size-9" : "size-5"}`}
            >
              <AvatarImage
                src={
                  form.messages.users.receiver.profilePicture
                    ? URL.createObjectURL(
                        convertBase64ToFiles(
                          form.messages.users.receiver.profilePicture
                        ) as unknown as File
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
            id="receiver-profile-image"
            placeholder="Select an image"
            onChange={async (e) => {
              const file = e.target.files ? e.target.files[0] : null;
              if (file && !checkFileSize(file)) {
                alert(`File size exceeds the limit of ${MAX_FILE_SIZE_KB} KB.`);
                e.target.value = "";
                return;
              }
              const base64 = file ? await convertFilesToBase64(file) : null;
              handleFormChange("receiver", {
                ...form.messages.users.receiver,
                profilePicture: base64,
              });
            }}
          />
          <Input
            type="text"
            id="receiver-name"
            placeholder="Name"
            value={form.messages.users.receiver.name}
            onChange={(e) =>
              handleFormChange("receiver", {
                ...form.messages.users.receiver,
                name: e.target.value,
              })
            }
          />
          <Input
            type="text"
            id="receiver-username"
            placeholder="Username"
            value={form.messages.users.receiver.username}
            onChange={(e) =>
              handleFormChange("receiver", {
                ...form.messages.users.receiver,
                username: e.target.value,
              })
            }
          />
        </div>
      </div>
    </div>
  );
};
