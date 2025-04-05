"use server";

import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { ActionResult, resultAsyncToActionResult } from "@/types/error-typing";
import { Tables } from "@/types/database.types";
import { createClient } from "@/utils/supabase/server";

type GetPlayerDataError = {
  message: string;
  code: "DATABASE_ERROR" | "SUPABASE_CLIENT_ERROR";
};

type Player = Tables<"players">;

export async function getPlayerData(username: string):
  Promise<ActionResult<Player, GetPlayerDataError>> {

  const supabase = ResultAsync.fromPromise(createClient(), () => ({
    message: "Failed to create Supabase client.",
    code: "SUPABASE_CLIENT_ERROR",
  } as GetPlayerDataError));

  const userUuidResult = supabase.andThen((supabase) => {
    const response = supabase
      .from("users")
      .select("user_uuid")
      .eq("username", username)
      .single();

    return ResultAsync.fromPromise(response, () => ({
      message: "Failed to get player data with username from Supabase.",
      code: "DATABASE_ERROR",
    } as GetPlayerDataError));
  }).andThen((response) => {
    if (response.error) {
      return errAsync({
        message: "Failed to get player data with username from Supabase: " + response.error.message,
        code: "DATABASE_ERROR",
      } as GetPlayerDataError);
    }
    const { user_uuid } = response.data;
    return okAsync(user_uuid);
  });

  const result = ResultAsync
    .combine([supabase, userUuidResult])
    .andThen(([supabase, userUuidResult]) => {
      const response = supabase
        .from("players")
        .select("*")
        .eq("user_uuid", userUuidResult)
        .single();

      return ResultAsync.fromPromise(response, () => ({
        message: "Failed to get player data from Supabase.",
        code: "DATABASE_ERROR",
      } as GetPlayerDataError));
    })
    .andThen((response) => {
      if (response.error) {
        return errAsync({
          message: "Failed to get player data from Supabase: " + response.error.message,
          code: "DATABASE_ERROR",
        } as GetPlayerDataError);
      }
      const playerData = response.data;
      if (!playerData) {
        return errAsync({
          message: "Player data not found.",
          code: "DATABASE_ERROR",
        } as GetPlayerDataError);
      }
      return okAsync(playerData);
    });

  return resultAsyncToActionResult(result);
}