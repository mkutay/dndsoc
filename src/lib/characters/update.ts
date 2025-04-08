"use server";

import { errAsync, fromPromise, okAsync, ResultAsync } from "neverthrow";
import { z } from "zod";

import { characterEditSchema } from "@/app/characters/[shortened]/edit/schema";
import { resultAsyncToActionResult } from "@/types/error-typing";
import { createClient } from "@/utils/supabase/server";
import { parseSchema } from "@/utils/parse-schema";
import { upsertCharacterRace } from "@/lib/races/upsert-character-race";
import { deleteCharacterRace } from "@/lib/races/delete-character-race";
import { insertClasses } from "@/lib/classes/insert";
import { upsertRace } from "@/lib/races/upsert";
import { deleteCharacterClass } from "./delete-character-class";
import { upsertCharacterClass } from "./upsert-character-class";

type UpdateCharacterError = {
  message: string;
  code: "DATABASE_ERROR";
};

export async function updateCharacter(values: z.infer<typeof characterEditSchema>, characterId: string) {
  const charactersResult =
    parseSchema(characterEditSchema, values)
    .asyncAndThen(() => createClient())
    .andThen((supabase) => 
      fromPromise(
        supabase
          .from("characters")
          .update({
            about: values.about,
            level: values.level,
          })
          .eq("id", characterId),
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

  const characterClassResult = updateClasses({ classes: values.classes, characterId });
  const characterRaceResult = updateRace({ race: values.race, characterId });

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