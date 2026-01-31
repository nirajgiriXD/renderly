/**
 * External dependencies.
 */
import { useState, type ChangeEvent } from "react";
import { Calendar, Clock, X } from "lucide-react";

/**
 * Internal dependencies.
 */
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const DateTimePicker = ({
  value,
  onChange,
  placeholder = "Select date and time",
  disabled = false,
  className,
}: DateTimePickerProps) => {
  function formatTime(date: Date): string {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);
  const [timeInput, setTimeInput] = useState<string>(
    value ? formatTime(value) : "12:00"
  );
  const [isOpen, setIsOpen] = useState(false);

  function formatDisplay(date: Date | undefined): string {
    if (!date) return placeholder;

    const dateStr = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${dateStr} • ${timeStr}`;
  }

  function handleDateSelect(date: Date | undefined) {
    if (!date) return;

    const [hours, minutes] = timeInput.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);

    setSelectedDate(newDate);
    onChange?.(newDate);
  }

  function handleTimeChange(e: ChangeEvent<HTMLInputElement>) {
    const newTime = e.target.value;
    setTimeInput(newTime);

    if (selectedDate && newTime) {
      const [hours, minutes] = newTime.split(":").map(Number);
      const updatedDate = new Date(selectedDate);
      updatedDate.setHours(hours, minutes, 0, 0);

      setSelectedDate(updatedDate);
      onChange?.(updatedDate);
    }
  }

  function handleClear(e: React.MouseEvent<SVGSVGElement>) {
    e.preventDefault();
    setSelectedDate(undefined);
    setTimeInput("12:00");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange?.(undefined as any);
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-between pr-3",
            !selectedDate && "text-muted-foreground",
            className
          )}
        >
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {formatDisplay(selectedDate)}
          </span>
          {selectedDate && (
            <X className="h-4 w-4 opacity-50" onClick={handleClear} />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col">
          {/* Calendar Section */}
          <div className="border-b py-2 px-4">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={disabled}
              classNames={{
                month: "space-y-2",
                day: "h-6 w-8",
              }}
              className="p-0"
            />
          </div>

          {/* Time Input Section */}
          <div className="flex items-center gap-3 py-2 px-4">
            <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
            <Input
              type="time"
              value={timeInput}
              onChange={handleTimeChange}
              disabled={disabled}
              className="h-9 flex-1"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 border-t py-2 px-4">
            <Button
              size="sm"
              variant="ghost"
              className="flex-1"
              onClick={() => {
                setSelectedDate(undefined);
                setTimeInput("12:00");
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange?.(undefined as any);
                setIsOpen(false);
              }}
              disabled={!selectedDate || disabled}
            >
              Clear
            </Button>
            <Button
              size="sm"
              className="flex-1 cursor-pointer"
              onClick={() => setIsOpen(false)}
              disabled={!selectedDate || disabled}
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
