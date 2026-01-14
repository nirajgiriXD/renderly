/**
 * Internal dependencies.
 */
import { CATEGORIES } from "@/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Posts,
  AiChats,
  Comments,
  Messages,
} from "@/components/custom/categories";

export const ConfigSection = () => {
  return (
    <div className="h-full p-4 sm:p-6">
      <Tabs defaultValue={CATEGORIES[0].value} className="space-y-2">
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
          <Posts />
        </TabsContent>
        <TabsContent
          value={
            CATEGORIES.find((category) => category.value === "comments")
              ?.value || "comments"
          }
        >
          <Comments />
        </TabsContent>
        <TabsContent
          value={
            CATEGORIES.find((category) => category.value === "messages")?.value ||
            "messages"
          }
        >
          <Messages />
        </TabsContent>
        <TabsContent
          value={
            CATEGORIES.find((category) => category.value === "ai-chats")
              ?.value || "ai-chats"
          }
        >
          <AiChats />
        </TabsContent>
      </Tabs>
    </div>
  );
};
