/**
 * External dependencies.
 */
import { type ReactNode, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Internal dependencies.
 */
import { AppContext } from "@/store/contexts/AppContext";
import { TABS, DEFAULT_CONFIG } from "@/constants";
import type { DefaultConfig } from "@/types";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [form, setForm] = useState<DefaultConfig>(
    structuredClone(DEFAULT_CONFIG)
  );

  // State for managing tabs category.
  const [categoryTab, setCategoryTab] = useState<keyof typeof TABS>(() => {
    let category = searchParams.get("category");
    category =
      category && category in TABS
        ? category
        : (Object.keys(TABS)[0] as keyof typeof TABS);
    return category as keyof typeof TABS;
  });

  // State for managing configuration tab.
  const [configurationTab, setConfigurationTab] = useState<string>(() => {
    let option = searchParams.get("configuration");
    option =
      option && TABS[categoryTab].includes(option)
        ? option
        : TABS[categoryTab][0];
    return option || "apps";
  });

  /**
   * Handle category tab change.
   * @param tab - The new category tab.
   */
  const handleCategoryTabChange = (tab: keyof typeof TABS) => {
    setCategoryTab(
      tab in TABS ? tab : (Object.keys(TABS)[0] as keyof typeof TABS)
    );
    setConfigurationTab((prev) =>
      TABS[tab].includes(prev) ? prev : TABS[tab][0]
    );
  };

  /**
   * Handle configuration tab change.
   * @param tab - The new configuration tab.
   */
  const handleConfigurationTabChange = (tab: string) => {
    setConfigurationTab(
      TABS[categoryTab].includes(tab) ? tab : TABS[categoryTab][0]
    );
  };

  /**
   * Handle form data change.
   * @param key - The key of the form data to change.
   * @param value - The new value to set for the specified key.
   */
  const handleFormChange = useCallback(
    <
      Tab extends keyof typeof TABS,
      Config extends keyof DefaultConfig[Tab],
      K extends keyof DefaultConfig[Tab][Config],
    >(
      key: K,
      value: DefaultConfig[Tab][Config][K]
    ) => {
      setForm((prev) => ({
        ...prev,
        [categoryTab]: {
          ...prev[categoryTab],
          [configurationTab]: {
            ...prev[categoryTab][
              configurationTab as keyof (typeof prev)[typeof categoryTab]
            ],
            [key]: value,
            // If multiple selection is being disabled, deselect all apps.
            ...(key === "enableMultipleSelection" && value === "disable"
              ? {
                  selectedApps: Object.keys(
                    prev[categoryTab].apps.selectedApps
                  ).reduce(
                    (acc, app) => {
                      acc[app] = false;
                      return acc;
                    },
                    {} as Record<string, boolean>
                  ),
                }
              : {}),
          },
        },
      }));
    },
    [categoryTab, configurationTab]
  );

  /**
   * Handle app toggle in the apps configuration.
   * @param appName - The value of the app to toggle.
   * @param checked - The new checked state of the app.
   */
  const handleAppToggle = useCallback(
    (appName: string, checked: boolean) => {
      if (form[categoryTab].apps.enableMultipleSelection === "enable") {
        // multi-select: simply toggle the value
        handleFormChange("selectedApps", {
          ...form[categoryTab].apps.selectedApps,
          [appName]: checked,
        });
      } else {
        // single-select: only one true at a time
        const next = Object.keys(form[categoryTab].apps.selectedApps).reduce(
          (acc, key) => {
            acc[key] = key === appName ? checked : false;
            return acc;
          },
          {} as Record<string, boolean>
        );

        handleFormChange("selectedApps", next);
      }
    },
    [categoryTab, form, handleFormChange]
  );

  // Sync URL search params when tabs change.
  useEffect(() => {
    setSearchParams({
      category: categoryTab,
      configuration: configurationTab,
    });
  }, [categoryTab, configurationTab, setSearchParams]);

  // Provide the context value to children components.
  const value = {
    form,
    setForm,
    categoryTab,
    handleCategoryTabChange,
    configurationTab,
    handleConfigurationTabChange,
    handleFormChange,
    handleAppToggle,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
