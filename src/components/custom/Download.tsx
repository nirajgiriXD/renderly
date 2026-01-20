/**
 * External dependencies.
 */
import { DownloadIcon } from "lucide-react";

/**
 * Internal dependencies.
 */
import { Button } from "@/components/ui/button";

export const Download = () => {
  return (
    <div className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-50 rounded-full h-10 w-10 bg-primary">
      <Button variant="ghost" className="text-white h-full w-full">
        <DownloadIcon className="size-5" />
      </Button>
    </div>
  );
};
