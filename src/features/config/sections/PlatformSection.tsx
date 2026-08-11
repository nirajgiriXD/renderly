/**
 * External dependencies.
 */
import { Check, Layers, Square } from "lucide-react";

/**
 * Internal dependencies.
 */
import { SegmentedField, SelectField } from "@/components/common/fields";
import { Panel } from "@/components/common/Panel";
import { Button } from "@/components/ui/button";
import { AI_MODELS, PLATFORMS_BY_CATEGORY, platformMeta } from "@/constants";
import { cn } from "@/lib/utils";
import { useConfig, useConfigActions } from "@/store";
import type { AiChatPlatform, CategoryId } from "@/types";

/**
 * Platform picker, shared by all four categories.
 *
 * The list of platforms differs per category but the interaction does not, so
 * this is one component driven by `PLATFORMS_BY_CATEGORY` rather than four
 * near-identical copies.
 */
export const PlatformSection = ({ category }: { category: CategoryId }) => {
  const config = useConfig();
  const { togglePlatform, setPlatforms, setMultiSelect, updateSection } =
    useConfigActions();

  const apps = config[category].apps;
  const selected = new Set<string>(apps.selected);
  const platforms = PLATFORMS_BY_CATEGORY[category];

  return (
    <div className="space-y-5">
      <SegmentedField
        label="Preview mode"
        hint={
          apps.multiSelect
            ? "Every platform you pick is rendered on the canvas, side by side."
            : "One platform at a time. Picking another replaces the current one."
        }
        value={apps.multiSelect ? "multiple" : "single"}
        onChange={(value) => setMultiSelect(category, value === "multiple")}
        options={[
          { value: "single", label: "One platform", icon: Square },
          { value: "multiple", label: "Compare", icon: Layers },
        ]}
      />

      <fieldset>
        <div className="mb-2.5 flex items-end justify-between gap-3">
          <legend className="text-[0.8125rem] font-semibold">
            {category === "ai-chats" ? "Assistants" : "Platforms"}
          </legend>
          <p
            data-numeric
            className="text-xs text-muted-foreground"
            aria-live="polite"
          >
            {apps.selected.length} of {platforms.length} selected
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 @md:grid-cols-3">
          {platforms.map((platform) => {
            const meta = platformMeta(platform);
            const active = selected.has(platform);

            return (
              <button
                key={platform}
                type="button"
                role="checkbox"
                aria-checked={active}
                onClick={() => togglePlatform(category, platform)}
                className={cn(
                  "group relative flex cursor-pointer items-center gap-2.5 rounded-xl border p-2.5 text-left",
                  "transition-[background-color,border-color,box-shadow] duration-150 ease-out-quad",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  active
                    ? "border-brand-line bg-brand-soft shadow-xs"
                    : "border-border bg-surface hover:border-border-strong hover:bg-accent"
                )}
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white shadow-xs ring-1 ring-black/5">
                  <img src={meta.logo} alt="" className="size-4.5" />
                </span>

                <span
                  className={cn(
                    "min-w-0 flex-1 truncate text-[0.8125rem] font-medium",
                    active ? "text-brand-text" : "text-foreground"
                  )}
                >
                  {meta.label}
                </span>

                <span
                  aria-hidden
                  className={cn(
                    "grid size-4 shrink-0 place-items-center rounded-full transition-all duration-150",
                    active
                      ? "scale-100 bg-primary text-primary-foreground opacity-100"
                      : "scale-75 opacity-0"
                  )}
                >
                  <Check className="size-2.5" strokeWidth={3.5} />
                </span>
              </button>
            );
          })}
        </div>

        {apps.multiSelect && (
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              size="xs"
              variant="outline"
              disabled={apps.selected.length === platforms.length}
              onClick={() => setPlatforms(category, platforms)}
            >
              Select all
            </Button>
            <Button
              size="xs"
              variant="ghost"
              disabled={apps.selected.length === 0}
              onClick={() => setPlatforms(category, [])}
            >
              Clear selection
            </Button>
          </div>
        )}
      </fieldset>

      {category === "ai-chats" && (
        <ModelPickers
          selected={config["ai-chats"].apps.selected}
          models={config["ai-chats"].apps.models}
          onChange={(platform, model) =>
            updateSection("ai-chats", "apps", (apps) => ({
              models: { ...apps.models, [platform]: model },
            }))
          }
        />
      )}
    </div>
  );
};

/** One model dropdown per selected assistant. */
const ModelPickers = ({
  selected,
  models,
  onChange,
}: {
  selected: AiChatPlatform[];
  models: Record<AiChatPlatform, string>;
  onChange: (platform: AiChatPlatform, model: string) => void;
}) => {
  if (selected.length === 0) return null;

  return (
    <Panel
      title="Models"
      description="Shown in each assistant's header. Nothing is ever sent to these APIs."
    >
      <div className="grid grid-cols-1 gap-4 @md:grid-cols-2">
        {selected.map((platform) => (
          <SelectField
            key={platform}
            label={platformMeta(platform).label}
            value={models[platform]}
            onChange={(model) => onChange(platform, model)}
            options={AI_MODELS[platform]}
          />
        ))}
      </div>
    </Panel>
  );
};
