/**
 * External dependencies.
 */
import { useEffect, useRef } from "react";

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

/** True on Apple platforms, where the command key stands in for control. */
export const isAppleDevice = () =>
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);

export type HotkeyOptions = {
  /** Require ⌘ on Apple platforms, Ctrl elsewhere. */
  meta?: boolean;
  shift?: boolean;
  /** Fire even while a text field has focus. Off by default. */
  allowInInput?: boolean;
  enabled?: boolean;
};

/**
 * Binds a single document-level keyboard shortcut.
 *
 * Kept deliberately small: the studio needs a handful of shortcuts, and a
 * general key-sequence library would be more machinery than the feature is
 * worth. Text fields are excluded by default so typing "k" into a caption
 * never opens the command palette.
 */
export const useHotkey = (
  key: string,
  handler: (event: KeyboardEvent) => void,
  { meta = false, shift = false, allowInInput = false, enabled = true }: HotkeyOptions = {}
) => {
  // Held in a ref so a fresh inline handler each render does not re-bind the
  // document listener; updated in an effect rather than during render.
  const callback = useRef(handler);
  useEffect(() => {
    callback.current = handler;
  });

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== key.toLowerCase()) return;
      if (meta !== (event.metaKey || event.ctrlKey)) return;
      if (shift !== event.shiftKey) return;
      if (!allowInInput && isTypingTarget(event.target)) return;

      event.preventDefault();
      callback.current(event);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [key, meta, shift, allowInInput, enabled]);
};
