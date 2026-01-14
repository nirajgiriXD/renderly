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
import { ConfigSection, PreviewSection } from "@/components";
import { useWindowWidth } from "@/hooks";

export const App = () => {
  const previewRef = useRef<HTMLDivElement>(null);

  const { isMobile } = useWindowWidth();

  return (
    <div className="w-full h-screen p-4 md:p-8 bg-gray-200">
      <div className={`rounded-xl shadow-sm h-full w-full bg-white ${isMobile ? '' : 'overflow-hidden'}`}>
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
          <ResizablePanelGroup className="h-full" direction="horizontal">
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
      </div>
    </div>
  );
};
