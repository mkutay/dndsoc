import { getUser } from "./auth";
import { runQuery } from "@/utils/supabase-run";

type NotLoggedInError = {
  message: string;
  code: "NOT_LOGGED_IN";
};

export const upsertPlayer = (player: { auth_user_uuid: string }) =>
  runQuery((supabase) =>
    supabase
      .from("players")
      .upsert(player, { onConflict: "auth_user_uuid", ignoreDuplicates: false })
      .select("*")
      .single(),
  );

export const getPlayerRoleUser = () =>
  getUser()
    .andThen((user) =>
      runQuery(
        (supabase) =>
          supabase.from("users").select(`*, roles!inner(*), players!inner(*)`).eq("auth_user_uuid", user.id).single(),
        "getPlayerRoleUser",
      ),
    )
    .mapErr((error) =>
      error.message.includes("Auth session missing")
        ? ({
            message: "User is not logged in",
            code: "NOT_LOGGED_IN",
          } as NotLoggedInError)
        : error,
    );

export const getPlayerByUsername = ({ username }: { username: string }) =>
  runQuery(
    (supabase) =>
      supabase
        .from("players")
        .select(
          `*, users!inner(*), received_achievements_player(*, achievements(*)), characters(*, races(*), classes(*)), images(*)`,
        )
        .eq("users.username", username)
        .single(),
    "getPlayerByUsername",
  );
