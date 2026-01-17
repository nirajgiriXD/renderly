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
  setCategoryTab: React.Dispatch<React.SetStateAction<keyof typeof TABS>>;
  configurationTab: string;
  setConfigurationTab: React.Dispatch<React.SetStateAction<string>>;
};

export const AppContext = createContext<AppContextType>({
  postContent: "",
  setPostContent: () => {},
  categoryTab: "posts",
  setCategoryTab: () => {},
  configurationTab: "apps",
  setConfigurationTab: () => {},
});
