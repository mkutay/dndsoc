"use server";

import { z } from "zod";

import { adminRoleEditSchema } from "@/config/admin-schema";
import { resultAsyncToActionResult } from "@/types/error-typing";
import { parseSchema } from "@/utils/parse-schema";
import { runQuery } from "@/utils/supabase-run";
import { insertDM } from "@/lib/dms";
import { upsertPlayer } from "@/lib/players";

export const updateRole = async (values: z.infer<typeof adminRoleEditSchema>, authUuid: string) =>
  resultAsyncToActionResult(
    parseSchema(adminRoleEditSchema, values)
      .asyncAndThen(() =>
        runQuery((supabase) => supabase.from("roles").update({ role: values.role }).eq("auth_user_uuid", authUuid)),
      )
      .andThen(() =>
        values.role === "dm" ? insertDM({ auth_user_uuid: authUuid }) : upsertPlayer({ auth_user_uuid: authUuid }),
      )
      .map(() => undefined),
  );
