/**
 * Internal dependencies.
 */
import { AppsConfigBase } from "@/types/apps";
import { AppearanceConfig } from "@/types/appearance";

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
