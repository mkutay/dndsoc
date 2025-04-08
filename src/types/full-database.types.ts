import { Tables } from "./database.types";

export type Player = Tables<"players"> & {
  users: Tables<"users">;
  received_achievements: ReceivedAchievements[];
};

export type ReceivedAchievements = Tables<"received_achievements"> & {
  achievements: Tables<"achievements">;
};

export type Character = Tables<"characters"> & {
  races: Tables<"races">[];
  classes: Tables<"classes">[];
  campaigns: Tables<"campaigns">[];
};