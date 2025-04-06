import { ResultAsync } from "neverthrow";

import { Tables } from "@/types/database.types";
import { getUserByUsername } from "@/lib/users/query-username";
import { getPlayerByAuthUuid } from "./query-uuid";

type GetPlayerByUsernameError = {
  message: string;
  code: "DATABASE_ERROR" | "SUPABASE_CLIENT_ERROR" | "NOT_FOUND";
};

type Player = Tables<"players"> & {
  campaigns: Tables<"campaigns">[];
};

export function getPlayerByUsername(username: string):
  ResultAsync<Player, GetPlayerByUsernameError> {

  return getUserByUsername(username)
    .andThen((user) => {
      return getPlayerByAuthUuid(user.auth_user_uuid);
    });
}