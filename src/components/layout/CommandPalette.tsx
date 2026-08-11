/**
 * External dependencies.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Braces,
  ClipboardCopy,
  CornerDownLeft,
  Frame,
  ImageDown,
  Monitor,
  Moon,
  RotateCcw,
  Search,
  Smartphone,
  Sun,
  Tablet,
} from "lucide-react";
import { toast } from "sonner";

/**
 * Internal dependencies.
 */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { CATEGORIES, CATEGORY_MAP, sectionsFor } from "@/constants";
import { cn } from "@/lib/utils";
import type { StageExport } from "@/hooks";
import { useConfig, useConfigActions, useWorkspace } from "@/store";

type Command = {
  id: string;
  label: string;
  group: string;
  icon: LucideIcon;
  /** Extra words the search should match on. */
  keywords?: string;
  run: () => void;
};

type PaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exportActions: StageExport;
};

/**
 * Keyboard-first shortcut to everything the toolbars can do.
 *
 * The studio's controls are spread across a rail, a top bar, a toolbar and an
 * inspector — which is right for discovery and slow for repeat use. This is
 * the fast path over the same actions; it adds no capability of its own.
 *
 * The searchable list is a child component so that closing the dialog
 * unmounts it, which is what resets the query and the highlight. Keeping that
 * state up here would mean clearing it by hand every time the palette opens.
 */
export const CommandPalette = ({
  open,
  onOpenChange,
  ...rest
}: PaletteProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent
      showCloseButton={false}
      className="top-[15%] max-w-xl translate-y-0 overflow-hidden p-0"
    >
      <DialogTitle className="sr-only">Command palette</DialogTitle>
      <DialogDescription className="sr-only">
        Search for a place to go or an action to run.
      </DialogDescription>
      <CommandList onDone={() => onOpenChange(false)} {...rest} />
    </DialogContent>
  </Dialog>
);

const CommandList = ({
  exportActions,
  onDone,
}: Omit<PaletteProps, "open" | "onOpenChange"> & { onDone: () => void }) => {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const { category, setCategory, setSection } = useWorkspace();
  const config = useConfig();
  const { setAppearance, resetCategory } = useConfigActions();

  const appearance = config[category].appearance;
  const descriptor = CATEGORY_MAP[category];

  const commands = useMemo<Command[]>(
    () => [
      ...CATEGORIES.map((entry) => ({
        id: `category:${entry.id}`,
        label: entry.label,
        group: "Go to",
        icon: entry.icon,
        keywords: entry.description,
        run: () => setCategory(entry.id),
      })),

      ...sectionsFor(category).map((section) => ({
        id: `section:${section.id}`,
        label: section.label,
        group: `${descriptor.label} sections`,
        icon: section.icon,
        keywords: section.summary,
        run: () => setSection(section.id),
      })),

      {
        id: "device:ios",
        label: "Preview on iPhone",
        group: "Canvas",
        icon: Smartphone,
        keywords: "device ios apple width",
        run: () => setAppearance(category, { device: "ios" }),
      },
      {
        id: "device:android",
        label: "Preview on Android",
        group: "Canvas",
        icon: Tablet,
        keywords: "device width",
        run: () => setAppearance(category, { device: "android" }),
      },
      {
        id: "device:web",
        label: "Preview on desktop",
        group: "Canvas",
        icon: Monitor,
        keywords: "device web browser width",
        run: () => setAppearance(category, { device: "web" }),
      },
      {
        id: "theme:preview",
        label:
          appearance.theme === "dark"
            ? "Switch the preview to light"
            : "Switch the preview to dark",
        group: "Canvas",
        icon: appearance.theme === "dark" ? Sun : Moon,
        keywords: "theme dark light preview",
        run: () =>
          setAppearance(category, {
            theme: appearance.theme === "dark" ? "light" : "dark",
          }),
      },
      {
        id: "frame",
        label: appearance.showDeviceFrame
          ? "Show the content on its own"
          : "Show the device frame",
        group: "Canvas",
        icon: Frame,
        keywords: "bezel chrome browser window screenshot bare",
        run: () =>
          setAppearance(category, {
            showDeviceFrame: !appearance.showDeviceFrame,
          }),
      },

      {
        id: "export:png",
        label: "Download the preview as PNG",
        group: "Export",
        icon: ImageDown,
        keywords: "image save download",
        run: exportActions.downloadPng,
      },
      ...(exportActions.canCopyImage
        ? [
            {
              id: "export:copy",
              label: "Copy the preview image",
              group: "Export",
              icon: ClipboardCopy,
              keywords: "clipboard paste image",
              run: exportActions.copyImage,
            },
          ]
        : []),
      {
        id: "export:json",
        label: "Download the content as JSON",
        group: "Export",
        icon: Braces,
        keywords: "config save download",
        run: exportActions.downloadJson,
      },

      {
        id: "reset",
        label: `Reset ${descriptor.label.toLowerCase()} to the example content`,
        group: "Content",
        icon: RotateCcw,
        keywords: "restore default sample",
        run: () => {
          resetCategory(category);
          toast.success(`${descriptor.label} reset to the example content.`);
        },
      },
    ],
    [
      appearance.showDeviceFrame,
      appearance.theme,
      category,
      descriptor.label,
      exportActions,
      resetCategory,
      setAppearance,
      setCategory,
      setSection,
    ]
  );

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return commands;

    return commands.filter((command) =>
      `${command.label} ${command.group} ${command.keywords ?? ""}`
        .toLowerCase()
        .includes(needle)
    );
  }, [commands, query]);

  // Derived rather than stored, so a shrinking result set can never leave the
  // highlight pointing past the end of the list.
  const activeIndex = Math.min(active, Math.max(results.length - 1, 0));

  useEffect(() => {
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, results.length]);

  const choose = (command: Command | undefined) => {
    if (!command) return;
    onDone();
    command.run();
  };

  const move = (direction: 1 | -1) => {
    const size = Math.max(results.length, 1);
    setActive((activeIndex + direction + size) % size);
  };

  let lastGroup = "";

  return (
    <div
      onKeyDown={(event) => {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          move(1);
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          move(-1);
        } else if (event.key === "Enter") {
          event.preventDefault();
          choose(results[activeIndex]);
        }
      }}
    >
      <div className="flex items-center gap-3 border-b border-border px-4">
        <Search className="size-4 shrink-0 text-faint" aria-hidden />
        <input
          autoFocus
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          placeholder="Search sections, canvas settings, exports…"
          aria-label="Search commands"
          className="h-13 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
        />
        <kbd className="hidden rounded border border-border bg-sunken px-1.5 py-0.5 text-[0.6875rem] font-medium text-faint sm:block">
          Esc
        </kbd>
      </div>

      <div
        ref={listRef}
        role="listbox"
        aria-label="Commands"
        className="scroll-region max-h-[min(24rem,50dvh)] overflow-y-auto p-2"
      >
        {results.length === 0 ? (
          <p className="px-3 py-8 text-center text-sm text-muted-foreground">
            Nothing matches “{query.trim()}”.
          </p>
        ) : (
          results.map((command, index) => {
            const showGroup = command.group !== lastGroup;
            lastGroup = command.group;
            const isActive = index === activeIndex;

            return (
              <div key={command.id}>
                {showGroup && (
                  <p className="px-2 pb-1 pt-3 text-[0.6875rem] font-semibold uppercase tracking-widest text-faint first:pt-1">
                    {command.group}
                  </p>
                )}
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  data-active={isActive}
                  onMouseMove={() => setActive(index)}
                  onClick={() => choose(command)}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm",
                    "transition-colors duration-100",
                    isActive
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <command.icon
                    className={cn(
                      "size-4 shrink-0",
                      isActive ? "text-brand-text" : "text-faint"
                    )}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1 truncate">
                    {command.label}
                  </span>
                  {isActive && (
                    <CornerDownLeft
                      className="size-3.5 shrink-0 text-faint"
                      aria-hidden
                    />
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
