/**
 * Internal dependencies.
 */
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/hooks";

export const Metrics = () => {
  const { form, handleFormChange } = useStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="reactions" className="w-fit">
          Reactions
        </Label>
        <Input
          type="number"
          id="reactions"
          placeholder="Number of Reactions"
          value={form.posts.metrics.reactions}
          onChange={(e) => handleFormChange("reactions", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="comments" className="w-fit">
          Comments
        </Label>
        <Input
          type="number"
          id="comments"
          placeholder="Number of Comments"
          value={form.posts.metrics.comments}
          onChange={(e) => handleFormChange("comments", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reposts" className="w-fit">
          Reposts
        </Label>
        <Input
          type="number"
          id="reposts"
          placeholder="Number of Reposts"
          value={form.posts.metrics.reposts}
          onChange={(e) => handleFormChange("reposts", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="views" className="w-fit">
          Views
        </Label>
        <Input
          type="number"
          id="views"
          placeholder="Number of Views"
          value={form.posts.metrics.views}
          onChange={(e) => handleFormChange("views", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="date" className="w-fit">
          Date
        </Label>
        <Input
          type="date"
          id="date"
          placeholder="Date"
          value={form.posts.metrics.date}
          onChange={(e) => handleFormChange("date", e.target.value)}
        />
      </div>
    </div>
  );
};
