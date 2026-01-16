/**
 * Internal dependencies.
 */
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Content = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-2">
        <Label htmlFor="caption" className="w-fit">
          Caption
        </Label>
        <Textarea id="caption" placeholder="Caption" />
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
        />
      </div>
    </div>
  );
};
export default Content;
