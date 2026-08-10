/**
 * External dependencies.
 */
import { Monitor, Moon, Smartphone, Sun, Tablet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Internal dependencies.
 */
import { Field, SwitchField } from "@/components/common/fields";
import { cn } from "@/lib/utils";
import { useConfig, useConfigActions } from "@/store";
import type { CategoryId, PreviewDevice, PreviewTheme } from "@/types";

const THEMES: { value: PreviewTheme; label: string; icon: LucideIcon }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

const DEVICES: { value: PreviewDevice; label: string; icon: LucideIcon }[] = [
  { value: "ios", label: "iPhone", icon: Smartphone },
  { value: "android", label: "Android", icon: Tablet },
  { value: "web", label: "Desktop", icon: Monitor },
];

/** Segmented control used for both of the appearance choices. */
const Segmented = <T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { value: T; label: string; icon: LucideIcon }[];
  onChange: (value: T) => void;
  label: string;
}) => (
  <div
    role="radiogroup"
    aria-label={label}
    className="grid gap-1 rounded-lg bg-muted p-1"
    style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
  >
    {options.map((option) => {
      const active = option.value === value;
      return (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={active}
          onClick={() => onChange(option.value)}
          className={cn(
            "flex cursor-pointer items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
            active
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <option.icon className="size-4" aria-hidden />
          {option.label}
        </button>
      );
    })}
  </div>
);

/**
 * Theme, device and framing controls.
 *
 * Identical in every category, so it reads and writes through the store's
 * category-agnostic `setAppearance` action.
 */
export const AppearanceSection = ({ category }: { category: CategoryId }) => {
  const appearance = useConfig()[category].appearance;
  const { setAppearance } = useConfigActions();

  return (
    <div className="space-y-5">
      <Field
        label="Preview theme"
        hint="Applies to the previewed app, not to this editor."
      >
        <Segmented
          label="Preview theme"
          value={appearance.theme}
          options={THEMES}
          onChange={(theme) => setAppearance(category, { theme })}
        />
      </Field>

      <Field
        label="Device"
        hint="Controls the preview width and the chrome drawn around it."
      >
        <Segmented
          label="Device"
          value={appearance.device}
          options={DEVICES}
          onChange={(device) => setAppearance(category, { device })}
        />
      </Field>

      <SwitchField
        label="Show device frame"
        hint="Draw the phone bezel or browser window around the preview."
        checked={appearance.showDeviceFrame}
        onChange={(showDeviceFrame) =>
          setAppearance(category, { showDeviceFrame })
        }
      />
    </div>
  );
};
