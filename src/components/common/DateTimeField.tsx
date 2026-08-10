/**
 * External dependencies.
 */
import { useId, useState } from "react";
import { CalendarIcon, X } from "lucide-react";

/**
 * Internal dependencies.
 */
import { Field } from "./fields";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { formatAbsoluteDate } from "@/lib/format";

const toTimeValue = (date: Date) =>
  `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

/**
 * Date + time picker bound to an ISO string.
 *
 * An empty value means "now", which is what every preview falls back to, so
 * clearing the field is a first-class action rather than an error state.
 */
export const DateTimeField = ({
  label,
  hint,
  value,
  onChange,
  className,
}: {
  label: React.ReactNode;
  hint?: React.ReactNode;
  /** ISO timestamp, or an empty string for "now". */
  value: string;
  onChange: (iso: string) => void;
  className?: string;
}) => {
  const id = useId();
  const [open, setOpen] = useState(false);

  const parsed = value ? new Date(value) : null;
  const selected = parsed && !Number.isNaN(parsed.getTime()) ? parsed : null;

  const commit = (next: Date) => onChange(next.toISOString());

  return (
    <Field label={label} hint={hint} htmlFor={id} className={className}>
      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id={id}
              type="button"
              variant="outline"
              className={cn(
                "min-w-0 flex-1 justify-start font-normal",
                !selected && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              <span className="truncate">
                {selected ? formatAbsoluteDate(selected) : "Now"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto overflow-hidden p-0">
            <Calendar
              mode="single"
              autoFocus
              captionLayout="dropdown"
              selected={selected ?? undefined}
              onSelect={(date) => {
                if (!date) return;
                const next = new Date(date);
                // Keep the time of day the user already chose.
                if (selected) {
                  next.setHours(selected.getHours(), selected.getMinutes());
                }
                commit(next);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>

        <Input
          type="time"
          aria-label="Time"
          className="w-30"
          value={selected ? toTimeValue(selected) : ""}
          onChange={(event) => {
            const [hours, minutes] = event.target.value.split(":").map(Number);
            if (Number.isNaN(hours) || Number.isNaN(minutes)) return;
            const next = new Date(selected ?? Date.now());
            next.setHours(hours, minutes, 0, 0);
            commit(next);
          }}
        />

        {selected && (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="Reset to now"
            onClick={() => onChange("")}
          >
            <X />
          </Button>
        )}
      </div>
    </Field>
  );
};
