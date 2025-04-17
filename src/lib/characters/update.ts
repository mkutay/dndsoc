"use server";

import { errAsync, fromPromise, okAsync, ResultAsync } from "neverthrow";
import { z } from "zod";

import { characterEditSchema } from "@/config/character-edit-schema";
import { resultAsyncToActionResult } from "@/types/error-typing";
import { createClient } from "@/utils/supabase/server";
import { parseSchema } from "@/utils/parse-schema";
import { upsertCharacterRace } from "@/lib/races/upsert-character-race";
import { deleteCharacterRace } from "@/lib/races/delete-character-race";
import { insertClasses } from "@/lib/classes/insert";
import { upsertRace } from "@/lib/races/upsert";
import { getPlayerUser } from "@/lib/player-user";
import { deleteCharacterClass } from "./delete-character-class";
import { upsertCharacterClass } from "./upsert-character-class";
import { getCharacterByShortened } from "./query-shortened";

type UpdateCharacterError = {
  message: string;
  code: "DATABASE_ERROR" | "NOT_AUTHORISED";
};

export async function updateCharacter(values: z.infer<typeof characterEditSchema>, characterShortened: string) {
  const character = ResultAsync
    .combine([getCharacterByShortened({ shortened: characterShortened }), getPlayerUser()])
    .andThen(([character, playerUser]) => 
      character.player_uuid === playerUser.id
        ? okAsync(character)
        : errAsync({
            message: "You do not have permission to edit this character.",
            code: "NOT_AUTHORISED",
          } as UpdateCharacterError)
    )

  const charactersResult = parseSchema(characterEditSchema, values)
    .asyncAndThen(() => createClient())
    .andThen((supabase) => 
      fromPromise(
        supabase
          .from("characters")
          .update({
            about: values.about,
            level: values.level,
          })
          .eq("shortened", characterShortened),
        (error) => ({
          message: `Failed to update characters table: ${error instanceof Error ? error.message : 'Unknown error'}`,
          code: "DATABASE_ERROR",
        } as UpdateCharacterError)
      )
    )
    .andThen((response) => 
      !response.error
        ? okAsync()
        : errAsync({
            message: "Failed to update characters table: " + response.error.message,
            code: "DATABASE_ERROR",
          } as UpdateCharacterError)
    );

  const characterClassResult = character
    .andThen((character) =>
      updateClasses({ classes: values.classes, characterId: character.id })
    );

  const characterRaceResult = character
    .andThen((character) =>
      updateRace({ race: values.race, characterId: character.id })
    );

  const result = ResultAsync.combine([charactersResult, characterClassResult, characterRaceResult])
  return resultAsyncToActionResult(result);
}

const updateRace = ({ race, characterId }: { race: string; characterId: string; }) =>
  deleteCharacterRace({ characterId })
    .andThen(() =>
      upsertRace({ race })
        .andThen((response) => 
          upsertCharacterRace({
            raceId: response.id,
            characterId,
          })
        )
    );

const updateClasses = ({
  classes,
  characterId,
}: {
  classes: { value: string }[];
  characterId: string;
}) =>
  deleteCharacterClass({ characterId })
    .andThen(() =>
      insertClasses({ classes: classes.map((cls) => ({ name: cls.value })) })
        .andThen((classes) =>
          upsertCharacterClass({
            classes: classes.map((cls) => ({
              character_id: characterId,
              class_id: cls.id,
            }))
          })
        )
    );