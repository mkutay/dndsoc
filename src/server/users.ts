"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { resultAsyncToActionResult } from "@/types/error-typing";
import { userEditSchema } from "@/config/auth-schemas";
import { parseSchema } from "@/utils/parse-schema";
import { runQuery } from "@/utils/supabase-run";
import { getUser } from "@/lib/auth";

export const updateUser = async (values: z.infer<typeof userEditSchema>) =>
  resultAsyncToActionResult(
    parseSchema(userEditSchema, values)
      .asyncAndThen(getUser)
      .andThen((user) =>
        runQuery((supabase) =>
          supabase
            .from("users")
            .update({
              name: values.name,
            })
            .eq("auth_user_uuid", user.id),
        ),
      )
      .andTee(() => revalidatePath("/my")),
  );
