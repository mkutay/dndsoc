"use server";

import { revalidatePath } from "next/cache";
import z from "zod";

import { resultAsyncToActionResult } from "@/types/error-typing";
import { giveAchievementSchema, removeAchievementSchema } from "@/config/achievements";
import { parseSchema } from "@/utils/parse-schema";
import { runQuery } from "@/utils/supabase-run";

export const removeAchievement = async (values: z.infer<typeof removeAchievementSchema>, path: string) =>
  resultAsyncToActionResult(
    parseSchema(removeAchievementSchema, values)
      .asyncAndThen((parsed) =>
        parsed.removalType === "player"
          ? removePlayerAchievement(parsed.removalId, parsed.achievementId)
          : parsed.removalType === "dm"
            ? removeDMAchievement(parsed.removalId, parsed.achievementId)
            : removeCharacterAchievement(parsed.removalId, parsed.achievementId),
      )
      .andTee(() => revalidatePath(path)),
  );

const removePlayerAchievement = (playerUuid: string, achievementId: string) =>
  runQuery((supabase) =>
    supabase
      .from("received_achievements_player")
      .delete()
      .eq("player_uuid", playerUuid)
      .eq("achievement_uuid", achievementId),
  );

const removeDMAchievement = (dmUuid: string, achievementId: string) =>
  runQuery((supabase) =>
    supabase.from("received_achievements_dm").delete().eq("dm_uuid", dmUuid).eq("achievement_uuid", achievementId),
  );

const removeCharacterAchievement = (characterUuid: string, achievementId: string) =>
  runQuery((supabase) =>
    supabase
      .from("received_achievements_character")
      .delete()
      .eq("character_uuid", characterUuid)
      .eq("achievement_uuid", achievementId),
  );

export const giveAchievement = async (values: z.infer<typeof giveAchievementSchema>, path: string) =>
  resultAsyncToActionResult(
    parseSchema(giveAchievementSchema, values)
      .asyncAndThen((parsed) =>
        parsed.receiverType === "player"
          ? givePlayerAchievement(parsed.receiverId, parsed.achievementId)
          : parsed.receiverType === "dm"
            ? giveDMAchievement(parsed.receiverId, parsed.achievementId)
            : giveCharacterAchievement(parsed.receiverId, parsed.achievementId),
      )
      .andTee(() => revalidatePath(path)),
  );

const givePlayerAchievement = (playerUuid: string, achievementId: string) =>
  runQuery((supabase) =>
    supabase
      .from("received_achievements_player")
      .select("*")
      .eq("player_uuid", playerUuid)
      .eq("achievement_uuid", achievementId),
  ).andThen((result) =>
    result.length === 0
      ? runQuery((supabase) =>
          supabase.from("received_achievements_player").insert({
            player_uuid: playerUuid,
            achievement_uuid: achievementId,
            first_received_date: new Date().toISOString(),
            last_received_date: new Date().toISOString(),
          }),
        )
      : runQuery((supabase) =>
          supabase
            .from("received_achievements_player")
            .update({
              last_received_date: new Date().toISOString(),
              count: result[0].count + 1,
            })
            .eq("player_uuid", playerUuid)
            .eq("achievement_uuid", achievementId),
        ),
  );

const giveDMAchievement = (dmUuid: string, achievementId: string) =>
  runQuery((supabase) =>
    supabase.from("received_achievements_dm").select("*").eq("dm_uuid", dmUuid).eq("achievement_uuid", achievementId),
  ).andThen((result) =>
    result.length === 0
      ? runQuery((supabase) =>
          supabase.from("received_achievements_dm").insert({
            dm_uuid: dmUuid,
            achievement_uuid: achievementId,
            first_received_date: new Date().toISOString(),
            last_received_date: new Date().toISOString(),
          }),
        )
      : runQuery((supabase) =>
          supabase
            .from("received_achievements_dm")
            .update({
              last_received_date: new Date().toISOString(),
              count: result[0].count + 1,
            })
            .eq("dm_uuid", dmUuid)
            .eq("achievement_uuid", achievementId),
        ),
  );

const giveCharacterAchievement = (characterUuid: string, achievementId: string) =>
  runQuery((supabase) =>
    supabase
      .from("received_achievements_character")
      .select("*")
      .eq("character_uuid", characterUuid)
      .eq("achievement_uuid", achievementId),
  ).andThen((result) =>
    result.length === 0
      ? runQuery((supabase) =>
          supabase.from("received_achievements_character").insert({
            character_uuid: characterUuid,
            achievement_uuid: achievementId,
            first_received_date: new Date().toISOString(),
            last_received_date: new Date().toISOString(),
          }),
        )
      : runQuery((supabase) =>
          supabase
            .from("received_achievements_character")
            .update({
              last_received_date: new Date().toISOString(),
              count: result[0].count + 1,
            })
            .eq("character_uuid", characterUuid)
            .eq("achievement_uuid", achievementId),
        ),
  );
