/**
 * External dependencies.
 */
import { memo } from "react";
import { User } from "lucide-react";

/**
 * Internal dependencies.
 */
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const UserProfile = memo(
  ({
    profilePicture,
    className,
  }: {
    profilePicture: string | null;
    className?: string;
  }) => {
    return (
      <Avatar
        className={`text-muted-foreground ${profilePicture ? "size-9" : "size-5"} ${className ?? ""}`}
      >
        <AvatarImage
          src={profilePicture || ""}
        />
        <AvatarFallback>
          <User />
        </AvatarFallback>
      </Avatar>
    );
  }
);
