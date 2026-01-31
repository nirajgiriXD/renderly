/**
 * Internal dependencies.
 */
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UserProfile } from "@/components/custom/UserProfile";
import { convertFilesToBase64 } from "@/utils";
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
            <UserProfile
              profilePicture={form.messages.users.sender.profilePicture}
            />
          </Label>
          <Input
            type="file"
            className="hidden"
            accept="image/*"
            id="sender-profile-image"
            placeholder="Select an image"
            onChange={async (e) => {
              const file = e.target.files ? e.target.files[0] : null;
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
            <UserProfile
              profilePicture={form.messages.users.receiver.profilePicture}
            />
          </Label>
          <Input
            type="file"
            className="hidden"
            accept="image/*"
            id="receiver-profile-image"
            placeholder="Select an image"
            onChange={async (e) => {
              const file = e.target.files ? e.target.files[0] : null;
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
