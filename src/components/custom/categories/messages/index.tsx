/**
 * External dependencies.
 */
import { Globe, MessageSquare, Users as UsersIcon, Palette } from "lucide-react";

/**
 * Internal dependencies.
 */
import { Apps } from "./Apps";
import { Chats } from "./Chats";
import { Users } from "./Users";
import { Appearance } from "./Appearance";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Messages = () => {
  return (
    <div className="p-4 sm:p-6 border rounded-xl">
      <Tabs defaultValue="apps" className="space-y-4">
        <TabsList className="flex flex-wrap gap-2 p-1">
          <TabsTrigger value="apps">
            <Globe />
            Apps
          </TabsTrigger>
          <TabsTrigger value="users">
            <UsersIcon />
            Users
          </TabsTrigger>
          <TabsTrigger value="chat">
            <MessageSquare />
            Chat
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette />
            Appearance
          </TabsTrigger>
        </TabsList>
        <TabsContent value="apps">
          <Apps />
        </TabsContent>
        <TabsContent value="users">
          <Users />
        </TabsContent>
        <TabsContent value="chat">
          <Chats />
        </TabsContent>
        <TabsContent value="appearance">
          <Appearance />
        </TabsContent>
      </Tabs>
    </div>
  );
};
