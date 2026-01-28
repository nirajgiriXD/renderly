export type EnableMultipleAppSelection = "enabled" | "disabled";

export type Theme = "light" | "dark";
export type Device = "android" | "ios" | "web";

export type SelectedApps = Record<string, boolean>;

export type AppsConfigBase = {
  enableMultipleSelection: EnableMultipleAppSelection;
  selectedApps: SelectedApps;
};

export type AppearanceConfig = {
  theme: Theme;
  device: Device;
};

export type SettingsType = {
  saveOnLocalStorage: boolean;
};
