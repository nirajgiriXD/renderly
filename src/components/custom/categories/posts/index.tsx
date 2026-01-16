/**
 * External dependencies.
 */
import { Globe, Gauge, TextSelect, User, Palette } from "lucide-react";

/**
 * Internal dependencies.
 */
import { Apps } from "./Apps";
import { Author } from "./Author";
import { Content } from "./Content";
import { Metrics } from "./Metrics";
import { Appearance } from "./Appearance";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Posts = () => {
  return (
    <div className="p-4 sm:p-6 border rounded-xl">
      <Tabs defaultValue="apps" className="space-y-4">
        {/* Tabs Trigger */}
        <TabsList className="flex flex-wrap gap-2 p-1">
          <TabsTrigger value="apps">
            <Globe />
            Apps
          </TabsTrigger>
          <TabsTrigger value="author">
            <User />
            Author
          </TabsTrigger>
          <TabsTrigger value="content">
            <TextSelect />
            Content
          </TabsTrigger>
          <TabsTrigger value="metrics">
            <Gauge />
            Metrics
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette />
            Appearance
          </TabsTrigger>
        </TabsList>

        {/* Tabs Content */}
        <TabsContent value="apps">
          <Apps />
        </TabsContent>
        <TabsContent value="author">
          <Author />
        </TabsContent>
        <TabsContent value="content">
          <Content />
        </TabsContent>
        <TabsContent value="metrics">
          <Metrics />
        </TabsContent>
        <TabsContent value="appearance">
          <Appearance />
        </TabsContent>
      </Tabs>
    </div>
  );
};
