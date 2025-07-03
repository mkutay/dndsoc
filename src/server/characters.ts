"use server";

import { okAsync, ResultAsync } from "neverthrow";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { addCharacterSchema, characterEditSchema } from "@/config/character-schema";
import { resultAsyncToActionResult } from "@/types/error-typing";
import { parseSchema } from "@/utils/parse-schema";
import { runQuery } from "@/utils/supabase-run";
import { convertToShortened } from "@/utils/formatting";
import { deleteCharacterClass } from "@/lib/characters";
import { deleteCharacterRace, upsertCharacterRace, upsertRace } from "@/lib/races";

export const insertCharacter = async (values: z.infer<typeof addCharacterSchema>, playerUuid: string) =>
  resultAsyncToActionResult(
    parseSchema(addCharacterSchema, values)
      .asyncAndThen(() =>
        runQuery(
          (supabase) =>
            supabase
              .from("characters")
              .insert({
                name: values.name,
                player_uuid: playerUuid,
                shortened: convertToShortened(values.name),
              })
              .select()
              .single(),
          "insertCharacter",
        ),
      )
      .map((result) => ({
        shortened: result.shortened,
      })),
  );

export async function updateCharacter(values: z.infer<typeof characterEditSchema>, characterShortened: string) {
  const character = runQuery((supabase) =>
    supabase.from("characters").select("*, races(*), classes(*)").eq("shortened", characterShortened).single(),
  );

  const charactersResult = parseSchema(characterEditSchema, values).asyncAndThen(() =>
    runQuery(
      (supabase) =>
        supabase
          .from("characters")
          .update({
            about: values.about,
            level: values.level,
          })
          .eq("shortened", characterShortened),
      "updateCharacterCharactersResult",
    ),
  );

  const characterClassResult = character.andThen((character) =>
    updateClasses({ classes: values.classes, characterId: character.id }),
  );

  const characterRaceResult = character.andThen((character) =>
    updateRace({ race: values.race, characterId: character.id }),
  );

  const result = ResultAsync.combine([charactersResult, characterClassResult, characterRaceResult]);
  return resultAsyncToActionResult(result);
}

const updateRace = ({ race, characterId }: { race: string; characterId: string }) =>
  deleteCharacterRace({ characterId })
    .andThen(() => upsertRace({ race }))
    .andThen((response) =>
      upsertCharacterRace({
        raceId: response.id,
        characterId,
      }),
    );

const updateClasses = ({ classes, characterId }: { classes: { value: string }[]; characterId: string }) =>
  deleteCharacterClass({ characterId })
    .andThen(() =>
      runQuery((supabase) =>
        supabase
          .from("classes")
          .upsert(
            classes.map((cls) => ({ name: cls.value })),
            { ignoreDuplicates: false, onConflict: "name" },
          )
          .select("*"),
      ),
    )
    .andThen((classes) =>
      runQuery((supabase) =>
        supabase.from("character_class").upsert(
          classes.map((cls) => ({
            character_id: characterId,
            class_id: cls.id,
          })),
          { ignoreDuplicates: false },
        ),
      ),
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
    runQuery(
      (supabase) => supabase.from("character_party").delete().eq("party_id", partyId).eq("character_id", characterId),
      "removeCharacterFromParty",
    ).andThen(() => {
      revalidatePath(`/parties/${shortened}`, "page");
      return okAsync();
    }),
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
    runQuery(
      (supabase) =>
        supabase.from("character_party").insert({
          party_id: partyId,
          character_id: characterId,
        }),
      "addCharacterToParty",
    ).andThen(() => {
      revalidatePath(`/parties/${shortened}`, "page");
      return okAsync();
    }),
  );
