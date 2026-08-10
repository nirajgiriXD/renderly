/**
 * External dependencies.
 */
import { useSyncExternalStore } from "react";

/**
 * Subscribes to a CSS media query.
 *
 * `useSyncExternalStore` keeps this tear-free and avoids the resize-listener
 * plus state dance: the browser already tracks the match for us.
 */
export const useMediaQuery = (query: string): boolean => {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
};

/** Tailwind's `lg` breakpoint — where the split editor/preview layout starts. */
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");
