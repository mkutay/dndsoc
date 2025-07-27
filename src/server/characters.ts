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
import { uploadImageCharacter } from "@/lib/storage";

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

export async function updateCharacter(values: z.infer<typeof characterEditSchema>, path: string) {
  const character = runQuery((supabase) =>
    supabase.from("characters").select("*, races(*), classes(*)").eq("id", values.characterId).single(),
  );

  const parsed = parseSchema(characterEditSchema, values).asyncAndThrough(() =>
    runQuery(
      (supabase) =>
        supabase
          .from("characters")
          .update({
            about: values.about,
            level: values.level,
          })
          .eq("id", values.characterId),
      "updateCharacterCharactersResult",
    ),
  );

  const result = ResultAsync.combine([character, parsed])
    .andThrough(([character, parsed]) => updateClasses({ classes: parsed.classes, characterId: character.id }))
    .andThrough(([character, parsed]) => updateRace({ race: parsed.race, characterId: character.id }))
    .andThrough(([{ id, shortened }]) =>
      values.avatar
        ? uploadImageCharacter({
            file: values.avatar,
            shortened,
            characterId: id,
          })
        : okAsync(),
    )
    .andThen(() => okAsync())
    .andTee(() => revalidatePath(path));

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
    ).andTee(() => revalidatePath(`/parties/${shortened}`, "page")),
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
    ).andTee(() => revalidatePath(`/parties/${shortened}`, "page")),
  );
