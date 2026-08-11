/**
 * External dependencies.
 */
import { useState } from "react";
import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

/**
 * Internal dependencies.
 */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Hint } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/**
 * Are-you-sure gate for actions that throw work away.
 *
 * Resetting or clearing every field is one click from a toast that says it
 * happened and no way back, so those two get a stop between the intent and
 * the consequence. Non-destructive actions must not use this.
 */
export const ConfirmDialog = ({
  trigger,
  tooltip,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "destructive",
  onConfirm,
}: {
  trigger: ReactNode;
  /**
   * Tooltip for an icon-only trigger. Applied here rather than by the caller
   * because the tooltip has to wrap the dialog trigger, not the other way
   * round — `asChild` can only forward props to a DOM-backed element.
   */
  tooltip?: string;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "destructive" | "default";
  onConfirm: () => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Hint label={tooltip ?? ""}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      </Hint>

      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogBody className="flex gap-4 pt-6">
          <span
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-full",
              tone === "destructive"
                ? "bg-destructive-soft text-destructive"
                : "bg-brand-soft text-brand-text"
            )}
          >
            <AlertTriangle className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 space-y-1.5">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </div>
        </DialogBody>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              {cancelLabel}
            </Button>
          </DialogClose>
          <Button
            size="sm"
            variant={tone === "destructive" ? "destructive" : "default"}
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
