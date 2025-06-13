import { Tables } from "./database.types";

export type Player = Tables<"players"> & {
  users: Tables<"users">;
  received_achievements_player: ReceivedAchievementsPlayer[];
};

export type DM = Tables<"dms"> & {
  users: Tables<"users">;
  received_achievements_dm: ReceivedAchievementsDM[];
};

export type ReceivedAchievementsPlayer = Tables<"received_achievements_player"> & {
  achievements: Tables<"achievements">;
};

export type ReceivedAchievementsDM = Tables<"received_achievements_dm"> & {
  achievements: Tables<"achievements">;
};

export type ReceivedAchievementsCharacter = Tables<"received_achievements_character"> & {
  achievements: Tables<"achievements">;
};

export type Character = Tables<"characters"> & {
  races: Tables<"races">[];
  classes: Tables<"classes">[];
  players: Tables<"players"> & {
    users: Tables<"users">;
  };
};

export const rolesLabel = [
  {
    value: "admin",
    label: "Admin",
  },
  {
    value: "player",
    label: "Player",
  },
  {
    value: "dm",
    label: "DM",
  },
];