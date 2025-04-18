import { Tables } from "@/types/database.types";
import { runQuery } from "@/utils/supabase-run";

type User = Tables<"users">;
type UserArgument = {
  username: string;
  knumber: string;
  auth_user_uuid: string;
}

export const insertUser = (user: UserArgument) =>
  runQuery<User>((supabase) => supabase
    .from("users")
    .insert(user)
    .select("*")
    .single()
  )