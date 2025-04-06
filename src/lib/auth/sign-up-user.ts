import { errAsync, fromPromise, okAsync, ResultAsync } from "neverthrow";
import { User } from "@supabase/supabase-js";

import { createClient } from "@/utils/supabase/server";
import { getOrigin } from "./origin";

type SignUpUserError = {
  message: string;
  code: "DATABASE_ERROR" | "SUPABASE_CLIENT_ERROR" | "GET_ORIGIN_ERROR";
};

export function signUpUser({ email, password }: { email: string; password: string; }):
  ResultAsync<User, SignUpUserError> {
  const supabase = createClient();
  const origin = getOrigin();

  return ResultAsync
    .combine([origin, supabase])
    .andThen(([origin, supabase]) => 
      fromPromise(
        supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${origin}/auth/callback`,
          },
        }), 
        (error) => ({
          message: "Failed to sign up in Supabase. " + (error as Error).message,
          code: "DATABASE_ERROR",
        } as SignUpUserError)
      )
    )
    .andThen((result) =>
      !result.error ? 
        okAsync(result.data) :
        errAsync({
          message: "Failed to sign up: " + result.error.message,
          code: "DATABASE_ERROR",
        } as SignUpUserError)
    )
    .andThen((data) =>
      data.user ? 
        okAsync(data.user) :
        errAsync({
          message: "User not found.",
          code: "DATABASE_ERROR",
        } as SignUpUserError)
    );
}