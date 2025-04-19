"use server";

import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

type SignOutError = {
  message: string;
  code: "DATABASE_ERROR";
};

const signOutAction = () => 
  createClient()
  .andThen((supabase) =>
    ResultAsync.fromSafePromise(supabase.auth.signOut()),
  )
  .andThen((response) => !response.error
    ? okAsync()
    : errAsync({
        message: response.error.message,
        code: "DATABASE_ERROR",
      } as SignOutError)
  )

export const signOut = async () => {
  const result = await signOutAction();
  if (result.isOk()) {
    console.log("Sign out successful");
  } else {
    // Handle error
    console.error(result.error.message);
    redirect("/");
  }
};