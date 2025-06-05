"use server";

import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { addCharacterSchema } from "@/config/add-character-schema";
import { characterEditSchema } from "@/config/character-edit-schema";
import { resultAsyncToActionResult } from "@/types/error-typing";
import { parseSchema } from "@/utils/parse-schema";
import { runQuery } from "@/utils/supabase-run";
import { convertToShortened } from "@/utils/formatting";
import DB from "@/lib/db";

export const insertCharacter = async (values: z.infer<typeof addCharacterSchema>, playerUuid: string) =>
  resultAsyncToActionResult(
    parseSchema(addCharacterSchema, values)
      .asyncAndThen(() =>
        runQuery((supabase) => supabase
          .from("characters")
          .insert({
            name: values.name,
            player_uuid: playerUuid,
            shortened: convertToShortened(values.name),
          })
          .select()
          .single(),
          "insertCharacter"
        )
      )
      .map((result) => ({
        shortened: result.shortened
      }))
  );

export async function updateCharacter(values: z.infer<typeof characterEditSchema>, characterShortened: string) {
  const character = DB.Characters.Get.Shortened({ shortened: characterShortened });

  const charactersResult = parseSchema(characterEditSchema, values)
    .asyncAndThen(() => runQuery((supabase) => supabase
      .from("characters")
      .update({
        about: values.about,
        level: values.level,
      })
      .eq("shortened", characterShortened),
      "updateCharacterCharactersResult"
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
  DB.CharacterRace.Delete({ characterId })
    .andThen(() => DB.Races.Upsert({ race }))
    .andThen((response) => 
      DB.CharacterRace.Upsert({
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
  DB.CharacterClass.Delete({ characterId })
    .andThen(() => DB.Classes.Insert({ classes: classes.map((cls) => ({ name: cls.value })) }))
    .andThen((classes) =>
      DB.CharacterClass.Upsert({
        classes: classes.map((cls) => ({
          character_id: characterId,
          class_id: cls.id,
        }))
      })
    );

export const removeCharacterFromParty = async ({
  characterId,
  partyId,
  shortened,
}: {
  characterId: string;
  partyId: string;
  shortened: string;
}) =>
  resultAsyncToActionResult(
    runQuery((supabase) =>
      supabase
        .from("character_party")
        .delete()
        .eq("party_id", partyId)
        .eq("character_id", characterId),
      "removeCharacterFromParty"
    )
    .andThen(() => {
      revalidatePath(`/parties/${shortened}`, "page");
      return okAsync();
    })
  );

export const addCharacterToParty = async ({
  characterId,
  partyId,
  shortened,
}: {
  characterId: string;
  partyId: string;
  shortened: string;
}) =>
  resultAsyncToActionResult(
    runQuery((supabase) =>
      supabase
        .from("character_party")
        .insert({
          party_id: partyId,
          character_id: characterId,
        }),
      "addCharacterToParty"
    )
    .andThen(() => {
      revalidatePath(`/parties/${shortened}`, "page");
      return okAsync();
    })
  );