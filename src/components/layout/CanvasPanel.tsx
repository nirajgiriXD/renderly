/**
 * External dependencies.
 */
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/**
 * Internal dependencies.
 */
import { CanvasToolbar } from "./CanvasToolbar";
import type { CanvasView } from "./CanvasToolbar";
import { PreviewStage } from "@/features/preview/PreviewStage";
import { PLATFORMS_BY_CATEGORY } from "@/constants";
import { cn } from "@/lib/utils";
import { useClipboard } from "@/hooks";
import { stripDataUrls } from "@/lib/storage";
import { stepZoom, zoomByWheel } from "@/lib/zoom";
import { useConfig, useWorkspace } from "@/store";

/** The rasterised surface: dotted backdrop plus the gutter around a preview. */
const STAGE_CLASS = "canvas-grid flex justify-center bg-sunken px-5 py-8";

const DEVICE_LABEL = {
  ios: "iPhone · 390px",
  android: "Android · 412px",
  web: "Desktop · 720px",
} as const;

/**
 * The right half of the workspace: the rendered stage, or the JSON behind it.
 *
 * The stage is what gets rasterised on export, so it — and only it — carries
 * the ref handed down from the shell. Scaling happens on a wrapper *around*
 * it with CSS `zoom`, which leaves the stage's own layout box untouched and
 * keeps an export 1:1 whatever the canvas is currently showing.
 */
export const CanvasPanel = ({
  stageRef,
  className,
}: {
  stageRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
}) => {
  const [view, setView] = useState<CanvasView>("preview");
  const [zoom, setZoom] = useState(1);
  const { category } = useWorkspace();
  const config = useConfig();
  const { copied, copy } = useClipboard();

  const [viewportNode, setViewportNode] = useState<HTMLDivElement | null>(null);
  useCanvasViewport(viewportNode, view === "preview", zoom, setZoom);

  const json = useMemo(
    () => JSON.stringify(stripDataUrls(config[category]), null, 2),
    [config, category]
  );

  const appearance = config[category].appearance;
  const selectedCount = useMemo(() => {
    const chosen = new Set<string>(config[category].apps.selected);
    return PLATFORMS_BY_CATEGORY[category].filter((platform) =>
      chosen.has(platform)
    ).length;
  }, [config, category]);

  return (
    <div className={cn("flex h-full flex-col bg-sunken", className)}>
      <CanvasToolbar
        category={category}
        view={view}
        onViewChange={setView}
        zoom={zoom}
        onZoomChange={setZoom}
        jsonCopied={copied}
        onCopyJson={() => void copy(json)}
      />

      {view === "preview" ? (
        <>
          <div
            ref={setViewportNode}
            className={cn(
              "scroll-region relative min-h-0 flex-1 overflow-auto",
              "cursor-grab data-panning:cursor-grabbing"
            )}
          >
            {/*
              Sizing is left entirely to CSS. Under `zoom`, an auto-width
              block already resolves to `container / zoom` locally and renders
              back at the container's width — so zooming out reflows the
              previews into more columns for free, with nothing measured.

              An earlier version set this width from an observed
              `clientWidth`. That closed a loop — measure, relayout, toggle a
              scrollbar, measure again — which is what made the canvas wobble
              while zooming, and kept Chrome on a low-quality raster for as
              long as it kept moving.
            */}
            <div
              style={zoom === 1 ? undefined : { zoom }}
              className="flex min-h-full flex-col"
            >
              <div ref={stageRef} className={cn(STAGE_CLASS, "flex-1")}>
                <PreviewStage
                  category={category}
                  config={config}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <footer className="flex shrink-0 items-center gap-2 border-t border-border bg-surface px-3.5 py-1.5 text-[0.6875rem] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span
                aria-hidden
                className={cn(
                  "size-1.5 rounded-full",
                  selectedCount > 0 ? "bg-success" : "bg-border-strong"
                )}
              />
              {selectedCount === 0
                ? "No platform selected"
                : `${selectedCount} platform${selectedCount === 1 ? "" : "s"}`}
            </span>
            <span aria-hidden>·</span>
            <span>{DEVICE_LABEL[appearance.device]}</span>
            <span aria-hidden className="hidden sm:inline">
              ·
            </span>
            <span className="hidden capitalize sm:inline">
              {appearance.theme} theme
            </span>
            <span className="ml-auto hidden lg:inline">
              Drag to pan · ⌘/Ctrl + scroll to zoom
            </span>
          </footer>
        </>
      ) : (
        <JsonView json={json} />
      )}
    </div>
  );
};

/**
 * Everything the canvas's scroll container does beyond scrolling: panning,
 * zoom gestures, and holding your place across a zoom change.
 *
 * All of it is wired imperatively inside effects rather than through React
 * props and state. Panning writes `scrollLeft`/`scrollTop` many times a
 * second and the drag cursor is a `data-` attribute, so none of it needs to
 * re-render the canvas — and the wheel listener has to be non-passive, which
 * `onWheel` cannot express.
 *
 * @param node - The scroll container, held as state by the caller so this
 * re-runs when it mounts.
 * @param enabled - False while the canvas is showing JSON instead of a stage.
 */
const useCanvasViewport = (
  node: HTMLDivElement | null,
  enabled: boolean,
  zoom: number,
  setZoom: React.Dispatch<React.SetStateAction<number>>
) => {
  /*
   * Zooming reflows the previews into a different number of columns, so
   * there is no single point to pin — holding the scroll position as a
   * fraction of the whole is the honest approximation, and it beats being
   * thrown back to the top on every notch of the wheel.
   */
  const anchor = useRef(0);
  // Written to after the zoom relayout. Held as a ref because that is the
  // channel React sanctions for imperative DOM writes.
  const scroller = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!node || !enabled) return;
    scroller.current = node;

    /* ---------------------------- panning ---------------------------- */

    let origin: { x: number; y: number; left: number; top: number } | null =
      null;

    // Previews are inert decoration rather than real UI, so the whole surface
    // can be a drag handle the way a design tool's canvas is. Touch is left
    // alone: a finger already pans natively, with momentum this cannot match.
    const onPointerDown = (event: PointerEvent) => {
      // Left button only: the middle button is the browser's own autoscroll,
      // and taking it over halfway is worse than leaving it alone.
      if (event.pointerType !== "mouse" || event.button !== 0) return;

      origin = {
        x: event.clientX,
        y: event.clientY,
        left: node.scrollLeft,
        top: node.scrollTop,
      };
      node.setPointerCapture(event.pointerId);
      node.dataset.panning = "true";
      // Stops the drag becoming a text selection across the previews.
      event.preventDefault();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!origin) return;
      node.scrollLeft = origin.left - (event.clientX - origin.x);
      node.scrollTop = origin.top - (event.clientY - origin.y);
    };

    const endPan = (event: PointerEvent) => {
      if (!origin) return;
      origin = null;
      delete node.dataset.panning;
      node.releasePointerCapture(event.pointerId);
    };

    /* ----------------------------- zoom ------------------------------ */

    let hovered = false;
    const enter = () => {
      hovered = true;
    };
    const leave = () => {
      hovered = false;
    };

    const remember = () => {
      const scrollable = node.scrollHeight - node.clientHeight;
      anchor.current = scrollable > 0 ? node.scrollTop / scrollable : 0;
    };

    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      remember();
      setZoom((current) => zoomByWheel(current, event.deltaY));
    };

    /*
     * ⌘/Ctrl with `+`, `-` or `0` zooms the *canvas*, but only while the
     * pointer is over it or something inside it has focus. Everywhere else
     * those shortcuts still belong to the browser, which is what someone
     * reaching for them outside the canvas means.
     */
    const onKeyDown = (event: KeyboardEvent) => {
      if (!hovered && !node.contains(document.activeElement)) return;
      if (!event.ctrlKey && !event.metaKey) return;
      // `=` and `-` are the unshifted keys behind `+` and `_`.
      if (!["+", "=", "-", "_", "0"].includes(event.key)) return;

      event.preventDefault();
      remember();
      setZoom((current) =>
        event.key === "0"
          ? 1
          : stepZoom(current, event.key === "-" || event.key === "_" ? -1 : 1)
      );
    };

    node.addEventListener("pointerdown", onPointerDown);
    node.addEventListener("pointermove", onPointerMove);
    node.addEventListener("pointerup", endPan);
    node.addEventListener("pointercancel", endPan);
    node.addEventListener("pointerenter", enter);
    node.addEventListener("pointerleave", leave);
    node.addEventListener("scroll", remember, { passive: true });
    // A passive listener cannot cancel the browser's own zoom.
    node.addEventListener("wheel", onWheel, { passive: false });
    document.addEventListener("keydown", onKeyDown);

    return () => {
      node.removeEventListener("pointerdown", onPointerDown);
      node.removeEventListener("pointermove", onPointerMove);
      node.removeEventListener("pointerup", endPan);
      node.removeEventListener("pointercancel", endPan);
      node.removeEventListener("pointerenter", enter);
      node.removeEventListener("pointerleave", leave);
      node.removeEventListener("scroll", remember);
      node.removeEventListener("wheel", onWheel);
      document.removeEventListener("keydown", onKeyDown);
      scroller.current = null;
    };
  }, [node, enabled, setZoom]);

  // Restore the anchored position once the new zoom has been laid out.
  useLayoutEffect(() => {
    const element = scroller.current;
    if (!element || anchor.current === 0) return;

    const scrollable = element.scrollHeight - element.clientHeight;
    if (scrollable > 0) element.scrollTop = anchor.current * scrollable;
  }, [zoom]);
};

/**
 * Read-only view of the workspace content.
 *
 * Line numbers are `aria-hidden` and sit in a sticky gutter, so they stay put
 * while a long line scrolls horizontally and are skipped by screen readers
 * reading the JSON.
 */
const JsonView = ({ json }: { json: string }) => {
  const lines = useMemo(() => json.split("\n"), [json]);

  return (
    <div className="scroll-region min-h-0 flex-1 overflow-auto p-4">
      <pre className="w-fit min-w-full rounded-xl border border-border bg-surface py-3 font-code text-xs leading-[1.65] shadow-xs">
        <code>
          {lines.map((line, index) => (
            <span key={index} className="flex">
              <span
                aria-hidden
                className="sticky left-0 w-12 shrink-0 select-none bg-surface pr-3 text-right tabular-nums text-faint/60"
              >
                {index + 1}
              </span>
              <span className="whitespace-pre pr-4">{line || " "}</span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
};
