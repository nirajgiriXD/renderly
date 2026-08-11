/**
 * External dependencies.
 */
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";

/**
 * Internal dependencies.
 */
import { PlatformSection } from "./sections/PlatformSection";
import { AiConversationSection } from "./sections/ai-chats";
import {
  CommentPeopleSection,
  CommentThreadSection,
} from "./sections/comments";
import {
  MessageConversationSection,
  MessagePeopleSection,
} from "./sections/messages";
import {
  PostAuthorSection,
  PostContentSection,
  PostMetricsSection,
} from "./sections/posts";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";
import { CATEGORY_MAP, sectionsFor } from "@/constants";
import { cn } from "@/lib/utils";
import { useConfigActions, useWorkspace } from "@/store";
import type { CategoryId } from "@/types";

/**
 * Which component owns each `category/section` pair.
 *
 * `apps` is a shared implementation; everything else is specific to the
 * content type.
 */
const renderSection = (category: CategoryId, section: string) => {
  if (section === "apps") return <PlatformSection category={category} />;

  switch (`${category}/${section}`) {
    case "posts/author":
      return <PostAuthorSection />;
    case "posts/content":
      return <PostContentSection />;
    case "posts/metrics":
      return <PostMetricsSection />;
    case "comments/users":
      return <CommentPeopleSection />;
    case "comments/thread":
      return <CommentThreadSection />;
    case "messages/users":
      return <MessagePeopleSection />;
    case "messages/conversation":
      return <MessageConversationSection />;
    case "ai-chats/conversation":
      return <AiConversationSection />;
    default:
      return null;
  }
};

/**
 * The editing half of the workspace.
 *
 * A container query rather than a viewport one: this panel is resizable, so
 * how much room it has is a fact about the panel, not about the screen.
 */
export const ConfigPanel = ({ className }: { className?: string }) => {
  const { category, section, setSection } = useWorkspace();
  const { resetCategory } = useConfigActions();

  const descriptor = CATEGORY_MAP[category];
  const sections = sectionsFor(category);
  const active = sections.find((entry) => entry.id === section) ?? sections[0];

  return (
    <div
      className={cn("@container flex h-full flex-col bg-background", className)}
    >
      <div className="shrink-0 border-b border-border bg-surface px-3 py-2.5 @lg:px-4">
        {/* Held to a comfortable measure so a wide inspector does not stretch
            the form into an unreadable line length. */}
        <Segmented
          className="mx-auto w-full max-w-2xl"
          label={`${descriptor.label} sections`}
          value={active.id}
          onChange={setSection}
          options={sections.map((entry) => ({
            value: entry.id,
            label: entry.label,
            hint: entry.summary,
          }))}
        />
      </div>

      <div className="scroll-region min-h-0 flex-1 overflow-y-auto">
        <header className="mx-auto flex w-full max-w-2xl items-start justify-between gap-3 px-4 pb-4 pt-5 @lg:px-5">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-[0.6875rem] font-medium uppercase tracking-widest text-faint">
              <descriptor.icon className="size-3" aria-hidden />
              {descriptor.label}
            </p>
            <h2 className="mt-1.5 text-lg leading-tight">{active.label}</h2>
            <p className="mt-1 text-pretty text-[0.8125rem] leading-relaxed text-muted-foreground">
              {active.summary}
            </p>
          </div>

          <ConfirmDialog
            title={`Reset ${descriptor.label.toLowerCase()}?`}
            description={`Everything you have written under ${descriptor.label} will be replaced by the example content Post Preview ships with. Other categories are untouched.`}
            confirmLabel="Reset"
            onConfirm={() => {
              resetCategory(category);
              toast.success(
                `${descriptor.label} reset to the example content.`
              );
            }}
            tooltip={`Reset ${descriptor.label.toLowerCase()}`}
            trigger={
              <Button
                size="icon-sm"
                variant="ghost"
                aria-label={`Reset ${descriptor.label}`}
                className="shrink-0"
              >
                <RotateCcw />
              </Button>
            }
          />
        </header>

        <div
          key={`${category}/${active.id}`}
          className="animate-rise mx-auto w-full max-w-2xl px-4 pb-16 @lg:px-5"
        >
          <ErrorBoundary
            label={`The ${active.label} form`}
            resetKey={`${category}/${active.id}`}
          >
            {renderSection(category, active.id)}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};
