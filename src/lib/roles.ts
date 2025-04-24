import { Enums, Tables } from "@/types/database.types";
import { runQuery } from "@/utils/supabase-run";
import { getUser } from "./auth";

type Role = Tables<"roles">;
type RoleArgument = {
  role?: Enums<"role">;
  auth_user_uuid: string;
};

type GetRoleUserError = {
  message: string;
  code: "NOT_LOGGED_IN";
};

export const insertRole = (role: RoleArgument) =>
  runQuery<Role>((supabase) => supabase
    .from("roles")
    .insert(role)
    .select("*")
    .single()
  );

export const getRole = ({ authUuid }: { authUuid: string }) => 
  runQuery((supabase) => supabase
    .from("roles")
    .select("*, users(*)")
    .eq("auth_user_uuid", authUuid)
    .single()
  );

export const getUserRole = () =>
  getUser()
    .andThen((user) => getRole({ authUuid: user.id }))
    .mapErr((error) => error.message.includes("Auth session missing") 
      ? {
          message: "User is not logged in",
          code: "NOT_LOGGED_IN",
        } as GetRoleUserError
      : error
    )