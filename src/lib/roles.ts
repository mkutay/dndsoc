import { getUser } from "./auth";
import { runQuery } from "@/utils/supabase-run";

export const getRole = (user: { id: string }) =>
  runQuery((supabase) => supabase.from("roles").select("*, users(*)").eq("auth_user_uuid", user.id).single());

export const getUserRole = () => getUser().andThen(getRole);
