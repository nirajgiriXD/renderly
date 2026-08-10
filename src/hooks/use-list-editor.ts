/**
 * External dependencies.
 */
import { useMemo } from "react";

type WithId = { id: string };

type ListEditor<T extends WithId> = {
  items: T[];
  add: (item: T, index?: number) => void;
  update: (id: string, patch: Partial<T> | ((previous: T) => Partial<T>)) => void;
  remove: (id: string) => void;
  replace: (items: T[]) => void;
  move: (from: number, to: number) => void;
  duplicate: (id: string, clone: (item: T) => T) => void;
};

/**
 * Add / update / remove / reorder helpers for a list held in the config store.
 *
 * Every editor that manages comments, replies, messages or turns needs the
 * same five operations; without this they each re-implement `map`/`filter`
 * inline against the store.
 *
 * @param items - Current list.
 * @param onChange - Receives the next list.
 */
export const useListEditor = <T extends WithId>(
  items: T[],
  onChange: (next: T[]) => void
): ListEditor<T> =>
  useMemo(
    () => ({
      items,

      add: (item, index) => {
        if (index === undefined) {
          onChange([...items, item]);
          return;
        }
        const next = [...items];
        next.splice(index, 0, item);
        onChange(next);
      },

      update: (id, patch) =>
        onChange(
          items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...(typeof patch === "function" ? patch(item) : patch),
                }
              : item
          )
        ),

      remove: (id) => onChange(items.filter((item) => item.id !== id)),

      replace: onChange,

      move: (from, to) => {
        if (
          from === to ||
          from < 0 ||
          to < 0 ||
          from >= items.length ||
          to >= items.length
        ) {
          return;
        }
        const next = [...items];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        onChange(next);
      },

      duplicate: (id, clone) => {
        const index = items.findIndex((item) => item.id === id);
        if (index === -1) return;
        const next = [...items];
        next.splice(index + 1, 0, clone(items[index]));
        onChange(next);
      },
    }),
    [items, onChange]
  );
