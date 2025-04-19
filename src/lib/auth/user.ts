import { runQueryUser } from "@/utils/supabase-run";

export const getUser = () =>
  runQueryUser((supabase) =>
    supabase.auth.getUser(),
    "getUser"
  )
  .map((response) => response.user)