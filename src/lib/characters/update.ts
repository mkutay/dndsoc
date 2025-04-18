"use server";

import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { z } from "zod";

import { characterEditSchema } from "@/config/character-edit-schema";
import { resultAsyncToActionResult } from "@/types/error-typing";
import { parseSchema } from "@/utils/parse-schema";
import { upsertCharacterRace } from "@/lib/races";
import { deleteCharacterRace } from "@/lib/races";
import { insertClasses } from "@/lib/classes";
import { upsertRace } from "@/lib/races";
import { getPlayerUser } from "@/lib/player-user";
import { deleteCharacterClass } from "./delete-character-class";
import { upsertCharacterClass } from "./upsert-character-class";
import { getCharacterByShortened } from "./query-shortened";
import { runQuery } from "@/utils/supabase-run";

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
    .asyncAndThen(() => runQuery((supabase) => supabase
      .from("characters")
      .update({
        about: values.about,
        level: values.level,
      })
      .eq("shortened", characterShortened)
  ))

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
    .andThen(() => upsertRace({ race }))
    .andThen((response) => 
      upsertCharacterRace({
        raceId: response.id,
        characterId,
      })
    );

const updateClasses = ({
  classes,
  characterId,
}: {
  classes: { value: string }[];
  characterId: string;
}) =>
  deleteCharacterClass({ characterId })
    .andThen(() => insertClasses({ classes: classes.map((cls) => ({ name: cls.value })) }))
    .andThen((classes) =>
      upsertCharacterClass({
        classes: classes.map((cls) => ({
          character_id: characterId,
          class_id: cls.id,
        }))
      })
    );