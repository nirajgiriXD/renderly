/**
 * Internal dependencies.
 */
import { toHandle } from "@/lib/format";

/*
 * Previews must stay legible while the form is still empty, so every text slot
 * falls back to a neutral placeholder instead of collapsing the layout.
 */

export const displayName = (name: string, fallback = "Your name") =>
  name.trim() || fallback;

export const handle = (username: string, fallback = "username") =>
  toHandle(username) || fallback;

export const groupTitle = (title: string, otherName: string) =>
  title.trim() || displayName(otherName, "New conversation");
