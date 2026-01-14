/**
 * External dependencies.
 */
import { Bot, MessageSquare, Palette } from "lucide-react";

/**
 * Internal dependencies.
 */
import { APPS } from "@/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const AiChats = () => {
  return (
    <div className="p-4 sm:p-6 border rounded-xl">
      <Tabs defaultValue="model" className="space-y-2">
        <TabsList className="flex flex-wrap gap-2 p-1">
          <TabsTrigger value="model">
            <Bot />
            Model
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageSquare />
            Messages
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette />
            Appearance
          </TabsTrigger>
        </TabsList>
        <TabsContent value="model">
          {APPS['AI-CHATS'].map((app) => (
            <div key={app.value} className="mb-4">
              <h2 className="text-2xl font-bold mb-2">{app.label}</h2>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="messages">
          <h2 className="text-2xl font-bold">Messages</h2>
        </TabsContent>
        <TabsContent value="appearance">
          <h2 className="text-2xl font-bold">Appearance</h2>
        </TabsContent>
      </Tabs>
    </div>
  );
};
