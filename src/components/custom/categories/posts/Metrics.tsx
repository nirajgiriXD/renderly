/**
 * Internal dependencies.
 */
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Metrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="reactions" className="w-fit">
          Reactions
        </Label>
        <Input type="number" id="reactions" placeholder="Number of Reactions" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="comments" className="w-fit">
          Comments
        </Label>
        <Input type="number" id="comments" placeholder="Number of Comments" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reposts" className="w-fit">
          Reposts
        </Label>
        <Input type="number" id="reposts" placeholder="Number of Reposts" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="views" className="w-fit">
          Views
        </Label>
        <Input type="number" id="views" placeholder="Number of Views" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="shares" className="w-fit">
          Shares
        </Label>
        <Input type="number" id="shares" placeholder="Number of Shares" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="date" className="w-fit">
          Date
        </Label>
        <Input type="date" id="date" placeholder="Date" />
      </div>
    </div>
  );
};
