/**
 * Thin, failure-tolerant wrapper around `localStorage`.
 *
 * Every access is guarded: Safari private mode throws on `getItem`, and a
 * quota error on write must never take the editor down with it.
 */
const memoryFallback = new Map<string, string>();

const backing = (): Pick<Storage, "getItem" | "setItem" | "removeItem"> => {
  try {
    const probe = "__probe__";
    window.localStorage.setItem(probe, probe);
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return {
      getItem: (key) => memoryFallback.get(key) ?? null,
      setItem: (key, value) => void memoryFallback.set(key, value),
      removeItem: (key) => void memoryFallback.delete(key),
    };
  }
};

const store = backing();

export const readJSON = <T>(key: string): T | null => {
  try {
    const raw = store.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

export const writeJSON = (key: string, value: unknown): boolean => {
  try {
    store.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const removeKey = (key: string) => {
  try {
    store.removeItem(key);
  } catch {
    /* Nothing sensible to do if the storage is unavailable. */
  }
};

type Plain = Record<string, unknown>;

const isPlainObject = (value: unknown): value is Plain =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * True when `stored` can stand in for `defaults` without changing its shape.
 *
 * Stored state comes from two untrusted places — a `localStorage` entry
 * written by an older build, and a JSON file the user imported — so a value is
 * only accepted when it is the same kind of thing the default is.
 */
const isCompatible = (defaultValue: unknown, storedValue: unknown) => {
  if (defaultValue === null) return true;
  if (Array.isArray(defaultValue)) return Array.isArray(storedValue);
  if (isPlainObject(defaultValue)) return isPlainObject(storedValue);
  return typeof defaultValue === typeof storedValue;
};

/**
 * Recursively fills gaps in `stored` from `defaults`.
 *
 * Persisted state predates any field added later, so a plain spread would hand
 * components `undefined` where they expect a value. Anything whose shape does
 * not match falls back to the default rather than being trusted: a hand-edited
 * import must not be able to put a string where the previews expect an array.
 *
 * Arrays are taken wholesale from the stored copy — merging them element-wise
 * would resurrect seed rows the user deleted.
 */
export const mergeWithDefaults = <T>(defaults: T, stored: unknown): T => {
  if (!isCompatible(defaults, stored)) return defaults;
  if (!isPlainObject(defaults) || !isPlainObject(stored)) return stored as T;

  const result: Plain = { ...defaults };

  for (const key of Object.keys(defaults as Plain)) {
    const defaultValue = (defaults as Plain)[key];
    const storedValue = stored[key];

    if (storedValue === undefined) continue;

    result[key] = mergeWithDefaults(defaultValue, storedValue);
  }

  return result as T;
};

/**
 * Replaces every data URL in a structure with its embedded file name.
 *
 * Used both to keep uploaded media out of `localStorage` (a single photo
 * blows the 5 MB quota) and to keep the raw JSON view readable.
 */
export const stripDataUrls = <T>(value: T): T => {
  if (typeof value === "string") {
    return (value.startsWith("data:") ? describeDataUrl(value) : value) as T;
  }

  if (Array.isArray(value)) {
    return value.map(stripDataUrls) as T;
  }

  if (isPlainObject(value)) {
    const result: Plain = {};
    for (const [key, entry] of Object.entries(value)) {
      result[key] = stripDataUrls(entry);
    }
    return result as T;
  }

  return value;
};

const describeDataUrl = (value: string) => {
  const name = value.match(/;name=([^;]+);/)?.[1];
  if (name) {
    try {
      return decodeURIComponent(name);
    } catch {
      return name;
    }
  }
  return value.slice(0, value.indexOf(",") + 1) + "…";
};
