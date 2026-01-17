/**
 * External dependencies.
 */
import { createContext } from "react";

/**
 * Internal dependencies.
 */
import { TABS } from "@/constants";

/**
 * Type definition for the application data context.
 */
type AppContextType = {
  postContent: string;
  setPostContent: React.Dispatch<React.SetStateAction<string>>;
  categoryTab: keyof typeof TABS;
  handleCategoryTabChange: (tab: keyof typeof TABS) => void;
  configurationTab: string;
  handleConfigurationTabChange: (tab: string) => void;
};

export const AppContext = createContext<AppContextType>({
  postContent: "",
  setPostContent: () => {},
  categoryTab: "posts",
  handleCategoryTabChange: () => {},
  configurationTab: "apps",
  handleConfigurationTabChange: () => {},
});
