"use server";

import { z } from "zod";
import { errAsync, fromPromise, okAsync } from "neverthrow";

import { resultAsyncToActionResult } from "@/types/error-typing";
import { signInFormSchema } from "@/config/auth-schemas";
import { createClient } from "@/utils/supabase/server";
import { parseSchema } from "@/utils/parse-schema";
import { getPublicUser } from "@/lib/users/query-uuid";
import { completeSignUp } from "./complete-sign-up";

type SignInError = {
  message: string;
  code: "DATABASE_ERROR";
}

export const signInAction = async (values: z.infer<typeof signInFormSchema>) => 
  resultAsyncToActionResult(
    parseSchema(signInFormSchema, values)
      .asyncAndThen(() => 
        createClient()
        .andThen((supabase) => 
          fromPromise(
            supabase.auth.signInWithPassword({
              email: values.email,
              password: values.password,
            }),
            () => ({
              message: "Failed to sign in.",
              code: "DATABASE_ERROR",
            } as SignInError)
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
        .andThen((authUserUuid) =>
          getPublicUser({ authUserUuid })
            .orTee((userError) =>
              userError.code === "PUBLIC_USER_NOT_FOUND"
                ? completeSignUp()
                : errAsync(userError)
            )
        )
      )
  );