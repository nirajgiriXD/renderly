/**
 * External dependencies.
 */
import { useMemo, useState } from "react";
import type { ReactNode } from "react";

/**
 * Internal dependencies.
 */
import { RichText } from "./RichText";
import type { Entity } from "./RichText";
import { cn } from "@/lib/utils";

type ExpandableTextProps = {
  text: string;
  /** Characters shown before truncating. `0` disables length truncation. */
  limit?: number;
  /** Also cut at the first blank line, the way Facebook and LinkedIn do. */
  clampAtParagraph?: boolean;
  moreLabel?: string;
  lessLabel?: string;
  entities?: readonly Entity[];
  shortenUrls?: boolean;
  className?: string;
  entityClassName?: string;
  moreClassName?: string;
  /** Rendered inline before the text — Instagram and TikTok lead with the handle. */
  prefix?: ReactNode;
};

/**
 * Caption/body text with the "…see more" affordance feeds use.
 *
 * Truncation lands on a word boundary rather than mid-word, and the toggle is
 * a real `button` so the expanded state is reachable by keyboard.
 */
export const ExpandableText = ({
  text,
  limit = 280,
  clampAtParagraph = false,
  moreLabel = "…more",
  lessLabel,
  entities,
  shortenUrls,
  className,
  entityClassName,
  moreClassName,
  prefix,
}: ExpandableTextProps) => {
  const [expanded, setExpanded] = useState(false);

  const { visible, truncated } = useMemo(() => {
    const value = text.trim();
    if (!value) return { visible: "", truncated: false };

    let candidate = value;
    let cut = false;

    if (clampAtParagraph) {
      const breakIndex = candidate.search(/\n\s*\n/);
      if (breakIndex > 0) {
        candidate = candidate.slice(0, breakIndex);
        cut = true;
      }
    }

    if (limit > 0 && candidate.length > limit) {
      const slice = candidate.slice(0, limit);
      const lastSpace = slice.lastIndexOf(" ");
      candidate = (lastSpace > limit * 0.6 ? slice.slice(0, lastSpace) : slice)
        .trimEnd()
        // Drop dangling punctuation so the ellipsis reads cleanly.
        .replace(/[.,;:!?-]+$/, "");
      cut = true;
    }

    return { visible: candidate, truncated: cut };
  }, [text, limit, clampAtParagraph]);

  if (!visible && !prefix) return null;

  return (
    <div className={className}>
      {prefix}
      <RichText
        text={expanded || !truncated ? text.trim() : visible}
        entities={entities}
        shortenUrls={shortenUrls}
        entityClassName={entityClassName}
      />
      {truncated && (!expanded || lessLabel) && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className={cn(
            "ml-1 cursor-pointer text-[var(--pv-muted)] hover:underline",
            moreClassName
          )}
        >
          {expanded ? lessLabel : moreLabel}
        </button>
      )}
    </div>
  );
};
