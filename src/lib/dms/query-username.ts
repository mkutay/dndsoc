import { ResultAsync } from "neverthrow";

import { Tables } from "@/types/database.types";
import { getUserByUsername } from "@/lib/users/query-username";
import { getDMByUuid } from "./query-uuid";

type GetDMByUsernameError = {
  message: string;
  code: "DATABASE_ERROR" | "SUPABASE_CLIENT_ERROR" | "NOT_FOUND";
};

type DM = Tables<"dms">;

export function getDMByUsername(username: string):
  ResultAsync<DM, GetDMByUsernameError> {

  return getUserByUsername(username)
    .andThen((user) => {
      return getDMByUuid(user.user_uuid);
    });
}