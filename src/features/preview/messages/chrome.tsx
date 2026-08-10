/**
 * External dependencies.
 */
import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";

/**
 * Internal dependencies.
 */
import { PreviewAvatar } from "../primitives";
import { cn } from "@/lib/utils";

type ChatHeaderProps = {
  leading?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
  titleClassName?: string;
};

/** Fixed bar at the top of a conversation. */
export const ChatHeader = ({
  leading,
  title,
  subtitle,
  actions,
  className,
  titleClassName,
}: ChatHeaderProps) => (
  <header
    className={cn(
      "flex shrink-0 items-center gap-3 border-b border-[var(--pv-border)] bg-[var(--pv-surface)] px-3 py-2.5",
      className
    )}
  >
    {leading}
    <div className="min-w-0 flex-1 leading-tight">
      <p className={cn("truncate text-[15px] font-semibold", titleClassName)}>
        {title}
      </p>
      {subtitle && (
        <p className="truncate text-[11.5px] text-[var(--pv-muted)]">
          {subtitle}
        </p>
      )}
    </div>
    {actions && (
      <div className="flex shrink-0 items-center gap-4 text-[var(--pv-muted)]">
        {actions}
      </div>
    )}
  </header>
);

/** Back chevron + avatar, the standard mobile messaging header lead-in. */
export const BackAndAvatar = ({
  avatar,
  name,
  size = "size-8",
}: {
  avatar: string | null;
  name: string;
  size?: string;
}) => (
  <>
    <ChevronLeft className="-ml-1 size-5 shrink-0" aria-hidden />
    <PreviewAvatar src={avatar} name={name} className={cn("shrink-0", size)} />
  </>
);

type ComposerProps = {
  placeholder?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  className?: string;
  inputClassName?: string;
};

/** Message input bar. Inert by design — a preview never sends anything. */
export const Composer = ({
  placeholder = "Message",
  leading,
  trailing,
  className,
  inputClassName,
}: ComposerProps) => (
  <footer
    className={cn(
      "flex shrink-0 items-center gap-2 border-t border-[var(--pv-border)] bg-[var(--pv-surface)] px-3 py-2 text-[var(--pv-muted)]",
      className
    )}
  >
    {leading}
    <div
      className={cn(
        "min-w-0 flex-1 truncate rounded-full bg-[var(--pv-subtle)] px-3 py-2 text-sm",
        inputClassName
      )}
    >
      {placeholder}
    </div>
    {trailing}
  </footer>
);
