/**
 * External dependencies.
 */
import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

/**
 * Internal dependencies.
 */
import { Button } from "@/components/ui/button";

type Props = {
  children: ReactNode;
  /** Named in the fallback so the user knows which part failed. */
  label?: string;
  /** Changing this value clears the error, e.g. when switching platforms. */
  resetKey?: unknown;
};

type State = { error: Error | null };

/**
 * Catches render errors so one malformed preview cannot blank the studio.
 *
 * Still a class component: React has no hook equivalent of
 * `componentDidCatch`.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidUpdate(previous: Props) {
    if (previous.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Preview failed to render", error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div
        role="alert"
        className="flex w-full flex-col items-center gap-3.5 rounded-xl border border-destructive/25 bg-destructive-soft/50 px-6 py-8 text-center"
      >
        <span className="grid size-10 place-items-center rounded-full bg-destructive/15 text-destructive">
          <AlertTriangle className="size-5" aria-hidden />
        </span>

        <div className="space-y-1">
          <p className="text-sm font-semibold">
            {this.props.label ?? "This section"} could not be rendered.
          </p>
          <p className="mx-auto max-w-sm wrap-break-word font-code text-xs leading-relaxed text-muted-foreground">
            {error.message}
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => this.setState({ error: null })}
        >
          <RotateCcw />
          Try again
        </Button>
      </div>
    );
  }
}
