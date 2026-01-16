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

export const Appearance = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-2">
        <Label htmlFor="theme" className="w-fit">
          Theme
        </Label>
        <Select defaultValue="light">
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
        <Select defaultValue="android">
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
