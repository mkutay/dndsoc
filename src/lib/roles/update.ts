'use server';

import { z } from "zod";

import { adminRoleEditSchema } from "@/config/admin-schema";
import { createClient } from "@/utils/supabase/server";
import { errAsync, fromPromise, okAsync } from "neverthrow";
import { resultAsyncToActionResult } from "@/types/error-typing";
import { parseSchema } from "@/utils/parse-schema";

type UpdateRoleError = {
  message: string;
  code: "DATABASE_ERROR";
};

export const updateRole = async (values: z.infer<typeof adminRoleEditSchema>, authUuid: string) => resultAsyncToActionResult(
  parseSchema(adminRoleEditSchema, values)
    .asyncAndThen(() => createClient()
      .andThen((supabase) =>
        fromPromise(
          supabase
            .from("roles")
            .update({ role: values.role })
            .eq("auth_user_uuid", authUuid),
          (error) => ({
            message: `Failed to update role in table "roles": ${error instanceof Error ? error.message : 'Unknown error'}`,
            code: "DATABASE_ERROR",
          } as UpdateRoleError)
        )
      )
      .andThen((response) => 
        !response.error 
          ? okAsync()
          : errAsync({
            message: `Failed to update role in table "roles": ${response.error.message}`,
            code: "DATABASE_ERROR",
          } as UpdateRoleError)
      )
    )
)