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
    setCategoryTab,
    configurationTab,
    setConfigurationTab,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
