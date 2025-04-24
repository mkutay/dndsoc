import { Tables } from "@/types/database.types";

export function formatClasses(classes: Tables<"classes">[] | { name: string }[]) {
  return classes.map((cls) => cls.name).join(", ");
}

export function formatRaces(races: Tables<"races">[] | { name: string }[]) {
  return races.map((race) => race.name).join(", ");
}

// No numbers, no spaces, no special characters
// Replace spaces with dashes
// All lowercase
export const convertToShortened = (name: string) => {
  return name
    .replace(/ /g, "-")
    .replace(/[^a-zA-Z0-9\-]/g, "")
    .toLowerCase();
}