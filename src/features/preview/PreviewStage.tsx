/**
 * External dependencies.
 */
import { useMemo } from "react";
import type { ReactNode } from "react";
import { LayoutGrid } from "lucide-react";

/**
 * Internal dependencies.
 */
import { DeviceFrame } from "./primitives";
import {
  AI_CHAT_PREVIEWS,
  COMMENT_PREVIEWS,
  MESSAGE_PREVIEWS,
  POST_PREVIEWS,
} from "./registry";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { PLATFORMS_BY_CATEGORY, platformMeta } from "@/constants";
import { cn } from "@/lib/utils";
import type { AnyPlatform, AppConfig, CategoryId } from "@/types";

/**
 * Message and assistant previews are whole app screens, so they run edge to
 * edge inside the frame. Posts and comment threads are cards that sit on a
 * feed, so they keep a gutter around them.
 */
const FILLS_SCREEN: Record<CategoryId, boolean> = {
  posts: false,
  comments: false,
  messages: true,
  "ai-chats": true,
};

/**
 * Builds the preview element for one platform.
 *
 * The category discriminates which registry and which slice of the config
 * apply, keeping the `any`-free mapping in exactly one place.
 */
const renderPreview = (
  category: CategoryId,
  platform: AnyPlatform,
  config: AppConfig
): ReactNode => {
  switch (category) {
    case "posts": {
      const Preview = POST_PREVIEWS[platform as keyof typeof POST_PREVIEWS];
      return Preview ? <Preview data={config.posts} /> : null;
    }
    case "comments": {
      const Preview =
        COMMENT_PREVIEWS[platform as keyof typeof COMMENT_PREVIEWS];
      return Preview ? <Preview data={config.comments} /> : null;
    }
    case "messages": {
      const Preview =
        MESSAGE_PREVIEWS[platform as keyof typeof MESSAGE_PREVIEWS];
      return Preview ? <Preview data={config.messages} /> : null;
    }
    default: {
      const Preview =
        AI_CHAT_PREVIEWS[platform as keyof typeof AI_CHAT_PREVIEWS];
      return Preview ? <Preview data={config["ai-chats"]} /> : null;
    }
  }
};

type PreviewStageProps = {
  category: CategoryId;
  config: AppConfig;
  className?: string;
};

/**
 * Renders every selected platform for the active category, each in its own
 * device frame.
 */
export const PreviewStage = ({
  category,
  config,
  className,
}: PreviewStageProps) => {
  const appearance = config[category].appearance;

  // Render in the category's canonical order rather than selection order, so
  // toggling a platform off and on again does not reshuffle the stage.
  const selected = useMemo(() => {
    const chosen = new Set<string>(config[category].apps.selected);
    return PLATFORMS_BY_CATEGORY[category].filter((platform) =>
      chosen.has(platform)
    ) as AnyPlatform[];
  }, [category, config]);

  if (selected.length === 0) {
    return (
      <div
        className={cn(
          "flex min-h-72 flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-10 text-center",
          className
        )}
      >
        <LayoutGrid className="size-6 text-muted-foreground" aria-hidden />
        <div>
          <p className="text-sm font-medium">No platform selected</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick one or more platforms to see how this content will look.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-center gap-x-8 gap-y-10",
        className
      )}
    >
      {selected.map((platform) => {
        const meta = platformMeta(platform);

        return (
          <figure
            key={platform}
            className="flex w-full max-w-md flex-col items-center gap-3"
          >
            <ErrorBoundary label={`The ${meta.label} preview`} resetKey={platform}>
              <DeviceFrame
                device={appearance.device}
                theme={appearance.theme}
                enabled={appearance.showDeviceFrame}
                url={`${platform === "twitter" ? "x" : platform}.com`}
              >
                <div
                  className={cn(
                    "flex justify-center",
                    FILLS_SCREEN[category]
                      ? "bg-[var(--frame-surface)]"
                      : "bg-[var(--frame-gutter)] p-3"
                  )}
                >
                  {renderPreview(category, platform, config)}
                </div>
              </DeviceFrame>
            </ErrorBoundary>

            <figcaption
              data-export-ignore
              className="flex items-center gap-2 text-xs font-medium text-muted-foreground"
            >
              <img
                src={meta.logo}
                alt=""
                className="size-3.5 dark:brightness-0 dark:invert"
              />
              {meta.label}
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
};
