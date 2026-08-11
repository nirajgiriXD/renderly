/**
 * External dependencies.
 */
import { useId } from "react";
import type { ReactNode } from "react";

/**
 * Internal dependencies.
 */
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Segmented } from "@/components/ui/segmented";
import type { SegmentedOption } from "@/components/ui/segmented";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toCount } from "@/lib/format";

/**
 * Label + control + optional hint.
 *
 * Every input in the inspector goes through this so spacing, label
 * association and hint typography stay identical across four categories of
 * settings. The hint sits *under* the control on purpose: it explains the
 * consequence of a value, which is only interesting once you are looking at
 * the value.
 */
export const Field = ({
  label,
  hint,
  htmlFor,
  className,
  children,
}: {
  label: ReactNode;
  hint?: ReactNode;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
}) => (
  <div className={cn("space-y-1.5", className)}>
    <Label htmlFor={htmlFor} className="w-fit">
      {label}
    </Label>
    {children}
    {hint && (
      <p className="text-pretty text-xs leading-relaxed text-muted-foreground">
        {hint}
      </p>
    )}
  </div>
);

export const TextField = ({
  label,
  hint,
  value,
  onChange,
  placeholder,
  className,
  prefix,
}: {
  label: ReactNode;
  hint?: ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  /** Static affix rendered inside the control, e.g. `@` or `r/`. */
  prefix?: string;
}) => {
  const id = useId();

  return (
    <Field label={label} hint={hint} htmlFor={id} className={className}>
      <div className="relative">
        {prefix && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm font-medium text-faint"
          >
            {prefix}
          </span>
        )}
        <Input
          id={id}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          style={
            prefix
              ? { paddingLeft: `calc(0.95rem + ${prefix.length}ch)` }
              : undefined
          }
        />
      </div>
    </Field>
  );
};

export const TextAreaField = ({
  label,
  hint,
  value,
  onChange,
  placeholder,
  rows = 4,
  className,
}: {
  label: ReactNode;
  hint?: ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}) => {
  const id = useId();

  return (
    <Field label={label} hint={hint} htmlFor={id} className={className}>
      <Textarea
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="resize-y"
      />
    </Field>
  );
};

/**
 * Numeric input that keeps the stored value a clamped integer.
 *
 * Typing into a number input yields a string, and clearing it yields `""` —
 * both of which would poison a `number` field, so parsing happens here rather
 * than at each of the dozen call sites.
 */
export const NumberField = ({
  label,
  hint,
  value,
  onChange,
  placeholder,
  className,
}: {
  label: ReactNode;
  hint?: ReactNode;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
}) => {
  const id = useId();

  return (
    <Field label={label} hint={hint} htmlFor={id} className={className}>
      <Input
        id={id}
        type="number"
        min={0}
        inputMode="numeric"
        value={Number.isFinite(value) ? value : 0}
        placeholder={placeholder}
        onChange={(event) => onChange(toCount(event.target.value))}
        className="tabular-nums"
      />
    </Field>
  );
};

export type Option<T extends string> = { label: string; value: T };

export const SelectField = <T extends string>({
  label,
  hint,
  value,
  options,
  onChange,
  placeholder,
  className,
}: {
  label: ReactNode;
  hint?: ReactNode;
  value: T;
  options: readonly Option<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  className?: string;
}) => {
  const id = useId();

  return (
    <Field label={label} hint={hint} htmlFor={id} className={className}>
      <Select value={value} onValueChange={(next) => onChange(next as T)}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={placeholder ?? label} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
};

/**
 * A choice with few enough options to show them all at once.
 *
 * Preferred over a dropdown whenever the options fit: seeing the alternatives
 * without opening anything is worth the extra width.
 */
export const SegmentedField = <T extends string>({
  label,
  hint,
  value,
  options,
  onChange,
  className,
}: {
  label: string;
  hint?: ReactNode;
  value: T;
  options: readonly SegmentedOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}) => (
  <Field label={label} hint={hint} className={className}>
    <Segmented label={label} value={value} options={options} onChange={onChange} />
  </Field>
);

/** Inline toggle with its label and description on the left. */
export const SwitchField = ({
  label,
  hint,
  checked,
  onChange,
  className,
}: {
  label: ReactNode;
  hint?: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}) => {
  const id = useId();

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-lg border border-border bg-surface px-3.5 py-3",
        "transition-colors duration-150 hover:border-border-strong",
        className
      )}
    >
      <div className="min-w-0 space-y-0.5">
        <Label htmlFor={id}>{label}</Label>
        {hint && (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
};

/** Grid wrapper the section editors use to lay fields out two-up. */
export const FieldGrid = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <div className={cn("grid grid-cols-1 gap-4 @md:grid-cols-2", className)}>
    {children}
  </div>
);
