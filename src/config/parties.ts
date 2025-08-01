import { z } from "zod";
import { imageSchema } from "./avatar-upload-schema";

const aboutSchema = z.string().max(1000, "About must be 1000 characters or less.");
const nameSchema = z.string().min(1, "Name is required.").max(60, "Name must be less than 60 characters.");

export const partyPlayerEditSchema = z.object({
  about: aboutSchema,
  partyId: z.uuid(),
});

export const partyDMEditSchema = z.object({
  about: aboutSchema,
  name: nameSchema,
  level: z.number().min(1, "Level must be at least 1.").max(20, "Level must be at most 20."),
  characters: z
    .array(
      z.object({
        id: z.string().min(1, "Character is required."),
      }),
    )
    .refine(
      (characters) => new Set(characters.map((character) => character.id)).size === characters.length,
      "Characters must be unique.",
    ),
  selectedCharacter: z.string().optional(), // For the combobox
  selectedCampaign: z.string().optional(), // For the combobox
  selectedDM: z.string().optional(), // For the combobox
  image: imageSchema.optional(),
  partyId: z.uuid(),
});

export const createPartySchema = z.object({
  name: nameSchema,
});
