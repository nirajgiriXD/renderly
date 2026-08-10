/**
 * Stable unique id generator for list items (comments, messages, media…).
 *
 * `crypto.randomUUID` is unavailable on insecure origins, so fall back to a
 * counter + timestamp which is unique for the lifetime of the tab.
 */
let counter = 0;

export const createId = (prefix = "id"): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}_${counter.toString(36)}`;
};
