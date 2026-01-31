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
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        const nameParam = `;name=${encodeURIComponent(file.name)}`;
        const modified = result.replace(";base64", `${nameParam};base64`);
        resolve(modified);
      } else {
        resolve(result);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/**
 * Formats a count to a string with K or M suffix.
 * @param count - The count to format.
 * @returns The formatted count string.
 */
export const formatCount = (count: number): string => {
  if (count >= 1000000000) {
    return `${Math.floor(count / 1000000000)}B`;
  } else if (count >= 1000000) {
    return `${Math.floor(count / 1000000)}M`;
  } else if (count >= 1000) {
    return `${Math.floor(count / 1000)}K`;
  }
  return count.toString();
};

/**
 * Formats a date to a string with time ago.
 * @param date - The date to format.
 * @param isShortHand - Whether to use shorthand format.
 * @returns The formatted date string.
 */
export const timeAgo = ({
  date,
  isShortHand,
}: {
  date: Date;
  isShortHand?: boolean;
}): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return `${years}${isShortHand ? "y" : ` year${years === 1 ? "" : "s"} ago`}`;
  } else if (months > 0) {
    return `${months}${isShortHand ? "m" : ` month${months === 1 ? "" : "s"} ago`}`;
  } else if (days > 0) {
    return `${days}${isShortHand ? "d" : ` day${days === 1 ? "" : "s"} ago`}`;
  } else if (hours > 0) {
    return `${hours}${isShortHand ? "h" : ` hour${hours === 1 ? "" : "s"} ago`}`;
  } else if (minutes > 0) {
    return `${minutes}${isShortHand ? "m" : ` minute${minutes === 1 ? "" : "s"} ago`}`;
  } else {
    return isShortHand ? "now" : "just now";
  }
};
