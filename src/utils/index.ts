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
