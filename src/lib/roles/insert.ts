import { errAsync, fromPromise, okAsync, ResultAsync } from "neverthrow";

import { Enums, Tables } from "@/types/database.types";
import { createClient } from "@/utils/supabase/server";

type InsertRoleError = {
  message: string;
  code: "DATABASE_ERROR" | "SUPABASE_CLIENT_ERROR";
}

type Role = Tables<"roles">;
type RoleArgument = {
  role?: Enums<"role">;
  auth_user_uuid: string;
}

export const insertRole = (role: RoleArgument): ResultAsync<Role, InsertRoleError> =>
  createClient()
  .andThen((supabase) => fromPromise(
    supabase
      .from("roles")
      .insert(role)
      .select("*")
      .single(),
    () => ({
      message: "Failed to insert role into table \"roles\".",
      code: "DATABASE_ERROR",
    } as InsertRoleError))
  )
  .andThen((result) =>
    !result.error
      ? okAsync(result.data)
      : errAsync({
          message: "Failed to insert role into table \"roles\": " + result.error.message,
          code: "DATABASE_ERROR",
        } as InsertRoleError)
  );