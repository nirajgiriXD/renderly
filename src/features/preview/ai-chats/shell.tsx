/**
 * External dependencies.
 */
import { useState } from "react";
import type { ReactNode } from "react";
import {
  Check,
  ChevronDown,
  Copy,
  Pencil,
  RefreshCw,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

/**
 * Internal dependencies.
 */
import {
  Markdown,
  PreviewPlaceholder,
  PreviewSurface,
  TypingDots,
} from "../primitives";
import type { PreviewSkin } from "../primitives";
import { cn } from "@/lib/utils";
import { useClipboard } from "@/hooks";
import type { AiChatsConfig, AiTurn } from "@/types";

export type AiChatPreviewProps = {
  data: AiChatsConfig;
};

export type AssistantStyle = {
  /** Glyph shown beside an assistant reply. */
  avatar: ReactNode;
  /** Outgoing (user) bubble colours. */
  userBubble: string;
  /** Assistant replies sit in a bubble in some clients and full width in others. */
  assistantBubble?: string;
  /** Corner radius for the user bubble. */
  userRadius?: string;
};

/**
 * Collapsed "thought process" disclosure that reasoning models render above
 * their answer.
 */
const Reasoning = ({ text }: { text: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-3">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex cursor-pointer items-center gap-1.5 text-[13px] text-[var(--pv-muted)] transition-colors hover:text-[var(--pv-fg)]"
      >
        <ChevronDown
          className={cn("size-3.5 transition-transform", open && "rotate-180")}
          aria-hidden
        />
        Thought for a few seconds
      </button>
      {open && (
        <p className="mt-2 border-l-2 border-[var(--pv-border)] pl-3 text-[13px] leading-relaxed text-[var(--pv-muted)]">
          {text}
        </p>
      )}
    </div>
  );
};

/** Copy / rate / regenerate row under an assistant reply. */
const AssistantActions = ({ text }: { text: string }) => {
  const { copied, copy } = useClipboard();

  return (
    <div className="mt-2 flex items-center gap-1 text-[var(--pv-faint)]">
      <button
        type="button"
        aria-label="Copy reply"
        onClick={() => void copy(text)}
        className="grid size-7 cursor-pointer place-items-center rounded-md transition-colors hover:bg-[var(--pv-subtle)] hover:text-[var(--pv-fg)]"
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </button>
      <button
        type="button"
        aria-label="Good response"
        className="grid size-7 cursor-pointer place-items-center rounded-md transition-colors hover:bg-[var(--pv-subtle)] hover:text-[var(--pv-fg)]"
      >
        <ThumbsUp className="size-4" />
      </button>
      <button
        type="button"
        aria-label="Bad response"
        className="grid size-7 cursor-pointer place-items-center rounded-md transition-colors hover:bg-[var(--pv-subtle)] hover:text-[var(--pv-fg)]"
      >
        <ThumbsDown className="size-4" />
      </button>
      <button
        type="button"
        aria-label="Regenerate"
        className="grid size-7 cursor-pointer place-items-center rounded-md transition-colors hover:bg-[var(--pv-subtle)] hover:text-[var(--pv-fg)]"
      >
        <RefreshCw className="size-4" />
      </button>
    </div>
  );
};

const Turn = ({
  turn,
  style,
  streaming,
}: {
  turn: AiTurn;
  style: AssistantStyle;
  streaming: boolean;
}) => {
  if (turn.role === "user") {
    return (
      <div className="group flex justify-end">
        <div className="flex max-w-[85%] flex-col items-end gap-1">
          <div
            className={cn(
              "px-4 py-2.5 text-[15px] leading-relaxed",
              style.userRadius ?? "rounded-3xl",
              style.userBubble
            )}
          >
            <p className="whitespace-pre-wrap break-words">{turn.text}</p>
          </div>
          <button
            type="button"
            aria-label="Edit message"
            className="cursor-pointer text-[var(--pv-faint)] opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Pencil className="size-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <span className="mt-0.5 shrink-0">{style.avatar}</span>
      <div className="min-w-0 flex-1">
        {turn.reasoning.trim() && <Reasoning text={turn.reasoning} />}

        <div
          className={cn(
            "text-[15px] leading-relaxed",
            style.assistantBubble
          )}
        >
          <Markdown text={turn.text} />
          {streaming && (
            <span className="ml-1 inline-block h-4 w-2 translate-y-0.5 animate-pulse rounded-sm bg-[var(--pv-fg)]" />
          )}
        </div>

        {!streaming && turn.text.trim() && (
          <AssistantActions text={turn.text} />
        )}
      </div>
    </div>
  );
};

type AiChatShellProps = {
  skin: PreviewSkin;
  data: AiChatsConfig;
  header: ReactNode;
  composer: ReactNode;
  style: AssistantStyle;
  className?: string;
  /** Rendered instead of the transcript when there are no turns yet. */
  emptyState?: ReactNode;
};

/**
 * Frame shared by every assistant preview.
 *
 * The distinguishing feature of these interfaces is that only the *user* gets
 * a bubble — the assistant's reply is page-width prose — so the transcript is
 * modelled that way rather than as a symmetric chat.
 */
export const AiChatShell = ({
  skin,
  data,
  header,
  composer,
  style,
  className,
  emptyState,
}: AiChatShellProps) => {
  const { turns, streaming } = data.conversation;
  const lastAssistant = [...turns]
    .reverse()
    .find((turn) => turn.role === "assistant");

  return (
    <PreviewSurface
      skin={skin}
      theme={data.appearance.theme}
      className={cn(
        "flex w-full flex-col overflow-hidden bg-[var(--pv-bg)]",
        className
      )}
    >
      {header}

      <div
        className="flex-1 space-y-6 overflow-y-auto px-4 py-5"
        style={{ minHeight: 320, maxHeight: 620 }}
      >
        {turns.length === 0
          ? (emptyState ?? (
              <PreviewPlaceholder
                title="No messages yet"
                hint="Add turns in the Conversation section to build the transcript."
                className="my-12"
              />
            ))
          : turns.map((turn) => (
              <Turn
                key={turn.id}
                turn={turn}
                style={style}
                streaming={streaming && turn.id === lastAssistant?.id}
              />
            ))}

        {streaming && !lastAssistant && (
          <div className="flex gap-3 text-[var(--pv-muted)]">
            <span className="shrink-0">{style.avatar}</span>
            <TypingDots className="mt-2" />
          </div>
        )}
      </div>

      {composer}
    </PreviewSurface>
  );
};

/** Shared composer shape: a rounded input with a send affordance. */
export const AiComposer = ({
  placeholder,
  model,
  className,
  inputClassName,
  trailing,
  footnote,
}: {
  placeholder: string;
  model?: string;
  className?: string;
  inputClassName?: string;
  trailing?: ReactNode;
  footnote?: string;
}) => (
  <footer className={cn("shrink-0 px-4 pb-4 pt-2", className)}>
    <div
      className={cn(
        "flex items-center gap-3 rounded-3xl border border-[var(--pv-border)] bg-[var(--pv-surface)] px-4 py-3 text-[var(--pv-muted)]",
        inputClassName
      )}
    >
      <span className="min-w-0 flex-1 truncate text-[15px]">{placeholder}</span>
      {model && (
        <span className="shrink-0 rounded-full border border-[var(--pv-border)] px-2 py-0.5 text-[11px]">
          {model}
        </span>
      )}
      {trailing}
    </div>
    {footnote && (
      <p className="pt-2 text-center text-[11px] text-[var(--pv-faint)]">
        {footnote}
      </p>
    )}
  </footer>
);
