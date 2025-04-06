"use server";

import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { z } from "zod";

import { createClient } from "@/utils/supabase/server";
import { actionErr, ActionResult, resultAsyncToActionResult } from "@/types/error-typing";
import { characterEditSchema } from "@/app/characters/[shortened]/edit/schema";

type UpdateCharacterError = {
  message: string;
  code: "DATABASE_ERROR" | "SUPABASE_CLIENT_ERROR" | "INVALID_FORM";
};

export async function updateCharacter(values: z.infer<typeof characterEditSchema>, characterId: string):
  Promise<ActionResult<void, UpdateCharacterError>> {

  const validation = characterEditSchema.safeParse(values);
  if (!validation.success) {
    return actionErr({
      message: "Invalid input data.",
      code: "INVALID_FORM",
    });
  }

  const supabase = ResultAsync.fromPromise(createClient(), () => ({
    message: "Failed to create Supabase client.",
    code: "SUPABASE_CLIENT_ERROR",
  } as UpdateCharacterError));

  const charactersResult = supabase
    .andThen((supabase) => {
      const response = supabase
        .from("characters")
        .update({
          about: values.about,
          level: values.level,
        })
        .eq("id", characterId);

      return ResultAsync.fromPromise(response, (error) => ({
        message: `Failed to update characters table: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: "DATABASE_ERROR",
      } as UpdateCharacterError));
    })
    .andThen((response) => {
      if (response.error) {
        return errAsync({
          message: "Failed to update characters table: " + response.error.message,
          code: "DATABASE_ERROR",
        } as UpdateCharacterError);
      }
      return okAsync();
    });

  const characterClassResult = updateClasses({ classes: values.classes, characterId });

  const characterRaceResult = updateRace({ race: values.race, characterId });

  const result = ResultAsync
    .combine([charactersResult, characterClassResult, characterRaceResult])

  return resultAsyncToActionResult(result);
}

function updateRace({ race, characterId }: { race: string; characterId: string; }) {
  const supabase = ResultAsync.fromPromise(createClient(), () => ({
    message: "Failed to create Supabase client.",
    code: "SUPABASE_CLIENT_ERROR",
  } as UpdateCharacterError));

  const racesResult = supabase
    .andThen((supabase) => {
      const response = supabase
        .from("races")
        .upsert({ name: race }, { ignoreDuplicates: false, onConflict: "name" })
        .select("*");

      return ResultAsync.fromPromise(response, (error) => ({
        message: `Failed to update races table: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: "DATABASE_ERROR",
      } as UpdateCharacterError));
    })
    .andThen((response) => {
      if (response.error) {
        return errAsync({
          message: "Failed to update races table: " + response.error.message,
          code: "DATABASE_ERROR",
        } as UpdateCharacterError);
      }
      return okAsync(response.data);
    });

  const characterRaceResult = ResultAsync
    .combine([racesResult, supabase])
    .andThen(([racesResult, supabase]) => {
      const response = supabase
        .from("character_race")
        .update({
          race_id: racesResult.find((r) => r.name === race)?.id,
        })
        .eq("character_id", characterId);
      
      return ResultAsync.fromPromise(response, (error) => ({
        message: `Failed to update character_race table: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: "DATABASE_ERROR",
      } as UpdateCharacterError));
    })
    .andThen((response) => {
      if (response.error) {
        return errAsync({
          message: "Failed to update character_race table: " + response.error.message,
          code: "DATABASE_ERROR",
        } as UpdateCharacterError);
      }
      return okAsync();
    });

  return characterRaceResult;
}

function updateClasses({
  classes,
  characterId,
}: {
  classes: { value: string }[];
  characterId: string;
}) {
  const supabase = ResultAsync.fromPromise(createClient(), () => ({
    message: "Failed to create Supabase client.",
    code: "SUPABASE_CLIENT_ERROR",
  } as UpdateCharacterError));

  const classesResult = supabase
    .andThen((supabase) => {
      const response = supabase
        .from("classes")
        .upsert(
          classes.map((cls) => ({ name: cls.value })),
          { ignoreDuplicates: false, onConflict: "name" },
        )
        .select("*");

      return ResultAsync.fromPromise(response, (error) => ({
        message: `Failed to update classes table: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: "DATABASE_ERROR",
      } as UpdateCharacterError));
    })
    .andThen((response) => {
      if (response.error) {
        return errAsync({
          message: "Failed to update classes table: " + response.error.message,
          code: "DATABASE_ERROR",
        } as UpdateCharacterError);
      }
      return okAsync(response.data);
    });

  const characterClassDeletionResult = ResultAsync
    .combine([classesResult, supabase])
    .andThen(([classesResult, supabase]) => {
      console.log(classesResult)
      const response = supabase
        .from("character_class")
        .delete()
        .eq("character_id", characterId)

      return ResultAsync.fromPromise(response, (error) => ({
        message: `Failed to delete in the character_class table: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: "DATABASE_ERROR",
      } as UpdateCharacterError));
    })
    .andThen((response) => {
      if (response.error) {
        return errAsync({
          message: "Failed to delete in the character_class table: " + response.error.message,
          code: "DATABASE_ERROR",
        } as UpdateCharacterError);
      }
      return okAsync();
    });

  const characterClassResult = ResultAsync
    .combine([classesResult, supabase])
    .andThen(([classesResult, supabase]) => {
      const response = supabase
        .from("character_class")
        .upsert(classes.map((cls) => ({
          character_id: characterId,
          class_id: classesResult.find((c) => c.name === cls.value)?.id,
        })));

      return ResultAsync.fromPromise(response, (error) => ({
        message: `Failed to update character_class table: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: "DATABASE_ERROR",
      } as UpdateCharacterError));
    })
    .andThen((response) => {
      if (response.error) {
        return errAsync({
          message: "Failed to update character_class table: " + response.error.message,
          code: "DATABASE_ERROR",
        } as UpdateCharacterError);
      }
      return okAsync();
    });

  const result = ResultAsync
    .combine([characterClassDeletionResult, characterClassResult])

  return result;
}