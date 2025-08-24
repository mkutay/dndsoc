"use server";

import { revalidatePath } from "next/cache";
import { okAsync } from "neverthrow";
import { z } from "zod";

import { resultAsyncToActionResult } from "@/types/error-typing";
import { parseSchema } from "@/utils/parse-schema";
import { runQuery } from "@/utils/supabase-run";
import { uploadImageAdmin } from "@/lib/storage";
import { adminEditSchema } from "@/config/admins";

export const updateAdmin = async (values: z.infer<typeof adminEditSchema>, path: string) =>
  resultAsyncToActionResult(
    parseSchema(adminEditSchema, values)
      .asyncAndThen(() =>
        runQuery((supabase) =>
          supabase
            .from("admins")
            .update({
              about: values.about,
            })
            .eq("id", values.adminId)
            .select("users(username)")
            .single(),
        ),
      )
      .andThen(({ users }) =>
        values.avatar
          ? uploadImageAdmin({
              file: values.avatar,
              shortened: users.username,
              adminId: values.adminId,
            })
          : okAsync(),
      )
      .andTee(() => revalidatePath(path)),
  );
