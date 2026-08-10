/**
 * External dependencies.
 */
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Copies text to the clipboard and reports success for a short window so the
 * trigger can flip to a "Copied" state.
 */
export const useClipboard = (resetAfterMs = 1_600) => {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(false), resetAfterMs);
        return true;
      } catch {
        return false;
      }
    },
    [resetAfterMs]
  );

  return { copied, copy };
};
