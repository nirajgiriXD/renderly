/**
 * External dependencies.
 */
import {
  Globe,
  Palette,
  MessageSquare,
  Users as UsersIcon,
} from "lucide-react";

/**
 * Internal dependencies.
 */
import { Apps } from "./Apps";
import { Users } from "./Users";
import { Comments as Chats } from "./Comments";
import { Appearance } from "./Appearance";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Comments = ({
  configurationTab,
  handleConfigurationTabChange,
}: {
  configurationTab: string;
  handleConfigurationTabChange: (value: string) => void;
}) => {
  return (
    <div className="p-4 sm:p-6 border rounded-xl">
      <Tabs
        className="space-y-4"
        defaultValue={configurationTab}
        onValueChange={handleConfigurationTabChange}
      >
        <TabsList className="flex flex-wrap gap-2 p-1">
          <TabsTrigger value="apps">
            <Globe />
            Apps
          </TabsTrigger>
          <TabsTrigger value="users">
            <UsersIcon />
            Users
          </TabsTrigger>
          <TabsTrigger value="comments">
            <MessageSquare />
            Comments
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
        <TabsContent value="comments">
          <Chats />
        </TabsContent>
        <TabsContent value="appearance">
          <Appearance />
        </TabsContent>
      </Tabs>
    </div>
  );
};
