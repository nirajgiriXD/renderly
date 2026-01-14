/**
 * External dependencies.
 */
import { Globe, Gauge, TextSelect, User, Palette } from "lucide-react";

/**
 * Internal dependencies.
 */
import { APPS } from "@/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Posts = () => {
  return (
    <div className="p-4 sm:p-6 border rounded-xl">
      <Tabs defaultValue="app" className="space-y-2">
        <TabsList className="flex flex-wrap gap-2 p-1">
          <TabsTrigger value="app">
            <Globe />
            App
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
        <TabsContent value="app">
          {APPS.POSTS.map((app) => (
            <div key={app.value} className="mb-4">
              <h2 className="text-2xl font-bold mb-2">{app.label}</h2>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="author">
          <h2 className="text-2xl font-bold">Author Settings</h2>
        </TabsContent>
        <TabsContent value="content">
          <h2 className="text-2xl font-bold">Content Settings</h2>
        </TabsContent>
        <TabsContent value="metrics">
          <h2 className="text-2xl font-bold">Metrics Settings</h2>
        </TabsContent>
        <TabsContent value="appearance">
          <h2 className="text-2xl font-bold">Appearance Settings</h2>
        </TabsContent>
      </Tabs>
    </div>
  );
};
