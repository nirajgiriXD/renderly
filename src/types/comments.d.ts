/**
 * Internal dependencies.
 */
import type { AppsConfigBase } from "@/types/apps";
import type { AppearanceConfig } from "@/types/appearance";

export type CommentsConfig = {
  apps: AppsConfigBase;
  users: {
    creator: {
      id: number;
      name: string;
      username: string;
      profilePicture: string | null;
    };
    commentors: Array<{
      id: number;
      name: string;
      username: string;
      profilePicture: string | null;
    }>;
  };
  comments: {
    data: Array<{
      id: number;
      text: string;
      userId: number;
      replies: Array<{
        id: number;
        text: string;
        userId: number;
      }>;
    }>;
  };
  appearance: AppearanceConfig;
};
