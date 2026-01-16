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

export const Users = () => {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="space-y-1">
        <Label className="text-base font-semibold">Sender</Label>
        <div className="flex items-center gap-3 border rounded-md p-3">
          <Label
            htmlFor="sender-profile-image"
            className="cursor-pointer size-9 bg-muted rounded-full shrink-0 flex items-center justify-center"
          >
            <Avatar className="size-5 text-muted-foreground">
              <AvatarImage src="" />
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
          />
          <Input type="text" id="sender-name" placeholder="Name" />
          <Input type="text" id="sender-username" placeholder="Username" />
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-base font-semibold">Receiver</Label>
        <div className="flex items-center gap-3 border rounded-md p-3">
          <Label
            htmlFor="receiver-profile-image"
            className="cursor-pointer size-9 bg-muted rounded-full shrink-0 flex items-center justify-center"
          >
            <Avatar className="size-5 text-muted-foreground">
              <AvatarImage src="" />
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
          />
          <Input type="text" id="receiver-name" placeholder="Name" />
          <Input type="text" id="receiver-username" placeholder="Username" />
        </div>
      </div>
    </div>
  );
};
