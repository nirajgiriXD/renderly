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
    <Button size="sm" variant="outline" className="cursor-pointer">
      <DownloadIcon className="size-5" />
      Download
    </Button>
  );
};
