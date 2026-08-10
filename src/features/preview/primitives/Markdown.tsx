/**
 * External dependencies.
 */
import { Fragment, useMemo } from "react";
import { Check, Copy } from "lucide-react";

/**
 * Internal dependencies.
 */
import { cn } from "@/lib/utils";
import { useClipboard } from "@/hooks";

/*
 * Assistant replies are markdown, so previewing them as plain text would miss
 * the thing that most defines how a chat answer looks: headings, lists and
 * fenced code. This is a deliberately small subset — enough for a faithful
 * preview, without taking on a parser dependency for text nobody executes.
 */

type Block =
  | { kind: "paragraph"; text: string }
  | { kind: "heading"; level: 1 | 2 | 3; text: string }
  | { kind: "code"; language: string; code: string }
  | { kind: "list"; ordered: boolean; items: string[] }
  | { kind: "quote"; text: string }
  | { kind: "rule" };

const parseBlocks = (source: string): Block[] => {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];

  let index = 0;

  const flushParagraph = (buffer: string[]) => {
    if (buffer.length > 0) {
      blocks.push({ kind: "paragraph", text: buffer.join("\n").trim() });
      buffer.length = 0;
    }
  };

  const paragraph: string[] = [];

  while (index < lines.length) {
    const line = lines[index];

    const fence = line.match(/^\s*```\s*([\w+-]*)\s*$/);
    if (fence) {
      flushParagraph(paragraph);
      const language = fence[1] ?? "";
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !/^\s*```/.test(lines[index])) {
        code.push(lines[index]);
        index += 1;
      }
      index += 1; // Closing fence, or end of input for a still-streaming reply.
      blocks.push({ kind: "code", language, code: code.join("\n") });
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      flushParagraph(paragraph);
      blocks.push({
        kind: "heading",
        level: heading[1].length as 1 | 2 | 3,
        text: heading[2],
      });
      index += 1;
      continue;
    }

    if (/^\s*(---|\*\*\*|___)\s*$/.test(line)) {
      flushParagraph(paragraph);
      blocks.push({ kind: "rule" });
      index += 1;
      continue;
    }

    const bullet = line.match(/^\s*([-*+]|\d+[.)])\s+(.*)$/);
    if (bullet) {
      flushParagraph(paragraph);
      const ordered = /\d/.test(bullet[1]);
      const items: string[] = [];
      while (index < lines.length) {
        const match = lines[index].match(/^\s*([-*+]|\d+[.)])\s+(.*)$/);
        if (!match || /\d/.test(match[1]) !== ordered) break;
        items.push(match[2]);
        index += 1;
      }
      blocks.push({ kind: "list", ordered, items });
      continue;
    }

    const quote = line.match(/^\s*>\s?(.*)$/);
    if (quote) {
      flushParagraph(paragraph);
      const parts: string[] = [];
      while (index < lines.length) {
        const match = lines[index].match(/^\s*>\s?(.*)$/);
        if (!match) break;
        parts.push(match[1]);
        index += 1;
      }
      blocks.push({ kind: "quote", text: parts.join("\n") });
      continue;
    }

    if (line.trim() === "") {
      flushParagraph(paragraph);
      index += 1;
      continue;
    }

    paragraph.push(line);
    index += 1;
  }

  flushParagraph(paragraph);
  return blocks;
};

/** `**bold**`, `*italic*`, `` `code` `` and `[text](url)`. */
const INLINE_PATTERN =
  /(\*\*[^*]+\*\*|__[^_]+__|\*[^*\n]+\*|_[^_\n]+_|`[^`\n]+`|\[[^\]]+\]\([^)\s]+\))/g;

const Inline = ({ text }: { text: string }) => (
  <>
    {text.split(INLINE_PATTERN).map((token, key) => {
      if (!token) return null;

      if (
        (token.startsWith("**") && token.endsWith("**")) ||
        (token.startsWith("__") && token.endsWith("__"))
      ) {
        return (
          <strong key={key} className="font-semibold">
            {token.slice(2, -2)}
          </strong>
        );
      }

      if (
        (token.startsWith("*") && token.endsWith("*")) ||
        (token.startsWith("_") && token.endsWith("_"))
      ) {
        return <em key={key}>{token.slice(1, -1)}</em>;
      }

      if (token.startsWith("`") && token.endsWith("`")) {
        return (
          <code
            key={key}
            className="rounded border border-[var(--pv-border)] bg-[var(--pv-subtle)] px-1 py-px font-mono text-[0.86em]"
          >
            {token.slice(1, -1)}
          </code>
        );
      }

      const link = token.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
      if (link) {
        return (
          <span key={key} className="text-[var(--pv-accent)] underline">
            {link[1]}
          </span>
        );
      }

      return <Fragment key={key}>{token}</Fragment>;
    })}
  </>
);

const CodeBlock = ({ language, code }: { language: string; code: string }) => {
  const { copied, copy } = useClipboard();

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--pv-border)]">
      <div className="flex items-center justify-between bg-[var(--pv-subtle)] px-3 py-1.5 text-[11px] text-[var(--pv-muted)]">
        <span className="font-mono">{language || "text"}</span>
        <button
          type="button"
          onClick={() => void copy(code)}
          className="inline-flex cursor-pointer items-center gap-1 rounded px-1.5 py-0.5 transition-colors hover:text-[var(--pv-fg)]"
        >
          {copied ? (
            <Check className="size-3" aria-hidden />
          ) : (
            <Copy className="size-3" aria-hidden />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto bg-[var(--pv-bg)] p-3 text-[12.5px] leading-relaxed">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
};

/**
 * Renders a markdown subset with the platform palette.
 *
 * @param text - Raw markdown authored in the editor.
 * @param compact - Tightens vertical rhythm for chat bubbles.
 */
export const Markdown = ({
  text,
  className,
  compact = false,
}: {
  text: string;
  className?: string;
  compact?: boolean;
}) => {
  const blocks = useMemo(() => parseBlocks(text), [text]);

  if (blocks.length === 0) return null;

  return (
    <div className={cn(compact ? "space-y-2" : "space-y-4", className)}>
      {blocks.map((block, index) => {
        switch (block.kind) {
          case "heading": {
            const Tag = (["h3", "h4", "h5"] as const)[block.level - 1];
            return (
              <Tag
                key={index}
                className={cn(
                  "font-semibold",
                  block.level === 1 && "text-[1.15em]",
                  block.level === 2 && "text-[1.06em]"
                )}
              >
                <Inline text={block.text} />
              </Tag>
            );
          }

          case "code":
            return (
              <CodeBlock
                key={index}
                language={block.language}
                code={block.code}
              />
            );

          case "list": {
            const Tag = block.ordered ? "ol" : "ul";
            return (
              <Tag
                key={index}
                className={cn(
                  "space-y-1 pl-5",
                  block.ordered ? "list-decimal" : "list-disc"
                )}
              >
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="marker:text-[var(--pv-faint)]">
                    <Inline text={item} />
                  </li>
                ))}
              </Tag>
            );
          }

          case "quote":
            return (
              <blockquote
                key={index}
                className="border-l-2 border-[var(--pv-border)] pl-3 text-[var(--pv-muted)]"
              >
                <Inline text={block.text} />
              </blockquote>
            );

          case "rule":
            return (
              <hr key={index} className="border-[var(--pv-border)]" />
            );

          default:
            return (
              <p key={index} className="whitespace-pre-wrap break-words">
                <Inline text={block.text} />
              </p>
            );
        }
      })}
    </div>
  );
};
