/**
 * External dependencies.
 */
import { useRef } from "react";
import { Eraser, RotateCcw, Settings as SettingsIcon, Upload } from "lucide-react";
import { toast } from "sonner";

/**
 * Internal dependencies.
 */
import { SelectField, SwitchField } from "@/components/common/fields";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useConfigActions, useSettings } from "@/store";

/**
 * Preferences plus the destructive content actions.
 *
 * Reset and clear live here rather than in the header so they take a
 * deliberate extra step to reach.
 */
export const SettingsDialog = () => {
  const { settings, updateSettings } = useSettings();
  const { resetAll, clearAll, importConfig } = useConfigActions();
  const importRef = useRef<HTMLInputElement>(null);

  const handleImport = async (file: File | undefined) => {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      importConfig(parsed);
      toast.success("Configuration imported.");
    } catch {
      toast.error("That file is not valid Post Preview JSON.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" aria-label="Settings">
          <SettingsIcon />
          <span className="hidden lg:inline">Settings</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Preferences are saved as you change them.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <SelectField
            label="Editor theme"
            hint="Independent of the theme used inside each preview."
            value={settings.colorScheme}
            onChange={(colorScheme) => updateSettings({ colorScheme })}
            options={[
              { label: "Match system", value: "system" },
              { label: "Light", value: "light" },
              { label: "Dark", value: "dark" },
            ]}
          />

          <SwitchField
            label="Save my work in this browser"
            hint="Text content is kept in local storage. Uploaded media never is."
            checked={settings.persistLocally}
            onChange={(persistLocally) => updateSettings({ persistLocally })}
          />

          <div className="space-y-2 rounded-lg border p-3">
            <p className="text-sm font-medium">Content</p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  resetAll();
                  toast.success("Restored the example content.");
                }}
              >
                <RotateCcw />
                Reset everything
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  clearAll();
                  toast.success("Cleared every field.");
                }}
              >
                <Eraser />
                Clear everything
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => importRef.current?.click()}
              >
                <Upload />
                Import JSON
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Reset restores the shipped example; clear empties every field but
              keeps your platform and appearance choices.
            </p>
            <input
              ref={importRef}
              type="file"
              accept="application/json"
              className="sr-only"
              onChange={(event) => {
                void handleImport(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
