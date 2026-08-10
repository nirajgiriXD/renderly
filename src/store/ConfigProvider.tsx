/**
 * External dependencies.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

/**
 * Internal dependencies.
 */
import { ConfigActionsContext, ConfigStateContext } from "./contexts";
import type { ConfigActions } from "./contexts";
import { useSettings } from "./hooks";
import { DEFAULT_CONFIG, EMPTY_CONFIG, STORAGE_KEYS } from "@/constants";
import { toPersistableConfig } from "@/lib/persistence";
import { mergeWithDefaults, readJSON, removeKey, writeJSON } from "@/lib/storage";
import type { AppearanceConfig, CategoryId } from "@/types";

const PERSIST_DELAY_MS = 400;

const loadInitialConfig = (persist: boolean) => {
  if (!persist) return structuredClone(DEFAULT_CONFIG);
  const stored = readJSON<unknown>(STORAGE_KEYS.config);
  if (!stored) return structuredClone(DEFAULT_CONFIG);
  return mergeWithDefaults(structuredClone(DEFAULT_CONFIG), stored);
};

/**
 * Owns the previewed content for every category.
 *
 * State and actions are published through two contexts so a component that
 * only dispatches (a button, a toolbar) does not re-render on every keystroke
 * in the editor.
 */
export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const { settings } = useSettings();
  const persist = settings.persistLocally;

  // Read once on mount: flipping the setting later must not reload and discard
  // whatever the user has typed since.
  const [config, setConfig] = useState(() => loadInitialConfig(persist));

  const updateSection = useCallback<ConfigActions["updateSection"]>(
    (category, section, patch) => {
      setConfig((previous) => {
        const current = previous[category][section];
        const resolved =
          typeof patch === "function"
            ? (patch as (value: typeof current) => Partial<typeof current>)(
                current
              )
            : patch;

        return {
          ...previous,
          [category]: {
            ...previous[category],
            [section]: { ...current, ...resolved },
          },
        };
      });
    },
    []
  );

  /*
   * `apps` has the same shape in every category, but each category narrows
   * `selected` to its own platform union. These actions are the only place
   * that shape is treated uniformly, so the cast is confined here rather than
   * leaking into every editor.
   */
  const patchApps = useCallback(
    (
      category: CategoryId,
      patch: (apps: { multiSelect: boolean; selected: string[] }) => {
        multiSelect?: boolean;
        selected?: string[];
      }
    ) => {
      setConfig((previous) => {
        const apps = previous[category].apps as {
          multiSelect: boolean;
          selected: string[];
        };

        return {
          ...previous,
          [category]: {
            ...previous[category],
            apps: { ...apps, ...patch(apps) },
          },
        };
      });
    },
    []
  );

  const togglePlatform = useCallback(
    (category: CategoryId, platform: string) =>
      patchApps(category, (apps) => {
        if (!apps.multiSelect) {
          // Single-select behaves like a radio group, except that tapping the
          // active platform clears it and shows the empty preview state.
          return {
            selected: apps.selected[0] === platform ? [] : [platform],
          };
        }

        return {
          selected: apps.selected.includes(platform)
            ? apps.selected.filter((entry) => entry !== platform)
            : [...apps.selected, platform],
        };
      }),
    [patchApps]
  );

  const setMultiSelect = useCallback(
    (category: CategoryId, enabled: boolean) =>
      patchApps(category, (apps) => ({
        multiSelect: enabled,
        // Collapsing to single select keeps the first platform rather than
        // dropping the whole selection.
        selected: enabled ? apps.selected : apps.selected.slice(0, 1),
      })),
    [patchApps]
  );

  const setAppearance = useCallback(
    (category: CategoryId, patch: Partial<AppearanceConfig>) =>
      setConfig((previous) => ({
        ...previous,
        [category]: {
          ...previous[category],
          appearance: { ...previous[category].appearance, ...patch },
        },
      })),
    []
  );

  const resetCategory = useCallback(
    (category: CategoryId) =>
      setConfig((previous) => ({
        ...previous,
        [category]: structuredClone(DEFAULT_CONFIG[category]),
      })),
    []
  );

  const resetAll = useCallback(
    () => setConfig(structuredClone(DEFAULT_CONFIG)),
    []
  );

  const clearAll = useCallback(() => {
    setConfig((previous) => {
      const cleared = structuredClone(EMPTY_CONFIG);
      // Platform and appearance choices are workspace preferences rather than
      // content, so clearing the content should not undo them.
      for (const category of Object.keys(cleared) as CategoryId[]) {
        cleared[category].apps = structuredClone(previous[category].apps);
        cleared[category].appearance = structuredClone(
          previous[category].appearance
        );
      }
      return cleared;
    });
  }, []);

  const importConfig = useCallback(
    (incoming: unknown) =>
      setConfig(mergeWithDefaults(structuredClone(DEFAULT_CONFIG), incoming)),
    []
  );

  // Persist a media-free copy, debounced so typing does not serialise the
  // whole document on every keystroke.
  useEffect(() => {
    if (!persist) {
      removeKey(STORAGE_KEYS.config);
      return;
    }

    const timer = window.setTimeout(() => {
      writeJSON(STORAGE_KEYS.config, toPersistableConfig(config));
    }, PERSIST_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [config, persist]);

  const actions = useMemo<ConfigActions>(
    () => ({
      updateSection,
      togglePlatform,
      setMultiSelect,
      setAppearance,
      resetCategory,
      resetAll,
      clearAll,
      importConfig,
    }),
    [
      updateSection,
      togglePlatform,
      setMultiSelect,
      setAppearance,
      resetCategory,
      resetAll,
      clearAll,
      importConfig,
    ]
  );

  return (
    <ConfigActionsContext.Provider value={actions}>
      <ConfigStateContext.Provider value={config}>
        {children}
      </ConfigStateContext.Provider>
    </ConfigActionsContext.Provider>
  );
};
