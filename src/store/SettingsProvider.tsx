/**
 * External dependencies.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

/**
 * Internal dependencies.
 */
import { SettingsContext } from "./contexts";
import { DEFAULT_SETTINGS, STORAGE_KEYS } from "@/constants";
import { mergeWithDefaults, readJSON, writeJSON } from "@/lib/storage";
import type { Settings } from "@/types";

const DARK_QUERY = "(prefers-color-scheme: dark)";

const prefersDark = () =>
  typeof window !== "undefined" && window.matchMedia(DARK_QUERY).matches;

/** Editor preferences: colour scheme and local persistence. */
export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(() =>
    mergeWithDefaults(
      { ...DEFAULT_SETTINGS },
      readJSON<Partial<Settings>>(STORAGE_KEYS.settings)
    )
  );

  const [systemDark, setSystemDark] = useState(prefersDark);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((previous) => {
      const next = { ...previous, ...patch };
      writeJSON(STORAGE_KEYS.settings, next);
      return next;
    });
  }, []);

  // Track the OS preference so "match system" stays live instead of being
  // sampled once at mount.
  useEffect(() => {
    const query = window.matchMedia(DARK_QUERY);
    const onChange = (event: MediaQueryListEvent) =>
      setSystemDark(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const resolvedScheme =
    settings.colorScheme === "system"
      ? systemDark
        ? "dark"
        : "light"
      : settings.colorScheme;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", resolvedScheme === "dark");
    root.style.colorScheme = resolvedScheme;
  }, [resolvedScheme]);

  const value = useMemo(
    () => ({ settings, updateSettings, resolvedScheme }),
    [settings, updateSettings, resolvedScheme]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
