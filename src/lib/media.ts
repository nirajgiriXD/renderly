/**
 * Internal dependencies.
 */
import { createId } from "./id";
import type { MediaItem, MediaKind } from "@/types";

export const MAX_MEDIA_BYTES = 12 * 1024 * 1024;

export class MediaError extends Error {}

const kindFromMime = (mime: string): MediaKind | null => {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  return null;
};

/**
 * Reads a `File` into a `MediaItem` backed by a data URL.
 *
 * The file name is embedded in the data URL (`;name=<encoded>;base64,`) so the
 * raw JSON view can show something readable instead of megabytes of base64.
 *
 * @throws {MediaError} When the type is unsupported or the file is too large.
 */
export const fileToMediaItem = (file: File): Promise<MediaItem> => {
  const kind = kindFromMime(file.type);

  if (!kind) {
    throw new MediaError(
      `“${file.name}” is not a supported image or video file.`
    );
  }

  if (file.size > MAX_MEDIA_BYTES) {
    throw new MediaError(
      `“${file.name}” is ${formatBytes(file.size)}. The limit is ${formatBytes(
        MAX_MEDIA_BYTES
      )}.`
    );
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () =>
      reject(new MediaError(`Could not read “${file.name}”.`));

    reader.onload = async () => {
      const result = reader.result;

      if (typeof result !== "string") {
        reject(new MediaError(`Could not read “${file.name}”.`));
        return;
      }

      const src = result.replace(
        ";base64",
        `;name=${encodeURIComponent(file.name)};base64`
      );

      const item: MediaItem = {
        id: createId("media"),
        src,
        name: file.name,
        kind,
      };

      resolve({ ...item, ...(await measure(src, kind)) });
    };

    reader.readAsDataURL(file);
  });
};

/** Reads several files, keeping the ones that could be decoded. */
export const filesToMediaItems = async (files: FileList | File[]) => {
  const results = await Promise.allSettled(
    Array.from(files).map(fileToMediaItem)
  );

  const items: MediaItem[] = [];
  const errors: string[] = [];

  for (const result of results) {
    if (result.status === "fulfilled") items.push(result.value);
    else errors.push((result.reason as Error).message);
  }

  return { items, errors };
};

/** Intrinsic dimensions, so previews can reserve the right aspect ratio. */
const measure = (src: string, kind: MediaKind) =>
  new Promise<{ width?: number; height?: number }>((resolve) => {
    if (kind === "image") {
      const image = new Image();
      image.onload = () =>
        resolve({ width: image.naturalWidth, height: image.naturalHeight });
      image.onerror = () => resolve({});
      image.src = src;
      return;
    }

    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () =>
      resolve({ width: video.videoWidth, height: video.videoHeight });
    video.onerror = () => resolve({});
    video.src = src;
  });

export const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/** Aspect ratio of an item, defaulting to square when it is unknown. */
export const aspectRatioOf = (item: MediaItem, fallback = 1) =>
  item.width && item.height ? item.width / item.height : fallback;

export const isPortrait = (item: MediaItem) => aspectRatioOf(item) < 0.95;
