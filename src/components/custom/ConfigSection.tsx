/**
 * Internal dependencies.
 */
import { CATEGORIES, TABS } from "@/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Posts,
  AiChats,
  Comments,
  Messages,
} from "@/components/custom/categories";
import { useStore } from "@/hooks";

export const ConfigSection = () => {
  const { categoryTab, setCategoryTab, configurationTab, setConfigurationTab } =
    useStore();

  return (
    <div className="h-full p-4 sm:p-6 overflow-y-auto">
      <Tabs
        defaultValue={categoryTab}
        className="space-y-2"
        onValueChange={(value) => setCategoryTab(value as keyof typeof TABS)}
      >
        <TabsList className="flex flex-wrap gap-2 p-1">
          {CATEGORIES.map((category) => (
            <TabsTrigger
              key={`category-${category.value}`}
              value={category.value}
              className="cursor-pointer"
            >
              <category.icon />
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent
          value={
            CATEGORIES.find((category) => category.value === "posts")?.value ||
            "posts"
          }
        >
          <Posts
            configurationTab={configurationTab}
            setConfigurationTab={setConfigurationTab}
          />
        </TabsContent>
        <TabsContent
          value={
            CATEGORIES.find((category) => category.value === "comments")
              ?.value || "comments"
          }
        >
          <Comments
            configurationTab={configurationTab}
            setConfigurationTab={setConfigurationTab}
          />
        </TabsContent>
        <TabsContent
          value={
            CATEGORIES.find((category) => category.value === "messages")
              ?.value || "messages"
          }
        >
          <Messages
            configurationTab={configurationTab}
            setConfigurationTab={setConfigurationTab}
          />
        </TabsContent>
        <TabsContent
          value={
            CATEGORIES.find((category) => category.value === "ai-chats")
              ?.value || "ai-chats"
          }
        >
          <AiChats
            configurationTab={configurationTab}
            setConfigurationTab={setConfigurationTab}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
