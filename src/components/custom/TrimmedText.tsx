import { useState } from "react";

export const TrimmedText = ({
  text,
  maxLength = 100,
  showLessSuffix,
  showMoreSuffix = "...see more",
  trimOnNewline = true,
  className = "",
}: {
  text: string;
  maxLength?: number;
  showMoreSuffix?: string;
  showLessSuffix?: string;
  trimOnNewline?: boolean;
  className?: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Trim the text
  text = text.trim();

  // Helper to check if text needs truncation
  const checkTruncation = () => {
    if (!text) return { needed: false, trimmed: "" };

    let trimmed = text;
    let needed = false;

    // Truncate at first newline if enabled
    if (trimOnNewline) {
      const newlineIndex = text.indexOf("\n");
      if (newlineIndex !== -1) {
        trimmed = text.slice(0, newlineIndex);
        needed = true;
      }
    }

    // Check length truncation on the potentially already newline-trimmed text
    if (trimmed.length > maxLength) {
      trimmed = trimmed.slice(0, maxLength);
      needed = true;
    }

    return { needed, trimmed };
  };

  const { needed, trimmed } = checkTruncation();

  // If truncation is not needed, just show the text
  if (!needed) {
    return (
      <div className={className}>
        <span className="whitespace-pre-wrap">{text}</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <span className="whitespace-pre-wrap">{isExpanded ? text : trimmed}</span>
      <span
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        className="text-muted-foreground ml-1 cursor-pointer hover:underline underline-offset-2"
      >
        {showLessSuffix && isExpanded ? showLessSuffix : showMoreSuffix}
      </span>
    </div>
  );
};
