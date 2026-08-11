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
import { EmptyState } from "@/components/common/EmptyState";
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
      <div className={cn("flex min-h-72 items-center justify-center", className)}>
        <EmptyState
          icon={LayoutGrid}
          title="Nothing to preview yet"
          description={`Choose a platform in the ${
            category === "ai-chats" ? "Assistants" : "Platforms"
          } section to see how this content will look.`}
          className="w-full max-w-sm bg-surface/70 backdrop-blur-sm"
        />
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
          <div
            key={platform}
            className="flex w-full max-w-md flex-col items-center"
          >
            <ErrorBoundary label={`The ${meta.label} preview`} resetKey={platform}>
              <DeviceFrame
                device={appearance.device}
                theme={appearance.theme}
                enabled={appearance.showDeviceFrame}
                url={`${platform === "twitter" ? "x" : platform}.com`}
              >
                {/*
                  The gutter is the feed a card would sit on — part of the
                  device simulation, not of the post. With the frame off the
                  card is the whole picture, so the gutter goes with it. A
                  full-screen preview keeps its surface either way: that one
                  is the app's own background, not a backdrop behind it.
                */}
                <div
                  className={cn(
                    "flex justify-center",
                    FILLS_SCREEN[category]
                      ? "bg-[var(--frame-surface)]"
                      : appearance.showDeviceFrame &&
                        "bg-[var(--frame-gutter)] p-3"
                  )}
                >
                  {renderPreview(category, platform, config)}
                </div>
              </DeviceFrame>
            </ErrorBoundary>
          </div>
        );
      })}
    </div>
  );
};
