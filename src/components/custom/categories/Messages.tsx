/**
 * External dependencies.
 */
import { Globe, MessageSquare, Users, Palette, MailCheck } from "lucide-react";

/**
 * Internal dependencies.
 */
import { APPS } from "@/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Messages = () => {
  return (
    <div className="p-4 sm:p-6 border rounded-xl">
      <Tabs defaultValue="app" className="space-y-2">
        <TabsList className="flex flex-wrap gap-2 p-1">
          <TabsTrigger value="app">
            <Globe />
            App
          </TabsTrigger>
          <TabsTrigger value="type">
            <MailCheck />
            Type
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users />
            Users
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
        <TabsContent value="app">
          {APPS.MESSAGES.map((app) => (
            <div key={app.value} className="mb-4">
              <h2 className="text-2xl font-bold mb-2">{app.label}</h2>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="type">
          <h2 className="text-2xl font-bold">Type</h2>
        </TabsContent>
        <TabsContent value="users">
          <h2 className="text-2xl font-bold">Users</h2>
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
