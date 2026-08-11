/**
 * External dependencies.
 */
import {
  Check,
  Copy,
  Frame,
  Minus,
  Monitor,
  Moon,
  Plus,
  Smartphone,
  Sun,
  Tablet,
} from "lucide-react";

/**
 * Internal dependencies.
 */
import { ExportMenu } from "./ExportMenu";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";
import { Hint } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  MAX_ZOOM,
  MIN_ZOOM,
  stepZoom,
  supportsCanvasZoom,
} from "@/lib/zoom";
import type { StageExport } from "@/hooks";
import { useConfig, useConfigActions } from "@/store";
import type { CategoryId, PreviewDevice, PreviewTheme } from "@/types";

export type CanvasView = "preview" | "json";

const DEVICES: { value: PreviewDevice; label: string }[] = [
  { value: "ios", label: "iPhone" },
  { value: "android", label: "Android" },
  { value: "web", label: "Desktop" },
];

const DEVICE_ICONS = { ios: Smartphone, android: Tablet, web: Monitor };

const THEMES: { value: PreviewTheme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

const THEME_ICONS = { light: Sun, dark: Moon };

const Divider = ({ className }: { className?: string }) => (
  <span
    aria-hidden
    className={cn("mx-0.5 h-5 w-px shrink-0 bg-border", className)}
  />
);

/**
 * The canvas's own controls.
 *
 * Theme, device and framing describe how the stage renders — not what the
 * content says — so they belong beside the stage rather than buried in the
 * inspector's form. Everything here changes what you are looking at right now
 * and nothing here changes what would be exported as JSON.
 *
 * Export sits at the end of the same row: what it writes out is whatever this
 * toolbar has just been used to set up, and the control that ends that
 * sequence should be within reach of the ones that start it.
 */
export const CanvasToolbar = ({
  category,
  view,
  onViewChange,
  zoom,
  onZoomChange,
  onCopyJson,
  jsonCopied,
  exportActions,
}: {
  category: CategoryId;
  view: CanvasView;
  onViewChange: (view: CanvasView) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onCopyJson: () => void;
  jsonCopied: boolean;
  exportActions: StageExport;
}) => {
  const appearance = useConfig()[category].appearance;
  const { setAppearance } = useConfigActions();

  // Hidden rather than shown-but-dead where `zoom` is unsupported.
  const zoomable = supportsCanvasZoom();

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-x-2 gap-y-2 border-b border-border bg-surface px-3 py-2">
      <Segmented
        label="Canvas view"
        size="sm"
        className="w-38"
        value={view}
        onChange={onViewChange}
        options={[
          { value: "preview", label: "Preview" },
          { value: "json", label: "JSON" },
        ]}
      />

      {/*
        Wrapping rather than compressing: with Export on the row too, a phone
        cannot fit every control on one line, and a squeezed segmented control
        crushes its icons to slivers before anything visibly gives way. Below
        `lg` the view controls take the second line and Export is reordered up
        beside Preview / JSON, where there is room for it.
      */}
      <div className="order-2 ml-auto flex flex-wrap items-center justify-end gap-1.5 lg:order-0">
        {view === "json" ? (
          <Button size="sm" variant="outline" onClick={onCopyJson}>
            {jsonCopied ? (
              <Check className="text-success" />
            ) : (
              <Copy className="size-3.5" />
            )}
            {jsonCopied ? "Copied" : "Copy JSON"}
          </Button>
        ) : (
          <>
            <Segmented
              iconOnly
              size="sm"
              className="shrink-0"
              label="Preview device"
              value={appearance.device}
              onChange={(device) => setAppearance(category, { device })}
              options={DEVICES.map((entry) => ({
                ...entry,
                icon: DEVICE_ICONS[entry.value],
                hint: `Render at ${entry.label} width`,
              }))}
            />

            <Segmented
              iconOnly
              size="sm"
              className="shrink-0"
              label="Preview theme"
              value={appearance.theme}
              onChange={(theme) => setAppearance(category, { theme })}
              options={THEMES.map((entry) => ({
                ...entry,
                icon: THEME_ICONS[entry.value],
                hint: `${entry.label} mode inside the preview`,
              }))}
            />

            <Hint
              label={
                appearance.showDeviceFrame
                  ? "Hide the device frame"
                  : "Show the device frame"
              }
            >
              <Button
                size="icon-sm"
                variant={appearance.showDeviceFrame ? "soft" : "ghost"}
                aria-pressed={appearance.showDeviceFrame}
                aria-label="Device frame"
                onClick={() =>
                  setAppearance(category, {
                    showDeviceFrame: !appearance.showDeviceFrame,
                  })
                }
              >
                <Frame />
              </Button>
            </Hint>

            {zoomable && <Divider />}

            <div
              className={cn(
                "shrink-0 items-center rounded-lg border border-border/70 bg-sunken p-0.5",
                zoomable ? "flex" : "hidden"
              )}
            >
              <Hint label="Zoom out (⌘/Ctrl −)">
                <Button
                  size="icon-xs"
                  variant="ghost"
                  aria-label="Zoom out"
                  disabled={zoom <= MIN_ZOOM}
                  onClick={() => onZoomChange(stepZoom(zoom, -1))}
                >
                  <Minus />
                </Button>
              </Hint>

              <Hint label="Reset to 100% (⌘/Ctrl 0). Drag the canvas to pan.">
                <button
                  type="button"
                  onClick={() => onZoomChange(1)}
                  aria-label={`Zoom is ${Math.round(zoom * 100)} percent — reset to 100 percent`}
                  data-numeric
                  className={cn(
                    "min-w-11 cursor-pointer rounded px-1 py-0.5 text-center text-xs font-medium tabular-nums",
                    "text-muted-foreground transition-colors hover:text-foreground",
                    "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
                  )}
                >
                  {Math.round(zoom * 100)}%
                </button>
              </Hint>

              <Hint label="Zoom in (⌘/Ctrl +)">
                <Button
                  size="icon-xs"
                  variant="ghost"
                  aria-label="Zoom in"
                  disabled={zoom >= MAX_ZOOM}
                  onClick={() => onZoomChange(stepZoom(zoom, 1))}
                >
                  <Plus />
                </Button>
              </Hint>
            </div>
          </>
        )}
      </div>

      <div className="order-1 ml-auto flex items-center gap-1.5 lg:order-0 lg:ml-0">
        <Divider className="hidden lg:block" />
        <ExportMenu actions={exportActions} />
      </div>
    </div>
  );
};
