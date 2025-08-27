"use server";

import { revalidatePath } from "next/cache";
import z from "zod";

import { okAsync } from "neverthrow";
import { resultAsyncToActionResult } from "@/types/error-typing";
import {
  createAchievementSchema,
  editAchievementSchema,
  giveAchievementSchema,
  removeAchievementSchema,
  requestAchievementSchema,
} from "@/config/achievements";
import { parseSchema } from "@/utils/parse-schema";
import { runQuery } from "@/utils/supabase-run";
import { convertToShortened } from "@/utils/formatting";
import { getUser } from "@/lib/auth";

export const deleteAchievement = async (id: string) =>
  resultAsyncToActionResult(runQuery((supabase) => supabase.from("achievements").delete().eq("id", id)));

export const createAchievement = async (values: z.infer<typeof createAchievementSchema>) =>
  resultAsyncToActionResult(
    parseSchema(createAchievementSchema, values).asyncAndThen((parsed) =>
      runQuery((supabase) =>
        supabase.from("achievements").insert({
          name: parsed.name,
          shortened: convertToShortened(parsed.name),
        }),
      ),
    ),
  );

export const editAchievement = async (values: z.infer<typeof editAchievementSchema>, path: string) =>
  resultAsyncToActionResult(
    parseSchema(editAchievementSchema, values)
      .asyncAndThen((parsed) =>
        runQuery((supabase) =>
          supabase
            .from("achievements")
            .update({
              name: parsed.name,
              shortened: parsed.shortened,
              description: parsed.description,
              description_long: parsed.descriptionLong,
              points: parsed.points,
              difficulty: parsed.difficulty,
              type: parsed.type,
              is_hidden: parsed.isHidden,
            })
            .eq("id", parsed.id),
        ),
      )
      .andTee(() => revalidatePath(path)),
  );

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

export const requestAchievement = async (values: z.infer<typeof requestAchievementSchema>, path: string) =>
  resultAsyncToActionResult(
    parseSchema(requestAchievementSchema, values)
      .asyncAndThen((parsed) =>
        parsed.receiverType === "player"
          ? requestPlayerAchievement(parsed.receiverId, parsed.achievementId)
          : parsed.receiverType === "dm"
            ? requestDMAchievement(parsed.receiverId, parsed.achievementId)
            : requestCharacterAchievement(parsed.receiverId, parsed.achievementId),
      )
      .andTee(() => revalidatePath(path)),
  );

const requestCharacterAchievement = (characterUuid: string, achievementId: string) =>
  runQuery((supabase) =>
    supabase.from("achievement_requests_character").insert({
      character_id: characterUuid,
      achievement_id: achievementId,
      status: "pending",
    }),
  );

const requestPlayerAchievement = (playerUuid: string, achievementId: string) =>
  runQuery((supabase) =>
    supabase.from("achievement_requests_player").insert({
      player_id: playerUuid,
      achievement_id: achievementId,
      status: "pending",
    }),
  );

const requestDMAchievement = (dmUuid: string, achievementId: string) =>
  runQuery((supabase) =>
    supabase.from("achievement_requests_dm").insert({
      dm_id: dmUuid,
      achievement_id: achievementId,
      status: "pending",
    }),
  );

export const removeDeniedRequest = async (
  achievementId: string,
  receiverId: string,
  receiver: "character" | "player" | "dm",
  path: string,
) =>
  resultAsyncToActionResult(
    runQuery((supabase) =>
      supabase
        .from(`achievement_requests_${receiver}`)
        .delete()
        .eq("achievement_id", achievementId)
        .eq(`${receiver}_id`, receiverId),
    ).andTee(() => revalidatePath(path)),
  );

export const rejectAchievementRequest = async (
  achievementId: string,
  receiverId: string,
  receiver: "character" | "player" | "dm",
  path: string,
) =>
  resultAsyncToActionResult(
    getUser()
      .andThen((user) =>
        receiver === "dm"
          ? okAsync(["decision_by_admin", user.id] as const)
          : runQuery((supabase) => supabase.from("dms").select("id").eq("auth_user_uuid", user.id).single()).andThen(
              ({ id }) => okAsync(["decision_by_dm", id] as const),
            ),
      )
      .andThen(([decisionBy, id]) =>
        runQuery((supabase) =>
          supabase
            .from(`achievement_requests_${receiver}`)
            .update({ status: "denied", [decisionBy]: id })
            .eq("achievement_id", achievementId)
            .eq(`${receiver}_id`, receiverId),
        ),
      )
      .andTee(() => revalidatePath(path)),
  );

export const approveAchievementRequest = async (
  achievementId: string,
  receiverId: string,
  receiver: "character" | "player" | "dm",
  path: string,
) =>
  resultAsyncToActionResult(
    getUser()
      .andThen((user) =>
        receiver === "dm"
          ? okAsync(["decision_by_admin", user.id] as const)
          : runQuery((supabase) => supabase.from("dms").select("id").eq("auth_user_uuid", user.id).single()).andThen(
              ({ id }) => okAsync(["decision_by_dm", id] as const),
            ),
      )
      .andThen(([decisionBy, id]) =>
        runQuery((supabase) =>
          supabase
            .from(`achievement_requests_${receiver}`)
            .update({ status: "approved", [decisionBy]: id })
            .eq("achievement_id", achievementId)
            .eq(`${receiver}_id`, receiverId),
        ),
      )
      .andThen(() =>
        receiver === "character"
          ? giveCharacterAchievement(receiverId, achievementId)
          : receiver === "player"
            ? givePlayerAchievement(receiverId, achievementId)
            : giveDMAchievement(receiverId, achievementId),
      )
      .andTee(() => revalidatePath(path)),
  );

export const removeRequest = async (
  achievementId: string,
  receiverId: string,
  receiver: "character" | "player" | "dm",
  path: string,
) =>
  resultAsyncToActionResult(
    runQuery(
      (supabase) =>
        supabase
          .from(`achievement_requests_${receiver}`)
          .delete()
          .eq("achievement_id", achievementId)
          .eq(`${receiver}_id`, receiverId)
          .neq("status", "pending"), // Ensure we only remove requests that are not pending
    ).andTee(() => revalidatePath(path)),
  );
