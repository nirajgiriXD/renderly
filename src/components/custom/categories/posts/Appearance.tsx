/**
 * Internal dependencies.
 */
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/hooks";

export const Appearance = () => {
  const { form, handleFormChange } = useStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="theme" className="w-fit">
          Theme
        </Label>
        <Select
          value={form.posts.appearance.theme}
          onValueChange={(value) => handleFormChange("theme", value)}
        >
          <SelectTrigger className="w-full" id="theme">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="device" className="w-fit">
          Device
        </Label>
        <Select
          value={form.posts.appearance.device}
          onValueChange={(value) => handleFormChange("device", value)}
        >
          <SelectTrigger className="w-full" id="device">
            <SelectValue placeholder="Device" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="android">Android</SelectItem>
            <SelectItem value="iphone">iPhone</SelectItem>
            <SelectItem value="desktop">Desktop</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
