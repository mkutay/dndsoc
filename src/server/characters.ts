"use server";

import { okAsync } from "neverthrow";
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

export const updateCharacter = async (values: z.infer<typeof characterEditSchema>, path: string) =>
  resultAsyncToActionResult(
    parseSchema(characterEditSchema, values)
      .asyncAndThen((parsed) =>
        runQuery(
          (supabase) =>
            supabase
              .from("characters")
              .update({
                about: values.about,
                level: values.level,
              })
              .eq("id", values.characterId)
              .select()
              .single(),
          "UPDATE_CHARACTERS",
        ).map(({ shortened }) => ({ shortened, parsed })),
      )
      .andThrough(({ parsed }) => updateClasses({ classes: parsed.classes, characterId: parsed.characterId }))
      .andThrough(({ parsed }) => updateRace({ race: parsed.race, characterId: parsed.characterId }))
      .andThen(({ parsed, shortened }) =>
        values.avatar
          ? uploadImageCharacter({
              file: values.avatar,
              shortened,
              characterId: parsed.characterId,
            })
          : okAsync(),
      )
      .andTee(() => revalidatePath(path)),
  );

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
