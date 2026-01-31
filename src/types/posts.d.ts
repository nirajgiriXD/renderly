/**
 * Internal dependencies.
 */
import type { AppsConfigBase, AppearanceConfig } from "@/types/general";

export type PostsConfig = {
  apps: AppsConfigBase;
  author: {
    name: string;
    username: string;
    jobTitle: string;
    verificationStatus: "verified" | "unverified";
    profilePicture: string | null;
  };
  content: {
    caption: string;
    media: string | null;
  };
  metrics: {
    reactions: number;
    comments: number;
    reposts: number;
    views: number;
    date: string;
  };
  appearance: AppearanceConfig;
};
