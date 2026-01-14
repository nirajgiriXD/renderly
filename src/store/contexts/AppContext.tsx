/**
 * External dependencies.
 */
import { createContext } from "react";

/**
 * Type definition for the application data context.
 */
type AppContextType = {
  postContent: string;
  setPostContent: React.Dispatch<React.SetStateAction<string>>;
};

export const AppContext = createContext<AppContextType>({
  postContent: "",
  setPostContent: () => {},
});
