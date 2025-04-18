import { Tables } from "@/types/database.types";
import { runQuery } from "@/utils/supabase-run";

type GetUserByUsernameError = {
  message: string;
  code: "NOT_FOUND";
}

type User = Tables<"users">;

export const getUserByUsername = (username: string) =>
  runQuery<User>((supabase) => supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single()
  )
  .mapErr((error) => error.message.includes("PGRST116")
    ? {
        message: `User not found: ${username}`,
        code: "NOT_FOUND",
      } as GetUserByUsernameError
    : error
  )