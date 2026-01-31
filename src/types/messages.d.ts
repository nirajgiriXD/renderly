/**
 * Internal dependencies.
 */
import type { AppsConfigBase, AppearanceConfig } from "@/types/general";

export type MessagesConfig = {
  apps: AppsConfigBase;
  users: {
    sender: {
      name: string;
      username: string;
      profilePicture: string | null;
    };
    receiver: {
      name: string;
      username: string;
      profilePicture: string | null;
    };
  };
  conversation: {
    type: "single" | "group";
    messages: Array<{
      id: number;
      text: string;
      sender: "self" | "other";
      media: string | null;
      date: string | null;
    }>;
  };
  appearance: AppearanceConfig;
};
