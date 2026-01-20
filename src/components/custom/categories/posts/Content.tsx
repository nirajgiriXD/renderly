/**
 * Internal dependencies.
 */
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/hooks";

export const Content = () => {
  const { form, handleFormChange } = useStore();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-2">
        <Label htmlFor="caption" className="w-fit">
          Caption
        </Label>
        <Textarea
          id="caption"
          placeholder="Caption"
          value={form.posts.content.caption}
          onChange={(e) => handleFormChange("caption", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="media" className="w-fit">
          Image or Video
        </Label>
        <Input
          type="file"
          accept="image/*, video/*"
          id="media"
          placeholder="Select an image or video"
          onChange={(e) =>
            handleFormChange("media", e.target.files?.[0] || null)
          }
        />
      </div>
    </div>
  );
};
export default Content;
