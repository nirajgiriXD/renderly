/**
 * External dependencies.
 */
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
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";
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

type SortableListProps<T extends WithId> = {
  items: T[];
  onReorder: (from: number, to: number) => void;
  children: (item: T, index: number) => ReactNode;
  className?: string;
};

/**
 * Vertical drag-to-reorder list.
 *
 * Replaces a much larger vendored sortable: the editor only ever needs a
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
        <ul className={cn("space-y-3", className)}>
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
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(
        "relative rounded-xl border bg-card",
        isDragging && "z-10 opacity-90 shadow-lg"
      )}
    >
      <button
        type="button"
        aria-label="Reorder"
        className="absolute left-1.5 top-3.5 cursor-grab rounded p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>
      <div className="pl-8">{children}</div>
    </li>
  );
};
