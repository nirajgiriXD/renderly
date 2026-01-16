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

export const Users = () => {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="space-y-2 border rounded-md p-3">
        <Label className="text-base font-semibold">Creator / Author</Label>
        <div className="flex items-center gap-3">
          <Label
            htmlFor="creator-profile-image"
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
            id="creator-profile-image"
            placeholder="Select an image"
          />
          <Input type="text" id="creator-name" placeholder="Name" />
          <Input type="text" id="creator-username" placeholder="Username" />
        </div>
      </div>

      <div className="space-y-2 border rounded-md p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Label className="text-base font-semibold">Commenters</Label>
            <Badge variant="secondary">5</Badge>
          </div>
          <Button size="sm" className="cursor-pointer">
            <Plus />
            Add New
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Label
            htmlFor="commenter-profile-image"
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
            id="commenter-profile-image"
            placeholder="Select an image"
          />
          <Input type="text" id="commenter-name" placeholder="Name" />
          <Input type="text" id="commenter-username" placeholder="Username" />
          <Button variant="outline" className="cursor-pointer">
            <Trash2 className="text-rose-600" />
          </Button>
        </div>
      </div>
    </div>
  );
};
