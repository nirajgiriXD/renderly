/**
 * Internal dependencies.
 */
import type { AppsConfigBase, AppearanceConfig } from "@/types/general";

export type AiChatsConfig = {
  apps: AppsConfigBase & {
    model: string;
  };
  conversation: {
    data: Array<{
      id: number;
      text: string;
      sender: "user" | "bot";
    }>;
  };
  appearance: AppearanceConfig;
};
