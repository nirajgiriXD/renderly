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

const Divider = () => (
  <span aria-hidden className="mx-0.5 h-5 w-px shrink-0 bg-border" />
);

/**
 * The canvas's own controls.
 *
 * Theme, device and framing describe how the stage renders — not what the
 * content says — so they belong beside the stage rather than buried in the
 * inspector's form. Everything here changes what you are looking at right now
 * and nothing here changes what would be exported as JSON.
 */
export const CanvasToolbar = ({
  category,
  view,
  onViewChange,
  zoom,
  onZoomChange,
  onCopyJson,
  jsonCopied,
}: {
  category: CategoryId;
  view: CanvasView;
  onViewChange: (view: CanvasView) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onCopyJson: () => void;
  jsonCopied: boolean;
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

      <div className="ml-auto flex items-center gap-1.5">
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
                "items-center rounded-lg border border-border/70 bg-sunken p-0.5",
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
    </div>
  );
};
