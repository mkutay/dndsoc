import { getUser } from "./auth/user";
import { runQuery } from "@/utils/supabase-run";

export const getPlayerUser = () => 
  getUser()
  .andThen((user) => 
    runQuery((supabase) => supabase
      .from("players")
      .select(`*, users(*)`)
      .eq("auth_user_uuid", user.id)
      .single()
    )
  )