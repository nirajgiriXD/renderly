/**
 * External dependencies.
 */
import { Bot, MessageSquare, Palette } from "lucide-react";

/**
 * Internal dependencies.
 */
import { Apps } from "./Apps";
import { Appearance } from "./Appearance";
import { Conversation } from "./Conversation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const AiChats = ({
  configurationTab,
  handleConfigurationTabChange,
}: {
  configurationTab: string;
  handleConfigurationTabChange: (value: string) => void;
}) => {
  return (
    <div className="p-4 sm:p-6 border rounded-xl h-full">
      <Tabs
        className="space-y-4"
        defaultValue={configurationTab}
        onValueChange={handleConfigurationTabChange}
      >
        <div className="overflow-x-auto">
          <TabsList className="flex items-center gap-2 p-1">
            <TabsTrigger value="apps">
              <Bot />
              Apps
            </TabsTrigger>
            <TabsTrigger value="conversation">
              <MessageSquare />
              Conversation
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette />
              Appearance
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="apps">
          <Apps />
        </TabsContent>
        <TabsContent value="conversation">
          <Conversation />
        </TabsContent>
        <TabsContent value="appearance">
          <Appearance />
        </TabsContent>
      </Tabs>
    </div>
  );
};
