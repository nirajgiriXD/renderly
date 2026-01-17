/**
 * Internal dependencies.
 */
import { APPS } from "@/constants";
import { getInitials } from "@/utils";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const Apps = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="enable-multiselect">Multiple selection</Label>
        <Select defaultValue="disable">
          <SelectTrigger className="w-full" id="enable-multiselect">
            <SelectValue placeholder="Multiple selection" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="enable">Enable</SelectItem>
            <SelectItem value="disable">Disable</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ToggleGroup
        size="sm"
        type="multiple"
        variant="outline"
        spacing={3}
        className="grid grid-cols-2 w-full"
      >
        {APPS.messages.map((app) => (
          <ToggleGroupItem
            asChild
            key={app.value}
            value={app.value}
            aria-label={`Toggle ${app.label}`}
            className="justify-start py-5 data-[state=off]:*:[svg]:opacity-0 data-[state=on]:*:[svg]:opacity-100"
          >
            <Label className="hover:bg-accent/50 flex items-center justify-between gap-3 rounded-lg border has-aria-checked:border-blue-600 has-aria-checked:bg-blue-50 dark:has-aria-checked:border-blue-900 dark:has-aria-checked:bg-blue-950">
              <div className="flex items-center gap-2">
                <Avatar className="size-5 rounded-none">
                  <AvatarImage src={app.logo} />
                  <AvatarFallback>{getInitials(app.label)}</AvatarFallback>
                </Avatar>
                <p className="leading-none font-medium">{app.label}</p>
              </div>
              <Checkbox
                id="toggle-2"
                className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
              />
            </Label>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};
