/**
 * External dependencies.
 */
import { useMemo } from "react";

/**
 * Internal dependencies.
 */
import type { CommentsConfig, Person } from "@/types";

export type CommentPreviewProps = {
  data: CommentsConfig;
};

const UNKNOWN: Person = {
  id: "unknown",
  name: "Someone",
  username: "someone",
  avatar: null,
  verified: false,
};

/**
 * Index of everyone who can appear in a thread, keyed by id.
 *
 * Comments reference their author by id so renaming a participant updates
 * every one of their comments at once; this turns that id back into a person.
 */
export const usePeople = (data: CommentsConfig) =>
  useMemo(() => {
    const people = new Map<string, Person>();
    people.set(data.users.creator.id, data.users.creator);
    for (const person of data.users.participants) people.set(person.id, person);
    return people;
  }, [data.users]);

export const personOf = (people: Map<string, Person>, id: string): Person =>
  people.get(id) ?? UNKNOWN;

export const isCreator = (data: CommentsConfig, id: string) =>
  data.users.creator.id === id;
