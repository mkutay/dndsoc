import { errAsync, fromSafePromise, okAsync, ResultAsync } from "neverthrow";
import type { EmailOtpType, User } from "@supabase/supabase-js";

import { getOrigin } from "./origin";
import { createClient } from "@/utils/supabase/server";
import { runQuery } from "@/utils/supabase-run";

// Sends a confirmation email to the user after signing up, only if there is an inital sign up being done.
// Otherwise, it does nothing, and doesn't return an error.
export const resendConfirmationEmail = ({ email, redirectTo }: { email: string; redirectTo: string }) =>
  createClient()
    .andThen((supabase) =>
      fromSafePromise(
        supabase.auth.resend({
          type: "signup",
          email: email,
          options: {
            emailRedirectTo: redirectTo,
          },
        }),
      ),
    )
    .andThen((response) => (!response.error ? okAsync() : errAsync(response.error)))
    .mapErr((error) => ({
      message: "Failed to resend the confirmation email. " + error.message,
      code: "AUTH_ERROR" as const,
    }));

type VerifyOtpError = {
  message: string;
  code: "DATABASE_ERROR";
};

export const verifyOtp = ({ type, tokenHash }: { type: EmailOtpType; tokenHash: string }) =>
  createClient()
    .andThen((supabase) => fromSafePromise(supabase.auth.verifyOtp({ type, token_hash: tokenHash })))
    .andThen((response) => (!response.error ? okAsync(response.data) : errAsync(response.error)))
    .mapErr(
      (error) =>
        ({
          message: "Failed to verify OTP (in supabase): " + error.message,
          code: "DATABASE_ERROR",
        }) as VerifyOtpError,
    );

type GetUserError = {
  message: string;
  code: "DATABASE_ERROR" | "NOT_LOGGED_IN";
};

export const getUser = () =>
  createClient()
    .andThen((supabase) => fromSafePromise(supabase.auth.getUser()))
    .andThen((response) => (!response.error ? okAsync(response.data) : errAsync(response.error)))
    .mapErr((error) =>
      error.message.includes("session missing")
        ? ({
            message: "Failed to get user (in supabase): " + error.message,
            code: "NOT_LOGGED_IN",
          } as GetUserError)
        : ({
            message: "Failed to get user (in supabase): " + error.message,
            code: "DATABASE_ERROR",
          } as GetUserError),
    )
    .map((data) => data.user);

/**
 * Signed up and authenticated user, so insert role and player into database
 */
export const completeSignUp = (user: User) =>
  runQuery((supabase) =>
    supabase.from("users").insert({
      username: user.user_metadata.username,
      knumber: user.user_metadata.knumber ?? null,
      name: user.user_metadata.name,
      email: user.user_metadata.email,
      auth_user_uuid: user.id,
    }),
  )
    .andThen(() =>
      runQuery((supabase) =>
        supabase.from("roles").insert({
          role: "player",
          auth_user_uuid: user.id,
        }),
      ),
    )
    .andThen(() =>
      runQuery((supabase) =>
        supabase.from("players").insert({
          auth_user_uuid: user.id,
          level: 1,
        }),
      ),
    );

type SignUpUserError = {
  message: string;
  code: "DATABASE_ERROR" | "USER_NOT_FOUND";
};

export const signUpUser = ({
  email,
  password,
  username,
  knumber,
}: {
  email: string;
  password: string;
  username: string;
  knumber: string;
}) =>
  ResultAsync.combine([getOrigin(), createClient()])
    .andThen(([origin, supabase]) =>
      fromSafePromise(
        supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${origin}/my`,
            data: {
              username,
              knumber,
              name: username, // For now, we use username as the name
              siteUrl: origin, // For preview and production deployments
              email,
            },
          },
        }),
      ),
    )
    .andThen((result) =>
      !result.error
        ? okAsync(result.data)
        : errAsync({
            message: "Failed to sign up (Supabase error): " + result.error.message,
            code: "DATABASE_ERROR",
          } as SignUpUserError),
    )
    .andThen((data) =>
      data.user
        ? okAsync(data.user)
        : errAsync({
            message: "User not found.",
            code: "USER_NOT_FOUND",
          } as SignUpUserError),
    );
