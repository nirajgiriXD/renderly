/**
 * External dependencies.
 */
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";

/**
 * Internal dependencies.
 */
import { AppearanceSection } from "./sections/AppearanceSection";
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
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { CATEGORY_MAP, sectionsFor } from "@/constants";
import { cn } from "@/lib/utils";
import { useConfigActions, useWorkspace } from "@/store";
import type { CategoryId } from "@/types";

/**
 * Which component owns each `category/section` pair.
 *
 * `apps` and `appearance` are shared implementations; everything else is
 * specific to the content type.
 */
const renderSection = (category: CategoryId, section: string) => {
  if (section === "apps") return <PlatformSection category={category} />;
  if (section === "appearance") return <AppearanceSection category={category} />;

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
 * The editing half of the workspace: a section rail plus the active form.
 */
export const ConfigPanel = ({ className }: { className?: string }) => {
  const { category, section, setSection } = useWorkspace();
  const { resetCategory } = useConfigActions();

  const descriptor = CATEGORY_MAP[category];
  const sections = sectionsFor(category);
  const active = sections.find((entry) => entry.id === section) ?? sections[0];

  return (
    <div className={cn("@container flex h-full flex-col", className)}>
      <div className="flex items-start justify-between gap-3 px-4 pt-4 @lg:px-6">
        <div className="min-w-0">
          <h2 className="text-base font-semibold">{descriptor.label}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {descriptor.description}
          </p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="shrink-0"
          onClick={() => {
            resetCategory(category);
            toast.success(`${descriptor.label} reset to the example content.`);
          }}
        >
          <RotateCcw />
          Reset
        </Button>
      </div>

      <nav
        aria-label={`${descriptor.label} sections`}
        className="mt-4 overflow-x-auto px-4 @lg:px-6"
      >
        <div className="flex w-max gap-1 rounded-lg bg-muted p-1">
          {sections.map((entry) => {
            const selected = entry.id === active.id;
            return (
              <button
                key={entry.id}
                type="button"
                aria-current={selected ? "page" : undefined}
                onClick={() => setSection(entry.id)}
                className={cn(
                  "flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                  selected
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <entry.icon className="size-4" aria-hidden />
                {entry.label}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 @lg:px-6">
        <ErrorBoundary
          label={`The ${active.label} form`}
          resetKey={`${category}/${active.id}`}
        >
          {renderSection(category, active.id)}
        </ErrorBoundary>
      </div>
    </div>
  );
};
