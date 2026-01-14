/**
 * External dependencies.
 */
import { type ReactNode, useState } from "react";

/**
 * Internal dependencies.
 */
import { AppContext } from "@/store/contexts/AppContext";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [postContent, setPostContent] = useState<string>("");

  // Provide the context value to children components.
  const value = { postContent, setPostContent };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
