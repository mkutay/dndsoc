import { runQuery } from "@/utils/supabase-run";
import { getUser } from "./auth";

type PlayerArgument = {
  about?: string;
  id?: string;
  level?: number;
  auth_user_uuid: string;
};

type NotLoggedInError = {
  message: string;
  code: "NOT_LOGGED_IN";
};

export const insertPlayer = (player: PlayerArgument) =>
  runQuery((supabase) =>
    supabase
      .from("players")
      .insert(player)
      .select("*")
      .single()
  );

export const upsertPlayer = (player: PlayerArgument) =>
  runQuery((supabase) =>
    supabase
      .from("players")
      .upsert(player, { onConflict: "auth_user_uuid", ignoreDuplicates: false })
      .select("*")
      .single()
  );

export const getPlayerByUsername = ({ username }: { username: string }) =>
  runQuery((supabase) =>
    supabase
      .from("players")
      .select(`*, users!inner(*), received_achievements_player(*, achievements(*)), characters(*)`)
      .eq("users.username", username)
      .single(),
    "getPlayerByUsername"
  );

// Some thing to consider: the admin might not have a player -- so the "!inner" might fail
export const getPlayerRoleUser = () =>
  getUser()
  .andThen((user) =>
    runQuery((supabase) => supabase
      .from("users")
      .select(`*, roles!inner(*), players!inner(*)`)
      .eq("auth_user_uuid", user.id)
      .single(),
      "getPlayerRoleUser"
    )
  )
  .mapErr((error) => error.message.includes("Auth session missing") 
    ? {
        message: "User is not logged in",
        code: "NOT_LOGGED_IN",
      } as NotLoggedInError
    : error
  );