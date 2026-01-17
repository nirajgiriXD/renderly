/**
 * External dependencies.
 */
import { useRef } from "react";

/**
 * Internal dependencies.
 */
import {
  ResizablePanel,
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfigSection, PreviewSection } from "@/components";
import { GitHub } from "@/icons";
import { CATEGORIES, TABS } from "@/constants";
import { useWindowWidth, useStore } from "@/hooks";

export const App = () => {
  const previewRef = useRef<HTMLDivElement>(null);

  const { isMobile } = useWindowWidth();

  const { categoryTab, handleCategoryTabChange } = useStore();

  return (
    <div className="w-full h-screen p-4 md:p-8 bg-gray-200 text-sm">
      <div
        className={`rounded-xl shadow-sm h-full w-full bg-white ${
          isMobile ? "overflow-scroll" : "overflow-hidden"
        }`}
      >
        <Tabs
          defaultValue={categoryTab}
          className="gap-0"
          onValueChange={(value) =>
            handleCategoryTabChange(value as keyof typeof TABS)
          }
        >
          {/* Header */}
          <div className="p-4 sm:p-6 flex items-center flex-wrap justify-between gap-2">
            <TabsList className="flex items-center gap-2 p-1 overflow-x-auto w-fit">
              {CATEGORIES.map((category) => (
                <TabsTrigger
                  key={`category-${category.value}`}
                  value={category.value}
                  className="cursor-pointer"
                >
                  <category.icon />
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <div>
              <Button size="sm" variant="outline" asChild>
                <a
                  target="_blank"
                  rel="noreferrer noopener"
                  href="https://github.com/nirajgiriXD/post-preview"
                  className="text-sm flex items-center gap-2"
                >
                  <img src={GitHub} alt="GitHub" className="size-5" />
                  View on GitHub
                </a>
              </Button>
            </div>
          </div>

          {isMobile ? (
            <div className="flex flex-col h-full w-full">
              {/* Config Section */}
              <ConfigSection />

              {/* Preview Section */}
              <div ref={previewRef} className="h-full">
                <PreviewSection />
              </div>
            </div>
          ) : (
            <ResizablePanelGroup
              className="h-full w-full"
              direction="horizontal"
            >
              {/* Config Section */}
              <ResizablePanel defaultSize={50} minSize={30}>
                <ConfigSection />
              </ResizablePanel>

              {/* Resizable Handle */}
              <ResizableHandle withHandle />

              {/* Preview Section */}
              <ResizablePanel defaultSize={50} minSize={30}>
                <div ref={previewRef} className="h-full">
                  <PreviewSection />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          )}
        </Tabs>
      </div>
    </div>
  );
};
