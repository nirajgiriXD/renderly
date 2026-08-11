/**
 * External dependencies.
 */
import { useRef } from "react";
import type { ReactNode } from "react";
import {
  Eraser,
  Monitor,
  Moon,
  RotateCcw,
  Settings as SettingsIcon,
  Sun,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

/**
 * Internal dependencies.
 */
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Segmented } from "@/components/ui/segmented";
import { Switch } from "@/components/ui/switch";
import { Hint } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useConfigActions, useSettings } from "@/store";
import type { Settings } from "@/types";

const SCHEMES = [
  { value: "system" as const, label: "System", icon: Monitor },
  { value: "light" as const, label: "Light", icon: Sun },
  { value: "dark" as const, label: "Dark", icon: Moon },
];

/** Label + explanation on the left, the control on the right. */
const SettingRow = ({
  title,
  description,
  control,
  stacked = false,
  className,
}: {
  title: string;
  description: ReactNode;
  control: ReactNode;
  /** Puts the control on its own line, for anything wider than a switch. */
  stacked?: boolean;
  className?: string;
}) => (
  <div
    className={cn(
      "px-4 py-3.5",
      stacked ? "space-y-3" : "flex items-center justify-between gap-6",
      className
    )}
  >
    <div className="min-w-0 space-y-0.5">
      <p className="text-[0.8125rem] font-medium leading-tight">{title}</p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
    <div className={cn(!stacked && "shrink-0")}>{control}</div>
  </div>
);

/**
 * Preferences plus the destructive content actions.
 *
 * Reset and clear live here rather than on the toolbar so they take a
 * deliberate extra step to reach, and both now ask before throwing work away.
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
      <Hint label="Settings">
        <DialogTrigger asChild>
          <Button size="icon-sm" variant="ghost" aria-label="Settings">
            <SettingsIcon />
          </Button>
        </DialogTrigger>
      </Hint>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Preferences apply to this browser and save as you change them.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-5">
          <section className="divide-y divide-border overflow-hidden rounded-xl border border-border">
            <SettingRow
              stacked
              title="Studio theme"
              description="The theme of this tool. Each preview keeps its own theme, set on the canvas toolbar."
              control={
                <Segmented
                  label="Studio theme"
                  value={settings.colorScheme}
                  options={SCHEMES}
                  onChange={(colorScheme: Settings["colorScheme"]) =>
                    updateSettings({ colorScheme })
                  }
                />
              }
            />

            <SettingRow
              title="Save my work in this browser"
              description="Text content is kept in local storage. Uploaded media never is."
              control={
                <Switch
                  aria-label="Save my work in this browser"
                  checked={settings.persistLocally}
                  onCheckedChange={(persistLocally) =>
                    updateSettings({ persistLocally })
                  }
                />
              }
            />

            <SettingRow
              title="Import a workspace"
              description="Load a JSON file exported from Post Preview."
              control={
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => importRef.current?.click()}
                >
                  <Upload />
                  Choose file
                </Button>
              }
            />
          </section>

          <section className="overflow-hidden rounded-xl border border-destructive/25 bg-destructive-soft/40">
            <header className="px-4 pb-1 pt-3">
              <p className="text-[0.8125rem] font-semibold text-destructive">
                Danger zone
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Both actions replace every category at once and cannot be
                undone.
              </p>
            </header>

            <div className="flex flex-wrap gap-2 px-4 pb-4 pt-3">
              <ConfirmDialog
                title="Restore the example content?"
                description="Everything you have written in all four categories will be replaced by the content Post Preview ships with."
                confirmLabel="Reset everything"
                onConfirm={() => {
                  resetAll();
                  toast.success("Restored the example content.");
                }}
                trigger={
                  <Button size="sm" variant="outline">
                    <RotateCcw />
                    Reset everything
                  </Button>
                }
              />

              <ConfirmDialog
                title="Clear every field?"
                description="All text, people and media will be emptied across all four categories. Your platform and appearance choices are kept."
                confirmLabel="Clear everything"
                onConfirm={() => {
                  clearAll();
                  toast.success("Cleared every field.");
                }}
                trigger={
                  <Button size="sm" variant="outline">
                    <Eraser />
                    Clear everything
                  </Button>
                }
              />
            </div>
          </section>

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
        </DialogBody>

        <DialogFooter>
          <DialogClose asChild>
            <Button size="sm" variant="outline">
              Done
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
