/**
 * External dependencies.
 */
import { ChevronDown, Image, Menu, Mic, Plus, Send } from "lucide-react";

/**
 * Internal dependencies.
 */
import { AiChatShell, AiComposer } from "./shell";
import type { AiChatPreviewProps } from "./shell";
import { GeminiGlyph } from "./glyphs";
import { createSkin } from "../primitives";

const SKIN = createSkin(
  {
    bg: "#ffffff",
    surface: "#f0f4f9",
    subtle: "#e9eef6",
    fg: "#1f1f1f",
    muted: "#5f6368",
    faint: "#80868b",
    border: "#dde3ea",
    accent: "#0b57d0",
    accentFg: "#ffffff",
  },
  {
    bg: "#1b1b1b",
    surface: "#282a2c",
    subtle: "#333537",
    fg: "#e3e3e3",
    muted: "#c4c7c5",
    faint: "#9aa0a6",
    border: "#3c4043",
    accent: "#a8c7fa",
  }
);

/**
 * Gemini transcript.
 *
 * Gemini brands the product name with its blue-to-magenta gradient, keeps the
 * user's turn in a tinted pill and leads each answer with the spark mark.
 */
export const GeminiPreview = ({ data }: AiChatPreviewProps) => {
  const model = data.apps.models.gemini;

  return (
    <AiChatShell
      skin={SKIN}
      data={data}
      style={{
        avatar: <GeminiGlyph className="size-6" />,
        userBubble: "bg-[var(--pv-surface)] text-[var(--pv-fg)]",
      }}
      header={
        <header className="flex shrink-0 items-center gap-3 px-3 py-2.5">
          <Menu className="size-5 text-[var(--pv-muted)]" aria-hidden />
          <button
            type="button"
            className="flex cursor-pointer items-center gap-1.5 rounded-full px-2 py-1 transition-colors hover:bg-[var(--pv-surface)]"
          >
            <span className="bg-gradient-to-r from-[#4285f4] via-[#9b72cb] to-[#d96570] bg-clip-text text-[17px] font-medium text-transparent">
              Gemini
            </span>
            <span className="text-[13px] text-[var(--pv-muted)]">{model}</span>
            <ChevronDown className="size-4 text-[var(--pv-muted)]" aria-hidden />
          </button>
        </header>
      }
      composer={
        <AiComposer
          placeholder="Ask Gemini"
          inputClassName="rounded-full border-transparent bg-[var(--pv-surface)]"
          trailing={
            <>
              <Image className="size-5 shrink-0" aria-hidden />
              <Mic className="size-5 shrink-0" aria-hidden />
              <Send className="size-5 shrink-0 text-[var(--pv-accent)]" aria-hidden />
            </>
          }
          footnote="Gemini can make mistakes, so double-check it."
        />
      }
      emptyState={
        <div className="flex h-full flex-col justify-center gap-3 py-16">
          <p className="bg-gradient-to-r from-[#4285f4] via-[#9b72cb] to-[#d96570] bg-clip-text text-3xl font-medium text-transparent">
            Hello there
          </p>
          <p className="text-2xl font-medium text-[var(--pv-muted)]">
            How can I help you today?
          </p>
          <span className="mt-2 flex w-fit items-center gap-2 rounded-full bg-[var(--pv-surface)] px-3 py-1.5 text-sm text-[var(--pv-muted)]">
            <Plus className="size-4" aria-hidden />
            Add a turn in the Conversation section
          </span>
        </div>
      }
    />
  );
};
