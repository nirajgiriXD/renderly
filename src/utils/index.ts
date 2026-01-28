/**
 * Internal dependencies.
 */
import { MAX_FILE_SIZE_KB } from "@/constants";

/**
 * Extracts initials from a name.
 * @param {string} name - The name to process.
 * @returns {string} Initials in uppercase, or an empty string if empty.
 */
export const getInitials = (name: string): string => {
  // Trim the name to remove extra spaces and check if it's empty
  name = name.trim();

  // Return empty string if name is empty
  if (name.length === 0) return "";

  // Split the name into words
  const words = name.split(/\s+/);

  // If it's a single word, return the first letter capitalized
  if (words.length === 1) return words[0].charAt(0).toUpperCase();

  // Otherwise, get the first letter of the first and last words
  const firstInitial = words[0].charAt(0).toUpperCase();
  const lastInitial = words[words.length - 1].charAt(0).toUpperCase();

  // Return the concatenated initials
  return `${firstInitial}${lastInitial}`;
};

/**
 * Converts a File object to a Base64 string.
 * @param file - The file to convert.
 * @returns A promise that resolves to the Base64 string representation of the file.
 */
export const convertFilesToBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/**
 * Converts a Base64 string back to a File object.
 * @param base64String - The base64 string (data URL format).
 * @param filename - The name to give the file.
 * @returns A File object or null if conversion fails.
 */
export const convertBase64ToFiles = (
  base64String: string,
  filename: string = "file"
): File | null => {
  try {
    // Extract the base64 data and mime type
    const matches = base64String.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) return null;

    const mimeType = matches[1];
    const base64Data = matches[2];

    // Convert base64 to binary
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Create and return File object
    return new File([bytes], filename, { type: mimeType });
  } catch {
    return null;
  }
};

/**
 * Checks if a file's size is within the specified limit.
 * @param file - The file to check.
 * @param maxSizeInKB - The maximum allowed size in kilobytes. Defaults to MAX_FILE_SIZE_KB constant.
 * @returns True if the file size is within the limit, false otherwise.
 */
export const checkFileSize = (file: File, maxSizeInKB?: number): boolean => {
  const maxSizeInBytes = (maxSizeInKB || MAX_FILE_SIZE_KB) * 1024;
  return file.size <= maxSizeInBytes;
};
