/**
 * External dependencies.
 */
import { SettingsIcon } from "lucide-react";

/**
 * Internal dependencies.
 */
import {
  Dialog,
  DialogTrigger,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useStore } from "@/hooks";

export const Settings = () => {
  const { settings, handleSettingsChange } = useStore();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="cursor-pointer">
          <SettingsIcon className="size-5" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader className="border-b pb-4">
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Make changes to your settings, changes will be saved automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <Label htmlFor="save-on-local-storage">
                Save data on browser
              </Label>
              <p className="text-sm text-muted-foreground">
                Save your data locally on the browser.
              </p>
            </div>
            <Select
              value={settings.saveOnLocalStorage ? "enable" : "disable"}
              onValueChange={(value) =>
                handleSettingsChange("saveOnLocalStorage", value === "enable")
              }
            >
              <SelectTrigger id="save-on-local-storage">
                <SelectValue placeholder="Save data on browser" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enable">Enable</SelectItem>
                <SelectItem value="disable">Disable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <Label htmlFor="clear-on-local-storage">
                Clear data on browser
              </Label>
              <p className="text-sm text-muted-foreground">
                Clear your data stored on the browser.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="min-w-22.5"
              onClick={() => localStorage.clear()}
            >
              Clear
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
