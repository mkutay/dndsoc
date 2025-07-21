"use server";

import { errAsync, fromSafePromise, okAsync } from "neverthrow";
import { z } from "zod";

import { emailSchema, signInFormSchema, usernameSchema } from "@/config/auth-schemas";
import { resultAsyncToActionResult } from "@/types/error-typing";
import { createClient } from "@/utils/supabase/server";
import { parseSchema } from "@/utils/parse-schema";
import { runQuery } from "@/utils/supabase-run";

type SignInError = {
  message: string;
  code: "DATABASE_ERROR" | "INVALID_IDENTIFIER";
};

export const signInAction = async (values: z.infer<typeof signInFormSchema>) =>
  resultAsyncToActionResult(
    parseSchema(signInFormSchema, values).asyncAndThen((parsed) => {
      if (emailSchema.safeParse(values.identifier).success) {
        return signInWithEmail(parsed.identifier, parsed.password);
      } else if (usernameSchema.safeParse(values.identifier).success) {
        return signInWithUsername(parsed.identifier, parsed.password);
      }

      return errAsync({
        message: "Identifier must be a valid email, K-Number, or username.",
        code: "INVALID_IDENTIFIER",
      } as SignInError);
    }),
  );

const signInWithEmail = (email: string, password: string) =>
  createClient()
    .andThen((supabase) =>
      fromSafePromise(
        supabase.auth.signInWithPassword({
          email,
          password,
        }),
      ),
    )
    .andThen((result) =>
      !result.error
        ? okAsync()
        : errAsync({
            message: "Failed to sign in.",
            code: "DATABASE_ERROR",
          } as SignInError),
    );

const signInWithUsername = (username: string, password: string) =>
  runQuery((supabase) => supabase.from("users").select("email").eq("username", username).single()).andThen(
    ({ email }) => signInWithEmail(email, password),
  );
