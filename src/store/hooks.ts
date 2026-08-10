/**
 * External dependencies.
 */
import { useCallback, useContext } from "react";

/**
 * Internal dependencies.
 */
import {
  ConfigActionsContext,
  ConfigStateContext,
  SettingsContext,
  WorkspaceContext,
} from "./contexts";
import type { ConfigActions, SectionPatch } from "./contexts";
import type { AppConfig, CategoryId, SectionOf } from "@/types";

export const useConfig = (): AppConfig => {
  const config = useContext(ConfigStateContext);
  if (!config) {
    throw new Error("useConfig must be used inside <ConfigProvider>.");
  }
  return config;
};

export const useConfigActions = (): ConfigActions => {
  const actions = useContext(ConfigActionsContext);
  if (!actions) {
    throw new Error("useConfigActions must be used inside <ConfigProvider>.");
  }
  return actions;
};

/**
 * Binds one editor section to the store.
 *
 * @example
 * const [author, setAuthor] = useSection("posts", "author");
 * setAuthor({ name: "Ada" });
 */
export const useSection = <C extends CategoryId, S extends SectionOf<C>>(
  category: C,
  section: S
) => {
  const value = useConfig()[category][section];
  const { updateSection } = useConfigActions();

  const setValue = useCallback(
    (patch: SectionPatch<AppConfig[C][S]>) =>
      updateSection(category, section, patch),
    [updateSection, category, section]
  );

  return [value, setValue] as const;
};

export const useSettings = () => {
  const value = useContext(SettingsContext);
  if (!value) {
    throw new Error("useSettings must be used inside <SettingsProvider>.");
  }
  return value;
};

export const useWorkspace = () => {
  const value = useContext(WorkspaceContext);
  if (!value) {
    throw new Error("useWorkspace must be used inside <WorkspaceProvider>.");
  }
  return value;
};
