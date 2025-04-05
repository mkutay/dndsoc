import { ResultAsync } from "neverthrow";

import { Tables } from "@/types/database.types";
import { getUserByUsername } from "@/lib/users/query-username";
import { getPlayerByUuid } from "./query-uuid";

type GetPlayerByUsernameError = {
  message: string;
  code: "DATABASE_ERROR" | "SUPABASE_CLIENT_ERROR" | "NOT_FOUND";
};

type Player = Tables<"players">;

export function getPlayerByUsername(username: string):
  ResultAsync<Player, GetPlayerByUsernameError> {

  return getUserByUsername(username)
    .andThen((user) => {
      return getPlayerByUuid(user.user_uuid);
    });
}