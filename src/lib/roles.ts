import { Enums, Tables } from "@/types/database.types";
import { runQuery } from "@/utils/supabase-run";

type Role = Tables<"roles">;
type RoleArgument = {
  role?: Enums<"role">;
  auth_user_uuid: string;
}

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
    .select("*")
    .eq("auth_user_uuid", authUuid)
    .single()
  );