"use server";

import { errAsync, fromSafePromise, okAsync } from "neverthrow";
import { z } from "zod";

import { resultAsyncToActionResult } from "@/types/error-typing";
import { signInFormSchema } from "@/config/auth-schemas";
import { createClient } from "@/utils/supabase/server";
import { parseSchema } from "@/utils/parse-schema";
import { completeSignUp } from "@/lib/auth";
import DB from "@/lib/db";

type SignInError = {
  message: string;
  code: "DATABASE_ERROR";
}

export const signInAction = async (values: z.infer<typeof signInFormSchema>) => 
  resultAsyncToActionResult(
    parseSchema(signInFormSchema, values)
      .asyncAndThen(() => createClient())
      .andThen((supabase) => 
        fromSafePromise(
          supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
          })
        )
      )
      .andThen((result) => 
        !result.error
          ? okAsync(result.data.user.id)
          : errAsync({
            message: "Failed to sign in.",
            code: "DATABASE_ERROR",
          } as SignInError)
      )
      .andThen((authUserUuid) => DB.Users.Get.Auth({ authUserUuid }))
      .orTee((userError) => userError.code === "NOT_FOUND"
        ? completeSignUp()
        : errAsync(userError)
      )
      .map((user) => ({ username: user.username }))
  );