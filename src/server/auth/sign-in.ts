"use server";

import { err, errAsync, fromSafePromise, ok, okAsync, Result } from "neverthrow";
import { z } from "zod";

import { emailSchema, kNumberSchema, signInFormSchema, usernameSchema } from "@/config/auth-schemas";
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
    parseSchema(signInFormSchema, values)
      .andThen(parseIdentifier)
      .asyncAndThen(({ password, ...parsed }) =>
        "email" in parsed
          ? signInWithEmail(parsed.email, password)
          : "knumber" in parsed
            ? signInWithKNumber(parsed.knumber, password)
            : signInWithUsername(parsed.username, password),
      ),
  );

const parseIdentifier = (
  values: z.infer<typeof signInFormSchema>,
): Result<{ password: string } & ({ email: string } | { username: string } | { knumber: string }), SignInError> =>
  emailSchema.safeParse(values.identifier).success
    ? ok({ email: values.identifier, password: values.password })
    : kNumberSchema.safeParse(values.identifier).success
      ? ok({ knumber: values.identifier, password: values.password })
      : usernameSchema.safeParse(values.identifier).success
        ? ok({ username: values.identifier, password: values.password })
        : err({
            message: "Identifier must be a valid email, K-Number, or username.",
            code: "INVALID_IDENTIFIER",
          } as SignInError);

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

const signInWithKNumber = (knumber: string, password: string) =>
  runQuery((supabase) => supabase.from("users").select("email").eq("knumber", knumber).single()).andThen(({ email }) =>
    signInWithEmail(email, password),
  );

const signInWithUsername = (username: string, password: string) =>
  runQuery((supabase) => supabase.from("users").select("email").eq("username", username).single()).andThen(
    ({ email }) => signInWithEmail(email, password),
  );
