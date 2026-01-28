/**
 * Internal dependencies.
 */
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AiChat, Messages, Comments, Post } from "@/components/custom/preview";
import { useStore } from "@/hooks";

export const PreviewSection = () => {
  const { form, categoryTab } = useStore();

  return (
    <div className="h-full w-full px-4 sm:px-6 overflow-y-auto">
      <div className="p-4 sm:p-6 border rounded-xl">
        <Tabs defaultValue="preview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="raw">Raw</TabsTrigger>
          </TabsList>

          {/* Post Preview */}
          <TabsContent value="preview">
            {categoryTab === "ai-chats" && <AiChat data={form[categoryTab]} />}
            {categoryTab === "messages" && (
              <Messages data={form[categoryTab]} />
            )}
            {categoryTab === "comments" && (
              <Comments data={form[categoryTab]} />
            )}
            {categoryTab === "posts" && <Post data={form[categoryTab]} />}
          </TabsContent>

          {/* Raw JSON */}
          <TabsContent value="raw">
            <pre className="bg-muted p-4 rounded-xl">
              {JSON.stringify(form[categoryTab], null, 2)}
            </pre>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
