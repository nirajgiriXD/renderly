/**
 * External dependencies.
 */
import { useState } from "react";
import { Check, Copy } from "lucide-react";

/**
 * Internal dependencies.
 */
import { PreviewStage } from "@/features/preview/PreviewStage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useClipboard } from "@/hooks";
import { stripDataUrls } from "@/lib/storage";
import { useConfig, useWorkspace } from "@/store";

type View = "preview" | "json";

/**
 * The right half of the workspace: the rendered stage, or the underlying JSON.
 */
export const PreviewPanel = ({
  stageRef,
  className,
}: {
  stageRef: React.Ref<HTMLDivElement>;
  className?: string;
}) => {
  const [view, setView] = useState<View>("preview");
  const { category } = useWorkspace();
  const config = useConfig();
  const { copied, copy } = useClipboard();

  const json = JSON.stringify(stripDataUrls(config[category]), null, 2);

  return (
    <div className={cn("flex h-full flex-col bg-muted/40", className)}>
      <div className="flex items-center justify-between gap-3 border-b bg-background/60 px-4 py-2.5">
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {(["preview", "json"] as const).map((entry) => (
            <button
              key={entry}
              type="button"
              aria-current={view === entry ? "true" : undefined}
              onClick={() => setView(entry)}
              className={cn(
                "cursor-pointer rounded-md px-3 py-1 text-sm font-medium capitalize transition-all",
                view === entry
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {entry}
            </button>
          ))}
        </div>

        {view === "json" && (
          <Button size="sm" variant="ghost" onClick={() => void copy(json)}>
            {copied ? <Check /> : <Copy />}
            {copied ? "Copied" : "Copy"}
          </Button>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {view === "preview" ? (
          <div
            ref={stageRef}
            className="flex min-h-full justify-center bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] p-6 [background-size:18px_18px]"
          >
            <PreviewStage category={category} config={config} className="w-full" />
          </div>
        ) : (
          <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
            <code>{json}</code>
          </pre>
        )}
      </div>
    </div>
  );
};
