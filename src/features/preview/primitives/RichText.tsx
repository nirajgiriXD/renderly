/**
 * External dependencies.
 */
import { Fragment } from "react";

/**
 * Internal dependencies.
 */
import { cn } from "@/lib/utils";

export type Entity = "url" | "mention" | "hashtag";

/**
 * URLs, `@mentions` and `#hashtags`, in that order.
 *
 * Alternation order matters: a URL containing a `#fragment` must be consumed
 * as a URL before the hashtag branch can see it.
 */
const ENTITY_PATTERN =
  /(https?:\/\/[^\s<]+|www\.[^\s<]+|[@#][\p{L}\p{N}_]+(?:\.[\p{L}\p{N}_]+)*)/gu;

const classify = (token: string): Entity | null => {
  if (/^(https?:\/\/|www\.)/i.test(token)) return "url";
  if (token.startsWith("@")) return "mention";
  if (token.startsWith("#")) return "hashtag";
  return null;
};

/** Strips the scheme and trailing slash the way feeds shorten link text. */
const prettyUrl = (url: string) =>
  url.replace(/^https?:\/\//i, "").replace(/\/$/, "");

type RichTextProps = {
  text: string;
  /** Which entities to highlight. Reddit, for example, has no hashtags. */
  entities?: readonly Entity[];
  /** Shorten displayed URLs, as X and Instagram do. */
  shortenUrls?: boolean;
  className?: string;
  entityClassName?: string;
};

/**
 * Renders user text with platform entity highlighting.
 *
 * Newlines are preserved so multi-paragraph captions look the way they were
 * typed. Nothing is turned into a real anchor — a preview should never
 * navigate away when clicked.
 */
export const RichText = ({
  text,
  entities = ["url", "mention", "hashtag"],
  shortenUrls = false,
  className,
  entityClassName,
}: RichTextProps) => {
  if (!text) return null;

  const tokens = text.split(ENTITY_PATTERN);

  return (
    <span className={cn("whitespace-pre-wrap break-words", className)}>
      {tokens.map((token, index) => {
        if (!token) return null;

        const kind = classify(token);

        if (!kind || !entities.includes(kind)) {
          return <Fragment key={index}>{token}</Fragment>;
        }

        return (
          <span
            key={index}
            className={cn(
              "text-[var(--pv-accent)] hover:underline",
              entityClassName
            )}
          >
            {kind === "url" && shortenUrls ? prettyUrl(token) : token}
          </span>
        );
      })}
    </span>
  );
};
