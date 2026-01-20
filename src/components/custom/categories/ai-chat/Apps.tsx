/**
 * Internal dependencies.
 */
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { APPS } from "@/constants";
import { getInitials } from "@/utils";
import { useStore } from "@/hooks";

export const Apps = () => {
  const { form, handleFormChange, handleAppToggle } = useStore();

  return (
    <div className="space-y-4">
      {/* Multiple selection */}
      <div className="space-y-2">
        <Label htmlFor="enable-multiselect">Multiple selection</Label>
        <Select
          value={form["ai-chats"].apps.enableMultipleSelection}
          onValueChange={(value) =>
            handleFormChange("enableMultipleSelection", value)
          }
        >
          <SelectTrigger className="w-full" id="enable-multiselect">
            <SelectValue placeholder="Multiple selection" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="enable">Enable</SelectItem>
            <SelectItem value="disable">Disable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Apps */}
      <div className="grid grid-cols-2 gap-3">
        {APPS["ai-chats"].map((app) => {
          const isSelected = form["ai-chats"].apps.selectedApps[app.value];
          return (
            <Label
              key={app.value}
              htmlFor={`app-${app.value}`}
              className={`flex items-center justify-between gap-3 rounded-lg border p-4 cursor-pointer
                hover:bg-accent/50 transition-colors`}
            >
              <div className="flex items-center gap-2">
                <Avatar className="size-5 rounded-none">
                  <AvatarImage src={app.logo} />
                  <AvatarFallback>{getInitials(app.label)}</AvatarFallback>
                </Avatar>
                <p className="font-medium leading-none">{app.label}</p>
              </div>

              <Checkbox
                id={`app-${app.value}`}
                checked={isSelected}
                onCheckedChange={(checked: boolean) =>
                  handleAppToggle(app.value, checked)
                }
              />
            </Label>
          );
        })}
      </div>

      {/* AI Model */}
      <div className="space-y-2">
        <Label htmlFor="model" className="w-fit">
          Model
        </Label>
        <Select
          value={form["ai-chats"].apps.model}
          onValueChange={(value) => handleFormChange("model", value)}
        >
          <SelectTrigger className="w-full" id="model">
            <SelectValue placeholder="Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4">GPT 4</SelectItem>
            <SelectItem value="gpt-5">GPT 5</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
