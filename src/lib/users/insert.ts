import { errAsync, fromPromise, okAsync } from "neverthrow";

import { Tables } from "@/types/database.types";
import { createClient } from "@/utils/supabase/server";

type InsertUserError = {
  message: string;
  code: "DATABASE_ERROR";
}

type User = Tables<"users">;
type UserArgument = {
  username: string;
  knumber: string;
  auth_user_uuid: string;
}

export const insertUser = (user: UserArgument) =>
  createClient()
  .andThen((supabase) => fromPromise(
    supabase
      .from("users")
      .insert(user)
      .select("*")
      .single(),
    () => ({
      message: "Failed to insert user into table \"users\".",
      code: "DATABASE_ERROR",
    } as InsertUserError))
  )
  .andThen((result) =>
    !result.error
      ? okAsync(result.data as User)
      : errAsync({
          message: "Failed to insert user into table \"users\": " + result.error.message,
          code: "DATABASE_ERROR",
        } as InsertUserError)
  );