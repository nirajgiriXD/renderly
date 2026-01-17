/**
 * External dependencies.
 */
import { type ReactNode, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Internal dependencies.
 */
import { AppContext } from "@/store/contexts/AppContext";
import { TABS } from "@/constants";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [postContent, setPostContent] = useState<string>("");

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
  const [configurationTab, setConfigurationTab] = useState(() => {
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

  // Sync URL search params when tabs change.
  useEffect(() => {
    setSearchParams({
      category: categoryTab,
      configuration: configurationTab,
    });
  }, [categoryTab, configurationTab, setSearchParams]);

  // Provide the context value to children components.
  const value = {
    postContent,
    setPostContent,
    categoryTab,
    handleCategoryTabChange,
    configurationTab,
    handleConfigurationTabChange,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
