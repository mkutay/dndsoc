import { Tables } from "@/types/database.types";
import { runQuery } from "@/utils/supabase-run";

type User = Tables<"users">;
type UserArgument = {
  username: string;
  knumber: string;
  name: string;
  auth_user_uuid: string;
};

type GetUserByAuthUuidError = {
  message: string;
  code: "NOT_FOUND";
};

export const insertUser = (user: UserArgument) =>
  runQuery<User>((supabase) => supabase
    .from("users")
    .insert(user)
    .select("*")
    .single()
  );

export const getUsers = () => 
  runQuery((supabase) => supabase
    .from("users")
    .select("*, roles(*)")
  );

export const getUserByAuthUuid = ({ authUserUuid }: { authUserUuid: string }) => 
  runQuery((supabase) => supabase
    .from("users")
    .select("*")
    .eq("auth_user_uuid", authUserUuid)
    .single()
  )
  .mapErr((error) => error.message.includes("PGRST116")
    ? {
        message: `Public user with auth uuid '${authUserUuid}' not found from table users`,
        code: "NOT_FOUND",
      } as GetUserByAuthUuidError
    : error
  )