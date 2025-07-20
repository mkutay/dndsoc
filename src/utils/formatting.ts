export function formatList(items: string[] | { name: string }[], separator = ", ") {
  if (items.length === 0) return "";
  return items.map((item) => (typeof item === "string" ? item : item.name)).join(separator);
}

// No numbers, no spaces, no special characters
// Replace spaces with dashes
// All lowercase
export const convertToShortened = (name: string) => {
  return name
    .trim()
    .replace(/ /g, "-")
    .replace(/[^a-zA-Z0-9\-]/g, "")
    .toLowerCase();
};

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function getMidnightOfDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getEndOfDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}
