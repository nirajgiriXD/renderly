/**
 * External dependencies.
 */
import { createContext } from "react";

/**
 * Internal dependencies.
 */
import type {
  AppConfig,
  AppearanceConfig,
  CategoryId,
  SectionOf,
  Settings,
} from "@/types";

/*
 * Contexts live apart from the providers that fill them and the hooks that
 * read them, so every other module in `src/store` can stay a pure component
 * file or a pure hook file.
 */

export type SectionPatch<T> = Partial<T> | ((previous: T) => Partial<T>);

export type ConfigActions = {
  /** Merges a patch into one section of one category. */
  updateSection: <C extends CategoryId, S extends SectionOf<C>>(
    category: C,
    section: S,
    patch: SectionPatch<AppConfig[C][S]>
  ) => void;
  /** Turns a platform on or off for a category, honouring its select mode. */
  togglePlatform: (category: CategoryId, platform: string) => void;
  /** Switches a category between single- and multi-platform preview. */
  setMultiSelect: (category: CategoryId, enabled: boolean) => void;
  /** Patches a category's theme / device / frame settings. */
  setAppearance: (
    category: CategoryId,
    patch: Partial<AppearanceConfig>
  ) => void;
  /** Restores the shipped example content for a single category. */
  resetCategory: (category: CategoryId) => void;
  /** Restores the shipped example content everywhere. */
  resetAll: () => void;
  /** Empties every field, keeping platform and appearance choices. */
  clearAll: () => void;
  /** Replaces the whole config, e.g. from an imported JSON file. */
  importConfig: (incoming: unknown) => void;
};

export type SettingsContextValue = {
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
  /** The scheme actually applied, once `system` has been resolved. */
  resolvedScheme: "light" | "dark";
};

export type WorkspaceContextValue = {
  category: CategoryId;
  section: string;
  setCategory: (category: CategoryId) => void;
  setSection: (section: string) => void;
};

export const ConfigStateContext = createContext<AppConfig | null>(null);
export const ConfigActionsContext = createContext<ConfigActions | null>(null);
export const SettingsContext = createContext<SettingsContextValue | null>(null);
export const WorkspaceContext = createContext<WorkspaceContextValue | null>(
  null
);
