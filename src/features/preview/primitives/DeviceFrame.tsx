/**
 * External dependencies.
 */
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Lock, RotateCw } from "lucide-react";

/**
 * Internal dependencies.
 */
import { cn } from "@/lib/utils";
import type { PreviewDevice, PreviewTheme } from "@/types";

/** Handset widths the mobile previews are laid out against. */
const DEVICE_WIDTH: Record<PreviewDevice, number> = {
  ios: 390,
  android: 412,
  web: 720,
};

const useClock = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const SignalIcons = ({ className }: { className?: string }) => (
  <span className={cn("flex items-center gap-1.5", className)}>
    <svg viewBox="0 0 18 12" className="h-3 w-4.5 fill-current" aria-hidden>
      <rect x="0" y="8" width="3" height="4" rx="1" />
      <rect x="4.5" y="5.5" width="3" height="6.5" rx="1" />
      <rect x="9" y="3" width="3" height="9" rx="1" />
      <rect x="13.5" y="0" width="3" height="12" rx="1" opacity=".4" />
    </svg>
    <svg viewBox="0 0 16 12" className="h-3 w-4 fill-current" aria-hidden>
      <path d="M8 11.2 5.9 8.9a3 3 0 0 1 4.2 0L8 11.2Zm-4-4.3L2.6 5.4a7.7 7.7 0 0 1 10.8 0L12 6.9a5.6 5.6 0 0 0-8 0ZM.6 3.3a10.6 10.6 0 0 1 14.8 0L14 4.9a8.4 8.4 0 0 0-12 0L.6 3.3Z" />
    </svg>
    <svg viewBox="0 0 26 12" className="h-3 w-6.5" aria-hidden>
      <rect
        x="0.5"
        y="0.5"
        width="21"
        height="11"
        rx="3"
        className="fill-none stroke-current opacity-40"
      />
      <rect x="2" y="2" width="14" height="8" rx="1.5" className="fill-current" />
      <path
        d="M23 4v4a2.4 2.4 0 0 0 0-4Z"
        className="fill-current opacity-40"
      />
    </svg>
  </span>
);

type DeviceFrameProps = {
  device: PreviewDevice;
  theme: PreviewTheme;
  /** When false the children render bare, without any chrome. */
  enabled?: boolean;
  /** Shown in the browser address bar. */
  url?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Draws phone or browser chrome around a preview.
 *
 * The frame is what turns "a card on a page" into "how this looks on a
 * phone" — status bar, safe areas and all — and it is captured by the PNG
 * export exactly as shown.
 */
export const DeviceFrame = ({
  device,
  theme,
  enabled = true,
  url = "example.com",
  className,
  children,
}: DeviceFrameProps) => {
  const clock = useClock();
  const dark = theme === "dark";

  /*
   * The frame sits outside any `PreviewSurface`, so it cannot read the
   * platform palette. It publishes its own pair instead: `surface` for the
   * screen itself (status bar, home indicator) and `gutter` for the feed
   * background a card preview floats on.
   */
  const frameVars = {
    "--frame-surface": dark ? "#000000" : "#ffffff",
    "--frame-gutter": dark ? "#18191a" : "#f0f2f5",
    "--frame-fg": dark ? "#e9e9ea" : "#111111",
  } as React.CSSProperties;

  if (!enabled) {
    return (
      <div
        className={cn("w-full", className)}
        style={{ maxWidth: DEVICE_WIDTH[device], ...frameVars }}
      >
        {children}
      </div>
    );
  }

  if (device === "web") {
    return (
      <div
        className={cn(
          "w-full overflow-hidden rounded-xl border shadow-xl",
          dark ? "border-white/10 bg-[#1f1f1f]" : "border-black/10 bg-[#f1f3f4]",
          className
        )}
        style={{ maxWidth: DEVICE_WIDTH.web, ...frameVars }}
      >
        <div className="flex items-center gap-3 px-3 py-2.5">
          <span className="flex gap-1.5">
            <span className="size-3 rounded-full bg-[#ff5f57]" />
            <span className="size-3 rounded-full bg-[#febc2e]" />
            <span className="size-3 rounded-full bg-[#28c840]" />
          </span>
          <div
            className={cn(
              "flex min-w-0 flex-1 items-center gap-2 rounded-full px-3 py-1 text-[11px]",
              dark ? "bg-white/10 text-white/70" : "bg-white text-black/60"
            )}
          >
            <Lock className="size-3 shrink-0" aria-hidden />
            <span className="truncate">{url}</span>
            <RotateCw className="ml-auto size-3 shrink-0 opacity-60" aria-hidden />
          </div>
        </div>
        <div className="overflow-hidden bg-[var(--frame-surface)]">{children}</div>
      </div>
    );
  }

  const isIos = device === "ios";

  return (
    <div
      className={cn(
        "relative w-full shrink-0 shadow-2xl",
        isIos
          ? "rounded-[2.75rem] bg-[#1c1c1e] p-[10px] ring-1 ring-white/10"
          : "rounded-[1.75rem] bg-[#202124] p-[8px] ring-1 ring-white/10",
        className
      )}
      style={{
        maxWidth: DEVICE_WIDTH[device] + (isIos ? 20 : 16),
        ...frameVars,
      }}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-[var(--frame-surface)]",
          isIos ? "rounded-[2.15rem]" : "rounded-[1.25rem]"
        )}
      >
        {/* Status bar */}
        <div
          className={cn(
            "relative z-20 flex items-center justify-between px-6 text-[13px] font-semibold text-[var(--frame-fg)]",
            isIos ? "h-12 pt-2" : "h-8"
          )}
        >
          <span className={cn("tabular-nums", !isIos && "text-xs font-medium")}>
            {clock}
          </span>

          {isIos ? (
            <span className="absolute left-1/2 top-2.5 h-[26px] w-[92px] -translate-x-1/2 rounded-full bg-black" />
          ) : (
            <span className="absolute left-1/2 top-2 size-3 -translate-x-1/2 rounded-full bg-black" />
          )}

          <SignalIcons className={cn(!isIos && "scale-90")} />
        </div>

        <div className="relative">{children}</div>

        {/* Home indicator / gesture bar */}
        <div className="flex h-5 items-center justify-center bg-[var(--frame-surface)]">
          <span
            className={cn(
              "rounded-full bg-[var(--frame-fg)] opacity-30",
              isIos ? "h-[5px] w-[134px]" : "h-[3px] w-[108px]"
            )}
          />
        </div>
      </div>
    </div>
  );
};
