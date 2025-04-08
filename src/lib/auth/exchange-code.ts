import { createClient } from "@/utils/supabase/server";
import { errAsync, fromPromise, okAsync } from "neverthrow";

type ExchangeCodeError = {
  message: string;
  code: "DATABASE_ERROR";
};

// This function exchanges an auth code for the user's session.
export const exchangeCodeForSession = (code: string) => 
  createClient()
    .andThen((supabase) => fromPromise(
      supabase.auth.exchangeCodeForSession(code),
      (error) => ({
        message: "Failed to exchange code for session: " + (error as Error).message,
        code: "DATABASE_ERROR",
      } as ExchangeCodeError)
    ))
    .andThen((response) => 
      !response.error
        ? okAsync()
        : errAsync({
            message: "Failed to exchange code for session (in supabase): " + response.error.message,
            code: "DATABASE_ERROR",
          } as ExchangeCodeError)
    );