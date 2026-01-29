/**
 * Internal dependencies.
 */
import type { AppsConfigBase } from "@/types/apps";
import type { AppearanceConfig } from "@/types/appearance";

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
