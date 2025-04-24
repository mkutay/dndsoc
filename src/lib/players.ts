import { Player } from "@/types/full-database.types";
import { runQuery } from "@/utils/supabase-run";
import { getUser } from "./auth";
import { Tables } from "@/types/database.types";

type PlayerArgument = {
  about?: string;
  id?: string;
  level?: number;
  auth_user_uuid: string;
};

type ExtendedPlayer = Player & {
  characters: Tables<"characters">[];
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

export const getPlayers = () => 
  runQuery<Player[]>(
    supabase => 
      supabase
        .from("players")
        .select("*, users(*), received_achievements_player(*, achievements(*))"),
    "getPlayers"
  );

export const getPlayerAuthUserUuid = ({ authUserUuid }: { authUserUuid: string }) => 
  runQuery<Player>((supabase) =>
    supabase
      .from("players")
      .select(`*, users(*), received_achievements_player(*, achievements(*))`)
      .eq("auth_user_uuid", authUserUuid)
      .single()
  );

export const getPlayerByUsername = ({ username }: { username: string }) =>
  runQuery<ExtendedPlayer>((supabase) =>
    supabase
      .from("players")
      .select(`*, users!inner(*), received_achievements_player(*, achievements(*)), characters(*)`)
      .eq("users.username", username)
      .single(),
    "getPlayerByUsername"
  );

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
  .mapErr((error) => error.message.includes("Auth session missing") 
    ? {
        message: "User is not logged in",
        code: "NOT_LOGGED_IN",
      } as NotLoggedInError
    : error
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

export const getDMRoleUser = () =>
  getUser()
  .andThen((user) =>
    runQuery((supabase) => supabase
      .from("users")
      .select(`*, roles!inner(*), dms!inner(*)`)
      .eq("auth_user_uuid", user.id)
      .single(),
      "getDMRoleUser"
    )
  )
  .mapErr((error) => error.message.includes("Auth session missing") 
    ? {
        message: "User is not logged in",
        code: "NOT_LOGGED_IN",
      } as NotLoggedInError
    : error
  );