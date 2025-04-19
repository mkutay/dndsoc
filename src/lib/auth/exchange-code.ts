import { createClient } from "@/utils/supabase/server";
import { errAsync, fromSafePromise, okAsync } from "neverthrow";

type ExchangeCodeError = {
  message: string;
  code: "DATABASE_ERROR";
};

// This function exchanges an auth code for the user's session.
export const exchangeCodeForSession = (code: string) => 
  createClient()
    .andThen((supabase) => fromSafePromise(supabase.auth.exchangeCodeForSession(code)))
    .andThen((response) => 
      !response.error
        ? okAsync()
        : errAsync({
            message: "Failed to exchange code for session (in supabase): " + response.error.message,
            code: "DATABASE_ERROR",
          } as ExchangeCodeError)
    );