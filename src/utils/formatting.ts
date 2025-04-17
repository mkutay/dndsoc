import { Tables } from "@/types/database.types";

export function formatClasses(classes: Tables<"classes">[] | { name: string }[]) {
  return classes.map((cls) => cls.name).join(", ");
}

export function formatRaces(races: Tables<"races">[] | { name: string }[]) {
  return races.map((race) => race.name).join(", ");
}