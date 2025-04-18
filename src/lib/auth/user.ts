import { runQueryUser } from "@/utils/supabase-run";

export const getUser = () =>
  runQueryUser((supabase) =>
    supabase.auth.getUser()
  )
  .map((response) => response.user)