/**
 * Formatting helpers shared by every preview.
 *
 * Platforms round large numbers differently, so `formatCount` takes a style
 * rather than each preview re-implementing the rules inline.
 */

export type CountStyle =
  /** `1.2K`, `3.4M` — Twitter, TikTok, Instagram, Reddit. */
  | "compact"
  /** `1,234` — Facebook and LinkedIn spell reaction counts out in full. */
  | "full";

const UNITS = [
  { limit: 1_000_000_000, suffix: "B" },
  { limit: 1_000_000, suffix: "M" },
  { limit: 1_000, suffix: "K" },
] as const;

/**
 * Formats a count for display.
 *
 * @param count - Raw count. Negative and non-finite values collapse to `0`.
 * @param style - Rounding style to apply.
 */
export const formatCount = (count: number, style: CountStyle = "compact") => {
  const value = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;

  if (style === "full") return value.toLocaleString("en-US");

  for (const { limit, suffix } of UNITS) {
    if (value >= limit) {
      const scaled = value / limit;
      // Platforms show one decimal below 100 (`1.2K`) and none above (`123K`).
      const text =
        scaled >= 100 ? Math.floor(scaled).toString() : scaled.toFixed(1);
      return `${text.replace(/\.0$/, "")}${suffix}`;
    }
  }

  return value.toString();
};

export type RelativeTimeStyle =
  /** `3 hours ago` — Facebook, LinkedIn, Reddit, YouTube. */
  | "long"
  /** `3h` — Twitter, Instagram, TikTok. */
  | "short";

const INTERVALS = [
  { seconds: 31_536_000, short: "y", long: "year" },
  { seconds: 2_592_000, short: "mo", long: "month" },
  { seconds: 604_800, short: "w", long: "week" },
  { seconds: 86_400, short: "d", long: "day" },
  { seconds: 3_600, short: "h", long: "hour" },
  { seconds: 60, short: "m", long: "minute" },
] as const;

/**
 * Renders a date as a relative time string.
 *
 * @param date - Date to describe. Invalid dates are treated as "now".
 * @param style - `short` for feed timestamps, `long` for prose timestamps.
 * @param now - Injectable clock, used by tests and by memoised previews.
 */
export const formatRelativeTime = (
  date: Date | string | null | undefined,
  style: RelativeTimeStyle = "long",
  now: Date = new Date()
): string => {
  const parsed = toDate(date);
  if (!parsed) return style === "short" ? "now" : "just now";

  const seconds = Math.max(0, (now.getTime() - parsed.getTime()) / 1000);

  for (const interval of INTERVALS) {
    if (seconds >= interval.seconds) {
      const value = Math.floor(seconds / interval.seconds);
      return style === "short"
        ? `${value}${interval.short}`
        : `${value} ${interval.long}${value === 1 ? "" : "s"} ago`;
    }
  }

  return style === "short" ? "now" : "just now";
};

/** Clock time as platforms print it inside chat bubbles, e.g. `9:41 PM`. */
export const formatClockTime = (
  date: Date | string | null | undefined,
  hour12 = true
): string => {
  const parsed = toDate(date) ?? new Date();
  return parsed.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12,
  });
};

/** Day separator used by chat threads: `Today`, `Yesterday` or `12 March 2025`. */
export const formatDayLabel = (
  date: Date | string | null | undefined,
  now: Date = new Date()
): string => {
  const parsed = toDate(date) ?? now;
  const days = Math.round(
    (startOfDay(now).getTime() - startOfDay(parsed).getTime()) / 86_400_000
  );

  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) {
    return parsed.toLocaleDateString("en-US", { weekday: "long" });
  }
  return parsed.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: parsed.getFullYear() === now.getFullYear() ? undefined : "numeric",
  });
};

/**
 * Calendar date without a time.
 *
 * Used by the date picker's trigger, which sits beside its own time input —
 * printing the time in both places says the same thing twice and costs the
 * button the width it needs to show the date at all.
 */
export const formatCalendarDate = (date: Date | string | null | undefined) => {
  const parsed = toDate(date);
  if (!parsed) return "";
  return parsed.toLocaleDateString("en-US", { dateStyle: "medium" });
};

/** `0:00` style media duration. */
export const formatDuration = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const paddedSecs = secs.toString().padStart(2, "0");
  return hours > 0
    ? `${hours}:${minutes.toString().padStart(2, "0")}:${paddedSecs}`
    : `${minutes}:${paddedSecs}`;
};

/**
 * Initials for avatar fallbacks: first letter of the first and last words.
 */
export const getInitials = (name: string): string => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (
    words[0].charAt(0) + words[words.length - 1].charAt(0)
  ).toUpperCase();
};

/**
 * Coerces free-form user input into a handle, mirroring how platforms
 * normalise the `@name` you type.
 */
export const toHandle = (value: string) =>
  value.trim().replace(/^@+/, "").replace(/\s+/g, "");

/** Clamps a number field to a sane, non-negative integer. */
export const toCount = (value: string | number): number => {
  const parsed = typeof value === "number" ? value : Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return 0;
  return Math.min(Math.max(0, Math.floor(parsed)), 9_999_999_999);
};

const toDate = (value: Date | string | null | undefined): Date | null => {
  if (!value) return null;
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());
