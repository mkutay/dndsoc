import { runQuery } from "@/utils/supabase-run";

export const getRole = ({ authUuid }: { authUuid: string }) => 
  runQuery((supabase) => supabase
    .from("roles")
    .select("*")
    .eq("auth_user_uuid", authUuid)
    .single()
  )