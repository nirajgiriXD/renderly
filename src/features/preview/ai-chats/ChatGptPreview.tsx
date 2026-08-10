/**
 * External dependencies.
 */
import { ArrowUp, ChevronDown, Mic, PanelLeft, Plus, SlidersHorizontal } from "lucide-react";

/**
 * Internal dependencies.
 */
import { AiChatShell, AiComposer } from "./shell";
import type { AiChatPreviewProps } from "./shell";
import { OpenAiGlyph } from "./glyphs";
import { createSkin } from "../primitives";

const SKIN = createSkin(
  {
    bg: "#ffffff",
    surface: "#ffffff",
    subtle: "#f4f4f4",
    fg: "#0d0d0d",
    muted: "#5d5d5d",
    faint: "#8f8f8f",
    border: "#e3e3e3",
    accent: "#0d0d0d",
    accentFg: "#ffffff",
  },
  {
    bg: "#212121",
    surface: "#303030",
    subtle: "#303030",
    fg: "#ececec",
    muted: "#b4b4b4",
    faint: "#8f8f8f",
    border: "#3f3f3f",
    accent: "#ececec",
    accentFg: "#0d0d0d",
  }
);

/**
 * ChatGPT transcript.
 *
 * Characteristic layout: the model name doubles as the header, user turns are
 * grey pills on the right, and assistant replies run full width with the
 * OpenAI mark and a copy/rate/regenerate row underneath.
 */
export const ChatGptPreview = ({ data }: AiChatPreviewProps) => {
  const model = data.apps.models.chatgpt;

  return (
    <AiChatShell
      skin={SKIN}
      data={data}
      style={{
        avatar: (
          <span className="grid size-7 place-items-center rounded-full border border-[var(--pv-border)]">
            <OpenAiGlyph />
          </span>
        ),
        userBubble: "bg-[var(--pv-subtle)] text-[var(--pv-fg)]",
      }}
      header={
        <header className="flex shrink-0 items-center gap-3 px-3 py-2.5 text-[var(--pv-muted)]">
          <PanelLeft className="size-5" aria-hidden />
          <button
            type="button"
            className="flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-[17px] font-semibold text-[var(--pv-fg)] transition-colors hover:bg-[var(--pv-subtle)]"
          >
            ChatGPT
            <span className="font-normal text-[var(--pv-muted)]">
              {model.replace(/^GPT-?/i, "")}
            </span>
            <ChevronDown className="size-4" aria-hidden />
          </button>
          <span className="ml-auto text-sm">
            <SlidersHorizontal className="size-5" aria-hidden />
          </span>
        </header>
      }
      composer={
        <AiComposer
          placeholder="Ask anything"
          trailing={
            <>
              <Mic className="size-5 shrink-0" aria-hidden />
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--pv-accent)] text-[var(--pv-accent-fg)]">
                <ArrowUp className="size-4" aria-hidden />
              </span>
            </>
          }
          inputClassName="rounded-[26px] pl-3"
          footnote="ChatGPT can make mistakes. Check important info."
        />
      }
      emptyState={
        <div className="flex h-full flex-col items-center justify-center gap-4 py-16">
          <OpenAiGlyph className="size-8" />
          <p className="text-xl font-medium">What can I help with?</p>
          <span className="flex items-center gap-2 rounded-full border border-[var(--pv-border)] px-3 py-1.5 text-sm text-[var(--pv-muted)]">
            <Plus className="size-4" aria-hidden />
            Add a turn in the Conversation section
          </span>
        </div>
      }
    />
  );
};
