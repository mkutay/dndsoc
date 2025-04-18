import { errAsync, fromSafePromise, okAsync, ResultAsync } from "neverthrow";

import { createClient } from "@/utils/supabase/server";
import { getOrigin } from "./origin";

type SignUpUserError = {
  message: string;
  code: "DATABASE_ERROR" | "USER_NOT_FOUND";
};

export const signUpUser = ({ email, password, username, knumber }: { email: string; password: string; username: string; knumber: string; }) => ResultAsync
  .combine([getOrigin(), createClient()])
  .andThen(([origin, supabase]) => 
    fromSafePromise(
      supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${origin}/auth/callback?type=signup`,
          data: {
            username,
            knumber,
          },
        },
      })
    )
  )
  .andThen((result) => !result.error
    ? okAsync(result.data)
    : errAsync({
        message: "Failed to sign up (Supabase error): " + result.error.message,
        code: "DATABASE_ERROR",
      } as SignUpUserError)
  )
  .andThen((data) => data.user
    ? okAsync(data.user)
    : errAsync({
        message: "User not found.",
        code: "USER_NOT_FOUND",
      } as SignUpUserError)
  );
