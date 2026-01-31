/**
 * Internal dependencies.
 */
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { convertFilesToBase64 } from "@/utils";
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
          onChange={async (e) => {
            const file = e.target.files ? e.target.files[0] : null;
            const base64 = file ? await convertFilesToBase64(file) : null;
            handleFormChange("media", base64);
          }}
        />
      </div>
    </div>
  );
};
export default Content;
