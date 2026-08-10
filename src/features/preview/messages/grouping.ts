/**
 * External dependencies.
 */
import { useMemo } from "react";

/**
 * Internal dependencies.
 */
import { formatDayLabel } from "@/lib/format";
import type { ChatMessage } from "@/types";

export type GroupedMessage = ChatMessage & {
  /** First message of a run by the same author. */
  startsRun: boolean;
  /** Last message of a run — where the tail and timestamp go. */
  endsRun: boolean;
  /** Day label to print above this message, if the date changed. */
  dayLabel: string | null;
};

/** Messages closer together than this are treated as one run. */
const SAME_RUN_WINDOW_MS = 5 * 60 * 1000;

const timeOf = (message: ChatMessage) => {
  const parsed = message.date ? new Date(message.date).getTime() : Date.now();
  return Number.isNaN(parsed) ? Date.now() : parsed;
};

/**
 * Annotates each message with the run and day-break information every chat
 * client needs in order to decide spacing, avatars, tails and separators.
 */
export const useGroupedMessages = (
  messages: ChatMessage[]
): GroupedMessage[] =>
  useMemo(
    () =>
      messages.map((message, index) => {
        const previous = messages[index - 1];
        const next = messages[index + 1];

        const sameAsPrevious =
          previous !== undefined &&
          previous.author === message.author &&
          timeOf(message) - timeOf(previous) < SAME_RUN_WINDOW_MS;

        const sameAsNext =
          next !== undefined &&
          next.author === message.author &&
          timeOf(next) - timeOf(message) < SAME_RUN_WINDOW_MS;

        const dayLabel = formatDayLabel(message.date || undefined);
        const previousDay = previous
          ? formatDayLabel(previous.date || undefined)
          : null;

        return {
          ...message,
          startsRun: !sameAsPrevious,
          endsRun: !sameAsNext,
          dayLabel: dayLabel !== previousDay ? dayLabel : null,
        };
      }),
    [messages]
  );
