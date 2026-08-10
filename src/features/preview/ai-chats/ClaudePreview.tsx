/**
 * External dependencies.
 */
import { ArrowUp, ChevronDown, Menu, Paperclip, Plus } from "lucide-react";

/**
 * Internal dependencies.
 */
import { AiChatShell, AiComposer } from "./shell";
import type { AiChatPreviewProps } from "./shell";
import { AnthropicGlyph } from "./glyphs";
import { createSkin } from "../primitives";

/** Claude's warm paper background is the single most recognisable detail. */
const SKIN = createSkin(
  {
    bg: "#faf9f5",
    surface: "#ffffff",
    subtle: "#f0eee6",
    fg: "#3d3929",
    muted: "#83827d",
    faint: "#9a9890",
    border: "#e5e2d9",
    accent: "#d97757",
    accentFg: "#ffffff",
  },
  {
    bg: "#262624",
    surface: "#30302e",
    subtle: "#3a3a37",
    fg: "#f0eee6",
    muted: "#a5a49d",
    faint: "#8b8a83",
    border: "#3d3d3a",
  }
);

/**
 * Claude transcript.
 *
 * Claude puts the assistant reply on the page itself with a small terracotta
 * mark, and the user's turn in a soft bordered card rather than a solid bubble.
 */
export const ClaudePreview = ({ data }: AiChatPreviewProps) => {
  const model = data.apps.models.claude;
  const title = data.conversation.title.trim() || "New chat";

  return (
    <AiChatShell
      skin={SKIN}
      data={data}
      style={{
        avatar: (
          <span className="grid size-7 place-items-center rounded-full bg-[#d97757] text-white">
            <AnthropicGlyph className="size-3.5" />
          </span>
        ),
        userBubble:
          "bg-[var(--pv-subtle)] text-[var(--pv-fg)] border border-[var(--pv-border)]",
        userRadius: "rounded-2xl",
      }}
      header={
        <header className="flex shrink-0 items-center gap-3 border-b border-[var(--pv-border)] px-3 py-2.5">
          <Menu className="size-5 text-[var(--pv-muted)]" aria-hidden />
          <p className="min-w-0 flex-1 truncate text-[15px] font-medium">
            {title}
          </p>
          <button
            type="button"
            className="flex shrink-0 cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-[13px] text-[var(--pv-muted)] transition-colors hover:bg-[var(--pv-subtle)]"
          >
            {model}
            <ChevronDown className="size-3.5" aria-hidden />
          </button>
        </header>
      }
      composer={
        <AiComposer
          placeholder="How can I help you today?"
          inputClassName="rounded-2xl bg-[var(--pv-surface)] shadow-sm"
          trailing={
            <>
              <Paperclip className="size-4 shrink-0" aria-hidden />
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#d97757] text-white">
                <ArrowUp className="size-4" aria-hidden />
              </span>
            </>
          }
        />
      }
      emptyState={
        <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
          <span className="grid size-10 place-items-center rounded-full bg-[#d97757] text-white">
            <AnthropicGlyph className="size-5" />
          </span>
          <p className="text-2xl font-medium">Good to see you</p>
          <span className="flex items-center gap-2 rounded-full border border-[var(--pv-border)] px-3 py-1.5 text-sm text-[var(--pv-muted)]">
            <Plus className="size-4" aria-hidden />
            Add a turn in the Conversation section
          </span>
        </div>
      }
    />
  );
};
