import { Tables } from "@/types/database.types";

export function formatClasses(classes: Tables<"classes">[]) {
  return classes.map((cls) => cls.name).join(", ");
}

export function formatRaces(races: Tables<"races">[]) {
  return races.map((race) => race.name).join(", ");
}