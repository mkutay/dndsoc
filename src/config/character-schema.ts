import { z } from "zod";

export const characterEditSchema = z.object({
  about: z.string().max(1000, "About must be 1000 characters or less."),
  level: z
    .number()
    .int("Level must be an integer.")
    .min(1, "Level must be at least 1.")
    .max(20, "Level must be at most 20."),
  race: z.string().min(1, "You must have a race."),
  classes: z
    .array(
      z.object({
        value: z.string().min(1, "Class is required."),
      }),
    )
    .min(1, "At least one class is required."),
});

export const addCharacterSchema = z.object({
  name: z.string().min(1, "Name is required.").max(100, "Name must be less than 100 characters."),
});
