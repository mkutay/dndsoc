"use server";

import { z } from "zod";

import { resultAsyncToActionResult } from "@/types/error-typing";
import { userEditSchema } from "@/config/user-edit-schema";
import { parseSchema } from "@/utils/parse-schema";
import { runQuery } from "@/utils/supabase-run";

export const updateUser = async (values: z.infer<typeof userEditSchema>, authUserUuid: string) => 
  resultAsyncToActionResult(
    parseSchema(userEditSchema, values)
    .asyncAndThen(() =>
      runQuery((supabase) => supabase
        .from("users")
        .update({
          username: values.username,
          name: values.name,
        })
        .eq("auth_user_uuid", authUserUuid)
      )
    )
  );
