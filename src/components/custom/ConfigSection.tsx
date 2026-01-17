/**
 * Internal dependencies.
 */
import { CATEGORIES } from "@/constants";
import { TabsContent } from "@/components/ui/tabs";
import {
  Posts,
  AiChats,
  Comments,
  Messages,
} from "@/components/custom/categories";
import { useStore } from "@/hooks";

export const ConfigSection = () => {
  const { configurationTab, handleConfigurationTabChange } = useStore();

  return (
    <div className="h-full px-4 sm:px-6 overflow-y-auto">
      <TabsContent
        value={
          CATEGORIES.find((category) => category.value === "posts")?.value ||
          "posts"
        }
      >
        <Posts
          configurationTab={configurationTab}
          handleConfigurationTabChange={handleConfigurationTabChange}
        />
      </TabsContent>
      <TabsContent
        value={
          CATEGORIES.find((category) => category.value === "comments")?.value ||
          "comments"
        }
      >
        <Comments
          configurationTab={configurationTab}
          handleConfigurationTabChange={handleConfigurationTabChange}
        />
      </TabsContent>
      <TabsContent
        value={
          CATEGORIES.find((category) => category.value === "messages")?.value ||
          "messages"
        }
      >
        <Messages
          configurationTab={configurationTab}
          handleConfigurationTabChange={handleConfigurationTabChange}
        />
      </TabsContent>
      <TabsContent
        value={
          CATEGORIES.find((category) => category.value === "ai-chats")?.value ||
          "ai-chats"
        }
      >
        <AiChats
          configurationTab={configurationTab}
          handleConfigurationTabChange={handleConfigurationTabChange}
        />
      </TabsContent>
    </div>
  );
};
