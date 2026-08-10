/**
 * External dependencies.
 */
import { ArrowUp, ChevronDown, Paperclip, PanelLeft, Plus } from "lucide-react";

/**
 * Internal dependencies.
 */
import { AiChatShell, AiComposer } from "./shell";
import type { AiChatPreviewProps } from "./shell";
import { GrokGlyph } from "./glyphs";
import { createSkin } from "../primitives";

/** Grok is a dark-first product; the light palette is the secondary case. */
const SKIN = createSkin(
  {
    bg: "#ffffff",
    surface: "#f7f7f8",
    subtle: "#efeff1",
    fg: "#0f0f0f",
    muted: "#6b6b6f",
    faint: "#9a9aa0",
    border: "#e4e4e7",
    accent: "#0f0f0f",
    accentFg: "#ffffff",
  },
  {
    bg: "#000000",
    surface: "#131316",
    subtle: "#1c1c1f",
    fg: "#f5f5f5",
    muted: "#9a9aa0",
    faint: "#71717a",
    border: "#26262a",
    accent: "#ffffff",
    accentFg: "#000000",
  }
);

/**
 * Grok transcript.
 *
 * Grok keeps the surface almost black with a monochrome mark, and hangs the
 * model selector off the product name in the header.
 */
export const GrokPreview = ({ data }: AiChatPreviewProps) => {
  const model = data.apps.models.grok;

  return (
    <AiChatShell
      skin={SKIN}
      data={data}
      style={{
        avatar: (
          <span className="grid size-7 place-items-center rounded-full border border-[var(--pv-border)]">
            <GrokGlyph className="size-3.5" />
          </span>
        ),
        userBubble: "bg-[var(--pv-subtle)] text-[var(--pv-fg)]",
        userRadius: "rounded-2xl",
      }}
      header={
        <header className="flex shrink-0 items-center gap-3 px-3 py-2.5">
          <PanelLeft className="size-5 text-[var(--pv-muted)]" aria-hidden />
          <button
            type="button"
            className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 transition-colors hover:bg-[var(--pv-subtle)]"
          >
            <GrokGlyph className="size-4" />
            <span className="text-[17px] font-semibold">Grok</span>
            <span className="text-[13px] text-[var(--pv-muted)]">
              {model.replace(/^Grok\s*/i, "")}
            </span>
            <ChevronDown className="size-4 text-[var(--pv-muted)]" aria-hidden />
          </button>
        </header>
      }
      composer={
        <AiComposer
          placeholder="What do you want to know?"
          inputClassName="rounded-2xl bg-[var(--pv-surface)]"
          trailing={
            <>
              <Paperclip className="size-4 shrink-0" aria-hidden />
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[var(--pv-accent)] text-[var(--pv-accent-fg)]">
                <ArrowUp className="size-4" aria-hidden />
              </span>
            </>
          }
        />
      }
      emptyState={
        <div className="flex h-full flex-col items-center justify-center gap-4 py-16">
          <GrokGlyph className="size-8" />
          <p className="text-xl font-medium">What do you want to know?</p>
          <span className="flex items-center gap-2 rounded-full border border-[var(--pv-border)] px-3 py-1.5 text-sm text-[var(--pv-muted)]">
            <Plus className="size-4" aria-hidden />
            Add a turn in the Conversation section
          </span>
        </div>
      }
    />
  );
};
