"use server";

import { z } from "zod";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { actionErr, ActionResult, resultAsyncToActionResult } from "@/types/error-typing";
import { Enums } from "@/types/database.types";
import { createClient } from "@/utils/supabase/server";
import { signUpFormSchema } from "@/config/auth-schemas";
import { getOrigin } from "./origin";

type SignUpError = {
  message: string;
  code: "INVALID_FORM" | "DATABASE_ERROR" | "SUPABASE_CLIENT_ERROR" | "GET_ORIGIN_ERROR";
};

type Role = Enums<"role">;

export async function signUpAction(values: z.infer<typeof signUpFormSchema>):
  Promise<ActionResult<void, SignUpError>> {
  const validation = signUpFormSchema.safeParse(values);

  if (!validation.success) {
    return actionErr({
      message: "Invalid form data: " + validation.error.message,
      code: "INVALID_FORM",
    });
  }

  const supabase = createClient();

  const origin = getOrigin();

  const combined = ResultAsync.combine([origin, supabase]);

  const signUpResult = combined.andThen(([origin, supabase]) => {
    const response = supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    return ResultAsync.fromPromise(response, () => ({
      message: "Failed to sign up in Supabase.",
      code: "DATABASE_ERROR",
    } as SignUpError));
  }).andThen((result) => {
    if (result.error) {
      return errAsync({
        message: "Failed to sign up: " + result.error.message,
        code: "DATABASE_ERROR",
      } as SignUpError);
    }
    if (!result.data.user) {
      return errAsync({
        message: "User not found.",
        code: "DATABASE_ERROR",
      } as SignUpError);
    }
    return okAsync(result.data.user.id);
  });

  const addUsersResult = ResultAsync
    .combine([signUpResult, supabase])
    .andThen(([signUpResult, supabase]) => {
      const usersInsert = supabase
        .from("users")
        .insert({
          username: values.username,
          knumber: values.knumber,
          auth_user_uuid: signUpResult,
        });

      return ResultAsync.fromPromise(usersInsert, () => ({
        message: "Failed to insert user in database in table \"users\".",
        code: "DATABASE_ERROR",
      } as SignUpError));
    })
    .andThen((result) => {
      if (result.error) {
        return errAsync({
          message: "Failed to insert user in database in table \"users\": " + result.error.message,
          code: "DATABASE_ERROR",
        } as SignUpError);
      }
      return okAsync();
    });

  const addRoleResult = ResultAsync
    .combine([signUpResult, supabase])
    .andThen(([signUpResult, supabase]) => {
      const roleInsert = supabase
        .from("roles")
        .insert({
          role: "player" as Role,
          user_uuid: signUpResult,
        });

      return ResultAsync.fromPromise(roleInsert, () => ({
        message: "Failed to insert user in database in table \"roles\".",
        code: "DATABASE_ERROR",
      } as SignUpError));
    })

  const playersResult = ResultAsync
    .combine([signUpResult, supabase])
    .andThen(([signUpResult, supabase]) => {
      const playersInsert = supabase
        .from("players")
        .insert({
          id: crypto.randomUUID(),
          user_uuid: signUpResult,
          level: 1,
        });

      return ResultAsync.fromPromise(playersInsert, () => ({
        message: "Failed to insert user in database in table \"players\".",
        code: "DATABASE_ERROR",
      } as SignUpError));
    })
    .andThen((result) => {
      if (result.error) {
        return errAsync({
          message: "Failed to insert user in database in table \"players\": " + result.error.message,
          code: "DATABASE_ERROR",
        } as SignUpError);
      }
      return okAsync();
    });

  const result = ResultAsync
    .combine([addUsersResult, addRoleResult, playersResult]);

  return resultAsyncToActionResult(result);
}