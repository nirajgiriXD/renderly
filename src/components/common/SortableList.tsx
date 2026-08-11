/**
 * External dependencies.
 */
import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

/**
 * Internal dependencies.
 */
import { cn } from "@/lib/utils";

type WithId = { id: string };

/** The subset of `useSortable`'s result the grip needs. */
type RowHandle = Pick<
  ReturnType<typeof useSortable>,
  "attributes" | "listeners"
> & { isDragging: boolean };

/*
 * The grip belongs in the row's header, beside the row's own controls — but
 * the drag props come from `useSortable`, which only exists inside the row.
 * Publishing them through context lets the header be composed by the caller
 * without every section re-implementing the drag plumbing.
 */
const RowContext = createContext<RowHandle | null>(null);

type SortableListProps<T extends WithId> = {
  items: T[];
  onReorder: (from: number, to: number) => void;
  children: (item: T, index: number) => ReactNode;
  className?: string;
};

/**
 * Vertical drag-to-reorder list.
 *
 * Replaces a much larger vendored sortable: the inspector only ever needs a
 * single-axis list, and dnd-kit already ships keyboard support, so the extra
 * abstraction layer was cost without benefit.
 */
export const SortableList = <T extends WithId>({
  items,
  onReorder,
  children,
  className,
}: SortableListProps<T>) => {
  const sensors = useSensors(
    // The activation distance keeps a click on a button inside a row from
    // being swallowed as the start of a drag.
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const from = items.findIndex((item) => item.id === active.id);
    const to = items.findIndex((item) => item.id === over.id);
    if (from !== -1 && to !== -1) onReorder(from, to);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <ul className={cn("space-y-2.5", className)}>
          {items.map((item, index) => (
            <SortableRow key={item.id} id={item.id}>
              {children(item, index)}
            </SortableRow>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};

const SortableRow = ({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      data-dragging={isDragging || undefined}
      className={cn(
        "group/row relative overflow-hidden rounded-xl border border-border bg-surface shadow-xs",
        "transition-[box-shadow,border-color] duration-150",
        "focus-within:border-border-strong hover:border-border-strong",
        isDragging && "z-10 border-primary/40 shadow-lg"
      )}
    >
      <RowContext.Provider value={{ attributes, listeners, isDragging }}>
        {children}
      </RowContext.Provider>
    </li>
  );
};

/** The grip. Only renders inside a `SortableList` row. */
const DragHandle = () => {
  const row = useContext(RowContext);
  if (!row) return null;

  return (
    <button
      type="button"
      aria-label="Reorder"
      className={cn(
        "-ml-1 grid size-7 shrink-0 cursor-grab place-items-center rounded-md text-faint",
        "transition-colors duration-150 hover:bg-accent hover:text-foreground",
        "focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-ring",
        "active:cursor-grabbing"
      )}
      {...row.attributes}
      {...row.listeners}
    >
      <GripVertical className="size-4" aria-hidden />
    </button>
  );
};

/**
 * Header strip of a sortable row: grip, identity, contextual actions.
 *
 * The actions stay visible rather than appearing on hover. Some of them —
 * pinned, hearted — are toggles whose pressed state *is* information, and
 * hiding a control until the pointer arrives would hide that state too.
 */
export const RowHeader = ({
  lead,
  summary,
  actions,
  className,
}: {
  lead?: ReactNode;
  /** Muted text between the lead and the actions, e.g. a timestamp. */
  summary?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex items-center gap-2 border-b border-border/70 bg-sunken/40 px-2.5 py-1.5",
      className
    )}
  >
    <DragHandle />
    {lead}
    {summary && (
      <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
        {summary}
      </span>
    )}
    {actions && (
      <div className="ml-auto flex shrink-0 items-center gap-0.5">
        {actions}
      </div>
    )}
  </div>
);

/** Body of a sortable row. */
export const RowBody = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => <div className={cn("space-y-4 p-3.5", className)}>{children}</div>;
