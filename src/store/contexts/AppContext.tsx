/**
 * External dependencies.
 */
import { createContext } from "react";

/**
 * Internal dependencies.
 */
import { TABS, DEFAULT_CONFIG } from "@/constants";
import type { DefaultConfig, SettingsType } from "@/types";

/**
 * Type definition for the application data context.
 */
type AppContextType = {
  form: DefaultConfig;
  setForm: React.Dispatch<React.SetStateAction<DefaultConfig>>;
  categoryTab: keyof typeof TABS;
  handleCategoryTabChange: (tab: keyof typeof TABS) => void;
  configurationTab: string;
  handleConfigurationTabChange: (tab: string) => void;
  handleFormChange: <
    Tab extends keyof typeof TABS,
    Config extends keyof DefaultConfig[Tab],
    K extends keyof DefaultConfig[Tab][Config],
  >(
    key: K,
    value: DefaultConfig[Tab][Config][K]
  ) => void;
  handleAppToggle: (appName: string, isEnabled: boolean) => void;
  settings: SettingsType;
  handleSettingsChange: <K extends keyof SettingsType>(
    key: K,
    value: SettingsType[K]
  ) => void;
};

export const AppContext = createContext<AppContextType>({
  form: structuredClone(DEFAULT_CONFIG),
  setForm: () => {},
  categoryTab: "posts",
  handleCategoryTabChange: () => {},
  configurationTab: "apps",
  handleConfigurationTabChange: () => {},
  handleFormChange: () => {},
  handleAppToggle: () => {},
  settings: {} as SettingsType,
  handleSettingsChange: () => {},
});
