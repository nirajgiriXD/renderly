/**
 * Media attached to a post, message or comment.
 *
 * `src` is a data URL so previews stay entirely client side and survive a
 * page reload without needing an upload service.
 */
export type MediaKind = "image" | "video";

export type MediaItem = {
  id: string;
  /** Data URL (`data:image/png;name=cat.png;base64,...`). */
  src: string;
  /** Original file name, used for the raw view and for alt text. */
  name: string;
  kind: MediaKind;
  /** Intrinsic size, when it could be measured. Drives aspect-ratio boxes. */
  width?: number;
  height?: number;
};
