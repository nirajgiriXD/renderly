/**
 * External dependencies.
 */
import { Check } from "lucide-react";

/**
 * Internal dependencies.
 */
import { SelectField } from "@/components/common/fields";
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
  const { togglePlatform, setMultiSelect, updateSection } = useConfigActions();

  const apps = config[category].apps;
  const selected = new Set<string>(apps.selected);
  const platforms = PLATFORMS_BY_CATEGORY[category];

  return (
    <div className="space-y-5">
      <SelectField
        label="Preview mode"
        hint={
          apps.multiSelect
            ? "Compare the same content across several platforms side by side."
            : "Show one platform at a time."
        }
        value={apps.multiSelect ? "multiple" : "single"}
        onChange={(value) => setMultiSelect(category, value === "multiple")}
        options={[
          { label: "One platform", value: "single" },
          { label: "Compare platforms", value: "multiple" },
        ]}
      />

      <fieldset className="space-y-2">
        <legend className="mb-2 text-sm font-medium">Platforms</legend>
        <div className="grid grid-cols-2 gap-2 @lg:grid-cols-3">
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
                  "group flex cursor-pointer items-center gap-2.5 rounded-xl border p-3 text-left transition-all",
                  "hover:border-foreground/25 hover:bg-accent/60",
                  active
                    ? "border-primary/60 bg-accent shadow-xs"
                    : "border-border"
                )}
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-md bg-white shadow-xs ring-1 ring-black/5">
                  <img src={meta.logo} alt="" className="size-4" />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                  {meta.label}
                </span>
                {active && (
                  <Check className="size-4 shrink-0 text-primary" aria-hidden />
                )}
              </button>
            );
          })}
        </div>
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
    <div className="grid grid-cols-1 gap-4 @md:grid-cols-2">
      {selected.map((platform) => (
        <SelectField
          key={platform}
          label={`${platformMeta(platform).label} model`}
          value={models[platform]}
          onChange={(model) => onChange(platform, model)}
          options={AI_MODELS[platform]}
        />
      ))}
    </div>
  );
};
